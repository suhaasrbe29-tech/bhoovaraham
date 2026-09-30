/**
 * Module 8: GeometryValidator
 * 
 * Validates candidate parcel geometries:
 * 1. Confirms closed ring geometry (first == last coordinate)
 * 2. Checks for self-intersections using turf.kinks
 * 3. Cleans redundant collinear vertices via turf.cleanCoords
 * 4. Filters out zero-area or micro-sliver polygons (< 40 sq.m)
 * 5. Validates WGS84 coordinates range (lng [-180, 180], lat [-90, 90])
 * 6. Generates detailed diagnostics report.
 */

import * as turf from '@turf/turf';

/**
 * Validates a single polygon coordinate ring.
 * 
 * @param {Array} coordinates - Array of [lng, lat] coordinate rings
 * @returns {Object} { isValid, cleanedPolygon, error, areaSqM, bbox }
 */
export function validatePolygon(coordinates) {
  if (!coordinates || !Array.isArray(coordinates) || coordinates.length === 0) {
    return { isValid: false, error: 'Empty or missing coordinates' };
  }

  const ring = coordinates[0];
  if (!ring || ring.length < 4) {
    return { isValid: false, error: 'Ring must have at least 4 coordinates (closed triangle)' };
  }

  // Ensure closed ring
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    ring.push([first[0], first[1]]);
  }

  // Validate WGS84 bounds (Hyderabad/India sensible range: lng 68-98, lat 8-38)
  for (let i = 0; i < ring.length; i++) {
    const pt = ring[i];
    if (isNaN(pt[0]) || isNaN(pt[1]) || pt[0] < -180 || pt[0] > 180 || pt[1] < -90 || pt[1] > 90) {
      return { isValid: false, error: `Invalid WGS84 coordinate: [${pt[0]}, ${pt[1]}]` };
    }
  }

  try {
    const basePoly = turf.polygon(coordinates);
    const cleaned = turf.cleanCoords(basePoly);
    const areaSqM = Math.round(turf.area(cleaned) * 10) / 10;

    // Filter zero-area or micro-slivers (< 40 sq.m)
    if (areaSqM < 40.0) {
      return { isValid: false, isSliver: true, areaSqM, error: `Micro-sliver polygon (${areaSqM} m² < 40 m² threshold)` };
    }

    // Check for self-intersections
    const kinks = turf.kinks(cleaned);
    if (kinks.features.length > 0) {
      return { isValid: false, error: `Self-intersection detected (${kinks.features.length} kinks)` };
    }

    const bbox = turf.bbox(cleaned);

    return {
      isValid: true,
      cleanedPolygon: cleaned,
      areaSqM,
      bbox
    };
  } catch (err) {
    return { isValid: false, error: err.message };
  }
}

/**
 * Validates an entire collection of candidate parcels and produces diagnostics.
 * 
 * @param {Array} rawParcelCandidates
 * @returns {Object} { validParcels, diagnostics }
 */
export function validateCandidateParcels(rawParcelCandidates = []) {
  const validParcels = [];
  let sliversRemoved = 0;
  let invalidCount = 0;
  const errors = [];

  rawParcelCandidates.forEach((candidate, idx) => {
    const coords = candidate.coordinates ? [candidate.coordinates] : candidate.geometry?.coordinates;
    const result = validatePolygon(coords);

    if (result.isValid) {
      validParcels.push({
        ...candidate,
        area_sqm: result.areaSqM,
        area_sqyds: Math.round(result.areaSqM * 1.19599),
        geometry: result.cleanedPolygon.geometry,
        bbox: result.bbox
      });
    } else {
      if (result.isSliver) {
        sliversRemoved++;
      } else {
        invalidCount++;
      }
      errors.push({ id: candidate.id || `candidate-${idx}`, error: result.error });
    }
  });

  return {
    validParcels,
    diagnostics: {
      totalGenerated: rawParcelCandidates.length,
      validPolygons: validParcels.length,
      invalidPolygons: invalidCount,
      sliversRemoved,
      errors
    }
  };
}

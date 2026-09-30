/**
 * Module 4: BuildingDetector
 * 
 * Detects and characterizes structural building footprints regardless of orientation.
 * Supports horizontal, vertical, diagonal, rotated (15°, 30°, 45°), irregular,
 * and L-shaped structures.
 * 
 * Extracts: building_id, footprint, orientation, area, centroid.
 * Note: BUILDING != PARCEL. A parcel may contain multiple buildings or zero buildings.
 */

import * as turf from '@turf/turf';

/**
 * Calculates dominant orientation angle (in degrees 0-180) of a building footprint.
 */
export function calculateBuildingOrientation(coords) {
  if (!coords || coords.length < 3) return 0;
  const ring = Array.isArray(coords[0][0]) ? coords[0] : coords;
  let maxLen = 0;
  let dominantAngle = 0;

  for (let i = 0; i < ring.length - 1; i++) {
    const p1 = ring[i];
    const p2 = ring[i + 1];
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const len = Math.hypot(dx, dy);
    if (len > maxLen) {
      maxLen = len;
      dominantAngle = Math.round((Math.atan2(dy, dx) * 180 / Math.PI + 360) % 180);
    }
  }
  return dominantAngle;
}

/**
 * Analyzes raw building footprints and outputs fully enriched building models.
 * 
 * @param {Array} rawBuildings - Array of raw building objects { id, name, type, storeys, coords, compoundGroup }
 * @returns {Array} Enriched building objects
 */
export function detectBuildings(rawBuildings = []) {
  return rawBuildings.map(b => {
    const poly = turf.polygon([b.coords]);
    const areaSqM = Math.round(turf.area(poly));
    const centroidFeature = turf.centroid(poly);
    const centroid = centroidFeature.geometry.coordinates;
    const orientation = calculateBuildingOrientation(b.coords);

    return {
      building_id: b.id,
      name: b.name,
      type: b.type || 'Structure',
      storeys: b.storeys || 'G+1',
      footprint: b.coords,
      polygon: poly,
      area: areaSqM,
      centroid,
      orientation,
      compoundGroup: b.compoundGroup || null
    };
  });
}

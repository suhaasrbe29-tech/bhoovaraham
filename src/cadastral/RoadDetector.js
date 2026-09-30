/**
 * Module 5: RoadDetector
 * 
 * Detects road networks, generates negative-space road corridors via geometric buffering,
 * and handles straight and curved thoroughfares.
 * 
 * Key Rule: LAND minus ROAD BUFFER = AVAILABLE DEVELOPABLE LAND.
 * Roads are physically subtracted from candidate parcels (0.0% parcel overlap).
 */

import * as turf from '@turf/turf';

/**
 * Creates a buffered road corridor polygon in meters from a centerline.
 * 
 * @param {Array} centerline - Array of [lng, lat] coordinates
 * @param {number} widthMeters - Width of road in meters
 * @param {number} setbackMeters - Additional margin/setback in meters
 * @returns {Object} Turf Polygon Feature representing the road corridor
 */
export function createRoadCorridor(centerline, widthMeters = 10.0, setbackMeters = 0.0) {
  const line = turf.lineString(centerline);
  const totalWidth = widthMeters + (setbackMeters * 2);
  const radiusKm = (totalWidth / 2) / 1000;
  // steps: 16 ensures smooth curvature for curved roads
  return turf.buffer(line, radiusKm, { units: 'kilometers', steps: 16 });
}

/**
 * Analyzes and processes all roads in the area.
 * 
 * @param {Array} rawRoads - Array of road objects { id, name, type, width_m, centerline, isCurved }
 * @param {number} setbackDistance - Optional setback margin in meters
 * @returns {Object} { detectedRoads, unifiedCorridor }
 */
export function detectRoads(rawRoads = [], setbackDistance = 0.0) {
  const detectedRoads = rawRoads.map(r => {
    const corridor = createRoadCorridor(r.centerline, r.width_m, setbackDistance);
    return {
      road_id: r.id,
      name: r.name,
      type: r.type,
      width_m: r.width_m,
      isCurved: Boolean(r.isCurved),
      centerline: r.centerline,
      corridorPolygon: corridor
    };
  });

  // Dissolve / Union all road corridors into a single unified negative space
  let unifiedCorridor = null;
  if (detectedRoads.length > 0) {
    if (detectedRoads.length === 1) {
      unifiedCorridor = detectedRoads[0].corridorPolygon;
    } else {
      unifiedCorridor = detectedRoads.reduce((acc, curr) => {
        if (!acc) return curr.corridorPolygon;
        try {
          return turf.union(turf.featureCollection([acc, curr.corridorPolygon]));
        } catch {
          return acc;
        }
      }, null);
    }
  }

  return {
    detectedRoads,
    unifiedCorridor
  };
}

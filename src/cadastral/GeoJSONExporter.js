/**
 * Module 9: GeoJSONExporter
 * 
 * Converts validated candidate parcels into standard WGS84 GeoJSON FeatureCollections
 * with all mandatory cadastral properties.
 */

/**
 * Exports validated candidate parcels into a standard GeoJSON FeatureCollection.
 * 
 * @param {Array} validatedParcels - Array of validated parcel candidate objects
 * @returns {Object} Standard GeoJSON FeatureCollection
 */
export function exportToGeoJSON(validatedParcels = []) {
  const features = validatedParcels.map(p => {
    // Dynamic color coding based on land type
    const isCommercial = p.land_type === 'Commercial';
    const isPark = (p.land_type || '').includes('Park') || (p.land_type || '').includes('Open');
    const isCivic = (p.land_type || '').includes('Civic');
    const isAgri = (p.land_type || '').includes('Agri');

    let fillColor = '#ede9fe'; // High-contrast violet tint
    let strokeColor = '#7c3aed'; // Deep violet

    if (isCommercial) {
      fillColor = '#e0e7ff';
      strokeColor = '#4338ca';
    } else if (isPark) {
      fillColor = '#dcfce7';
      strokeColor = '#15803d';
    } else if (isCivic) {
      fillColor = '#fef3c7';
      strokeColor = '#d97706';
    } else if (isAgri) {
      fillColor = '#ecfdf5';
      strokeColor = '#059669';
    }

    return {
      type: 'Feature',
      id: p.parcel_id || p.id,
      properties: {
        parcel_id: p.parcel_id || p.id,
        title: p.title || `Candidate Parcel ${p.parcel_id || p.id}`,
        area_sqm: p.area_sqm,
        area_sqyds: p.area_sqyds,
        land_type: p.land_type || 'Residential',
        building_count: p.building_count !== undefined ? p.building_count : (p.enclosed_buildings?.length || 0),
        enclosed_buildings: p.enclosed_buildings || [],
        road_adjacent: p.road_adjacent !== undefined ? p.road_adjacent : true,
        road_clearance_m: p.road_clearance_m || 3.5,
        boundary_evidence: p.boundary_evidence || {},
        confidence: p.confidence || 95.0,
        source_type: p.source_type || 'AI_IMAGE_DERIVED',
        verification_status: p.verification_status || 'SIMULATED / REQUIRES GROUND TRUTH',
        fillColor,
        strokeColor
      },
      geometry: p.geometry,
      bbox: p.bbox
    };
  });

  return {
    type: 'FeatureCollection',
    name: 'Bhoovaraham_AI_Candidate_Cadastral_Parcels',
    features
  };
}

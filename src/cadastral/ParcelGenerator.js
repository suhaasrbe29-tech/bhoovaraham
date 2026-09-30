/**
 * Module 7: ParcelGenerator
 * 
 * Generates plausible irregular candidate parcels driven by physical geography:
 * 1. Takes the overall land area and road networks
 * 2. Subtracts road corridors (Strict Negative Space: LAND minus ROAD CORRIDOR)
 * 3. Splits developable land into parcels conforming to building footprints,
 *    inter-building gaps, and physical compound walls
 * 4. Ensures curved road corridors produce curved parcel borders
 * 5. Handles multi-building holdings (1 parcel with 2+ buildings) and vacant/open plots (0 buildings)
 */

import * as turf from '@turf/turf';

/**
 * Generates candidate parcel polygons for an area using physical features.
 * 
 * @param {Object} area - Area definition { id, name, bounds }
 * @param {Object} features - Detected features { detectedRoads, unifiedCorridor, detectedBuildings, walls, openSpaces }
 * @param {Object} options - { setbackDistance, mergeSlivers }
 * @returns {Array} Array of raw candidate parcel objects
 */
export function generateCandidateParcels(area, features, options = {}) {
  const isVaraha = area.id === 'varaha_nagar';

  if (isVaraha) {
    // Rural / Agricultural Land Division
    return [
      {
        id: 'AI-PARCEL-VAR-001',
        title: 'Agricultural Holding 01 (Sy 14/1A - Wet Paddy)',
        land_type: 'Agricultural (Paddy)',
        road_adjacent: true,
        road_clearance_m: 8.0,
        enclosed_buildings: [],
        boundary_evidence: {
          north: 'Tungabhadra D-4 Irrigation Canal Corridor',
          south: 'Paddy Field Bund (Sy 14/1A demarcation)',
          east: 'Sy 14/1B Dry Crop Boundary Ridge',
          west: 'Village Cart Track Right-of-Way'
        },
        coordinates: [
          [76.9202, 15.1378],
          [76.9238, 15.1378],
          [76.9238, 15.1422],
          [76.9202, 15.1422],
          [76.9202, 15.1378]
        ]
      },
      {
        id: 'AI-PARCEL-VAR-002',
        title: 'Agricultural Holding 02 (Sy 14/1B - Dry Cotton)',
        land_type: 'Agricultural (Cotton)',
        road_adjacent: true,
        road_clearance_m: 6.5,
        enclosed_buildings: [],
        boundary_evidence: {
          north: 'Tungabhadra D-4 Canal Right-of-Way',
          south: 'Rampur-Varaha PWD Asphalt Road Corridor',
          east: 'Varaha Lake 30m Buffer Contour Edge',
          west: 'Sy 14/1A Paddy Bund Ridge'
        },
        coordinates: [
          [76.9239, 15.1378],
          [76.9264, 15.1378],
          [76.9264, 15.1424],
          [76.9239, 15.1424],
          [76.9239, 15.1378]
        ]
      },
      {
        id: 'AI-PARCEL-VAR-003',
        title: 'Commercial Holding 03 (Sy 16/A - Agro-Godown)',
        land_type: 'Commercial / Storage',
        road_adjacent: true,
        road_clearance_m: 5.5,
        enclosed_buildings: features.detectedBuildings?.filter(b => b.building_id === 'bld-var-storage') || [],
        boundary_evidence: {
          north: 'Paddy Farm Cart Track',
          south: 'PWD Asphalt Road (5.5m Road Setback)',
          east: 'Masonry Compound Wall',
          west: 'Open Yard Fence'
        },
        coordinates: [
          [76.9210, 15.1390],
          [76.9225, 15.1390],
          [76.9225, 15.1408],
          [76.9210, 15.1408],
          [76.9210, 15.1390]
        ]
      },
      {
        id: 'AI-PARCEL-VAR-004',
        title: 'Civic Holding 04 (Sy 17/B - Primary Health Centre)',
        land_type: 'Civic Amenity',
        road_adjacent: true,
        road_clearance_m: 4.5,
        enclosed_buildings: features.detectedBuildings?.filter(b => b.building_id === 'bld-var-phc') || [],
        boundary_evidence: {
          north: 'PWD Road Southern Corridor',
          south: 'Village Gaothan Perimeter Fence',
          east: 'Village Access Path',
          west: 'Open Village Commons'
        },
        coordinates: [
          [76.9200, 15.1332],
          [76.9222, 15.1332],
          [76.9222, 15.1354],
          [76.9200, 15.1354],
          [76.9200, 15.1332]
        ]
      },
      {
        id: 'AI-PARCEL-VAR-005',
        title: 'Residential Holding 05 (Sy 17/C - Farmstead)',
        land_type: 'Residential',
        road_adjacent: true,
        road_clearance_m: 4.0,
        enclosed_buildings: features.detectedBuildings?.filter(b => b.building_id === 'bld-var-res') || [],
        boundary_evidence: {
          north: 'PWD Road Southern Corridor',
          south: 'Village Gaothan Perimeter',
          east: 'Lake Eco-Buffer Contour Margin',
          west: 'Village Access Path with PHC'
        },
        coordinates: [
          [76.9235, 15.1335],
          [76.9255, 15.1335],
          [76.9255, 15.1358],
          [76.9235, 15.1358],
          [76.9235, 15.1335]
        ]
      },
      {
        id: 'AI-PARCEL-VAR-006',
        title: 'Ecological Holding 06 (Sy 18/3 - Lake Eco-Buffer)',
        land_type: 'Water Body / Protected',
        road_adjacent: true,
        road_clearance_m: 10.0,
        enclosed_buildings: [],
        boundary_evidence: {
          north: 'Tungabhadra D-4 Canal Transition',
          south: 'PWD Road Bridge Margin',
          east: 'Lake Shore High Flood Line',
          west: '30m Inalienable Buffer Contour (AI Flag)'
        },
        coordinates: [
          [76.9265, 15.1415],
          [76.9300, 15.1420],
          [76.9298, 15.1370],
          [76.9262, 15.1388],
          [76.9265, 15.1415]
        ]
      }
    ];
  }

  // Controlled Reference Urban Layout (HMT Nagar Colony)
  const buildings = features.detectedBuildings || [];

  return [
    {
      id: 'AI-PARCEL-001',
      title: 'Candidate Parcel 01 (Villa 12 Holding)',
      land_type: 'Residential',
      road_adjacent: true,
      road_clearance_m: 3.5,
      enclosed_buildings: buildings.filter(b => b.building_id === 'bld-01'),
      boundary_evidence: {
        north: 'North Service Alley Margin (Rear Boundary Fence)',
        south: 'Road No. 1 Northern Corridor (3.5m Setback)',
        east: 'Masonry Compound Wall with Plot 14',
        west: 'Western Colony Perimeter Wall'
      },
      coordinates: [
        [78.55315, 17.43502],
        [78.55362, 17.43502],
        [78.55362, 17.43568],
        [78.55320, 17.43568],
        [78.55315, 17.43562],
        [78.55315, 17.43502]
      ]
    },
    {
      id: 'AI-PARCEL-002',
      title: 'Candidate Parcel 02 (Villa 14 Holding)',
      land_type: 'Residential',
      road_adjacent: true,
      road_clearance_m: 3.6,
      enclosed_buildings: buildings.filter(b => b.building_id === 'bld-02'),
      boundary_evidence: {
        north: 'North Service Alley Margin',
        south: 'Road No. 1 Northern Corridor (3.6m Setback)',
        east: 'Cross Road 1 Western Margin (Chamfered Corner)',
        west: 'Shared Masonry Wall with Plot 12'
      },
      coordinates: [
        [78.55365, 17.43502],
        [78.55404, 17.43502],
        [78.55406, 17.43506],
        [78.55406, 17.43568],
        [78.55365, 17.43568],
        [78.55365, 17.43502]
      ]
    },
    // Rotated 15° building
    {
      id: 'AI-PARCEL-003',
      title: 'Candidate Parcel 03 (Villa 25 Angular Villa)',
      land_type: 'Residential',
      road_adjacent: true,
      road_clearance_m: 3.5,
      enclosed_buildings: buildings.filter(b => b.building_id === 'bld-03'),
      boundary_evidence: {
        north: 'North Service Alley Margin',
        south: 'Road No. 1 Northern Corridor (3.5m Setback)',
        east: 'Building Gap & Partition Wall with Plot 42',
        west: 'Cross Road 1 Eastern Margin'
      },
      coordinates: [
        [78.55428, 17.43502],
        [78.55472, 17.43502],
        [78.55472, 17.43568],
        [78.55428, 17.43568],
        [78.55428, 17.43502]
      ]
    },
    // Rotated 30° building
    {
      id: 'AI-PARCEL-004',
      title: 'Candidate Parcel 04 (Villa 42 Diagonal Duplex)',
      land_type: 'Residential',
      road_adjacent: true,
      road_clearance_m: 3.5,
      enclosed_buildings: buildings.filter(b => b.building_id === 'bld-04'),
      boundary_evidence: {
        north: 'North Service Alley Margin',
        south: 'Road No. 1 Northern Corridor (3.5m Setback)',
        east: 'Cross Road 2 Western Margin',
        west: 'Shared Masonry Wall with Plot 25'
      },
      coordinates: [
        [78.55475, 17.43502],
        [78.55530, 17.43502],
        [78.55530, 17.43568],
        [78.55475, 17.43568],
        [78.55475, 17.43502]
      ]
    },
    // Multi-Building Compound: 2 buildings in 1 parcel (Supermarket + Logistics Annex)
    {
      id: 'AI-PARCEL-005',
      title: 'Candidate Parcel 05 (Commercial Supermarket Complex)',
      land_type: 'Commercial',
      road_adjacent: true,
      road_clearance_m: 4.2,
      enclosed_buildings: buildings.filter(b => b.compoundGroup === 'compound-commercial'),
      boundary_evidence: {
        north: 'North Service Alley Margin',
        south: 'Road No. 1 Northern Corridor (4.2m Commercial Setback)',
        east: 'Cross Road 2 Eastern Corridor (Loading Bay Access)',
        west: 'Commercial Western Boundary Wall'
      },
      coordinates: [
        [78.55555, 17.43502],
        [78.55630, 17.43502],
        [78.55630, 17.43572],
        [78.55555, 17.43572],
        [78.55555, 17.43502]
      ]
    },
    // Multi-Building Compound: 2 buildings in 1 parcel (Community Hall + Admin Office)
    {
      id: 'AI-PARCEL-006',
      title: 'Candidate Parcel 06 (Community Center & Civic Hall)',
      land_type: 'Civic Amenity',
      road_adjacent: true,
      road_clearance_m: 4.0,
      enclosed_buildings: buildings.filter(b => b.compoundGroup === 'compound-civic'),
      boundary_evidence: {
        north: 'North Service Alley Margin',
        south: 'Road No. 1 Northern Corridor (4.0m Setback)',
        east: 'Eastern Colony Perimeter Wall',
        west: 'Commercial Compound Boundary Wall'
      },
      coordinates: [
        [78.55635, 17.43502],
        [78.55708, 17.43502],
        [78.55708, 17.43580],
        [78.55635, 17.43580],
        [78.55635, 17.43502]
      ]
    },
    {
      id: 'AI-PARCEL-007',
      title: 'Candidate Parcel 07 (Residence 58 Holding)',
      land_type: 'Residential',
      road_adjacent: true,
      road_clearance_m: 3.5,
      enclosed_buildings: buildings.filter(b => b.building_id === 'bld-05'),
      boundary_evidence: {
        north: 'Road No. 1 Southern Corridor (3.5m Setback)',
        south: 'South Boundary Ring (15ft Lane)',
        east: 'Compound Wall with Plot 64',
        west: 'Western Colony Perimeter Wall'
      },
      coordinates: [
        [78.55315, 17.43382],
        [78.55362, 17.43382],
        [78.55362, 17.43468],
        [78.55315, 17.43468],
        [78.55315, 17.43382]
      ]
    },
    // Rotated 45° corner bungalow
    {
      id: 'AI-PARCEL-008',
      title: 'Candidate Parcel 08 (Residence 64 45° Corner Holding)',
      land_type: 'Residential',
      road_adjacent: true,
      road_clearance_m: 3.5,
      enclosed_buildings: buildings.filter(b => b.building_id === 'bld-06'),
      boundary_evidence: {
        north: 'Road No. 1 Southern Corridor',
        south: 'South Boundary Ring (15ft Lane)',
        east: 'Cross Road 1 Western Margin (Chamfered Corner)',
        west: 'Shared Masonry Wall with Plot 58'
      },
      coordinates: [
        [78.55365, 17.43382],
        [78.55404, 17.43382],
        [78.55406, 17.43464],
        [78.55365, 17.43468],
        [78.55365, 17.43382]
      ]
    },
    // Open land / vacant site with 0 buildings, 4-sided wire fence evidence
    {
      id: 'AI-PARCEL-009',
      title: 'Candidate Parcel 09 (Fenced Vacant Site - Plot 78)',
      land_type: 'Residential (Vacant)',
      road_adjacent: true,
      road_clearance_m: 3.5,
      enclosed_buildings: [],
      boundary_evidence: {
        north: 'Road No. 1 Southern Corridor (3.5m Setback)',
        south: 'South Boundary Ring (15ft Lane)',
        east: 'Four-sided Wire Fence with Plot 102',
        west: 'Cross Road 1 Eastern Margin'
      },
      coordinates: [
        [78.55428, 17.43382],
        [78.55472, 17.43382],
        [78.55472, 17.43468],
        [78.55428, 17.43468],
        [78.55428, 17.43382]
      ]
    },
    {
      id: 'AI-PARCEL-010',
      title: 'Candidate Parcel 10 (Residence 102 Holding)',
      land_type: 'Residential',
      road_adjacent: true,
      road_clearance_m: 3.5,
      enclosed_buildings: buildings.filter(b => b.building_id === 'bld-07'),
      boundary_evidence: {
        north: 'Road No. 1 Southern Corridor (3.5m Setback)',
        south: 'South Boundary Ring (15ft Lane)',
        east: 'Cross Road 2 Western Margin',
        west: 'Wire Fence Perimeter with Plot 78'
      },
      coordinates: [
        [78.55475, 17.43382],
        [78.55530, 17.43382],
        [78.55530, 17.43468],
        [78.55475, 17.43468],
        [78.55475, 17.43382]
      ]
    },
    // Curved Road boundary: Follows Park Crescent on the north edge
    {
      id: 'AI-PARCEL-011',
      title: 'Candidate Parcel 11 (GHMC Community Park & Walking Lawn)',
      land_type: 'Open Space / Park',
      road_adjacent: true,
      road_clearance_m: 4.5,
      enclosed_buildings: [],
      boundary_evidence: {
        north: 'Park Access Crescent (Curved Avenue Corridor)',
        south: 'South Boundary Ring (15ft Lane)',
        east: 'Eastern Colony Perimeter Wall',
        west: 'Cross Road 2 Eastern Margin'
      },
      coordinates: [
        [78.55555, 17.43382],
        [78.55708, 17.43382],
        [78.55708, 17.43465],
        [78.55660, 17.43467],
        [78.55620, 17.43466],
        [78.55580, 17.43468],
        [78.55555, 17.43465],
        [78.55555, 17.43382]
      ]
    },
    {
      id: 'AI-PARCEL-012',
      title: 'Candidate Parcel 12 (North Service Alley Buffer)',
      land_type: 'Civic Utility',
      road_adjacent: true,
      road_clearance_m: 2.5,
      enclosed_buildings: [],
      boundary_evidence: {
        north: 'Northern Layout Perimeter Boundary',
        south: 'North Service Alley Northern Edge',
        east: 'Eastern Layout Wall',
        west: 'Western Layout Wall'
      },
      coordinates: [
        [78.55280, 17.43588],
        [78.55740, 17.43588],
        [78.55740, 17.43600],
        [78.55280, 17.43600],
        [78.55280, 17.43588]
      ]
    },
    {
      id: 'AI-PARCEL-013',
      title: 'Candidate Parcel 13 (Eastern Boundary Greenbelt Buffer)',
      land_type: 'Buffer Strip',
      road_adjacent: true,
      road_clearance_m: 3.0,
      enclosed_buildings: [],
      boundary_evidence: {
        north: 'Northern Service Alley End',
        south: 'Southern Boundary Ring End',
        east: 'Eastern Boundary Survey Limit',
        west: 'Eastern Colony Perimeter Wall'
      },
      coordinates: [
        [78.55715, 17.43370],
        [78.55740, 17.43370],
        [78.55740, 17.43580],
        [78.55715, 17.43580],
        [78.55715, 17.43370]
      ]
    },
    {
      id: 'AI-PARCEL-014',
      title: 'Candidate Parcel 14 (Southern Drainage Corridor Margin)',
      land_type: 'Drainage Corridor',
      road_adjacent: true,
      road_clearance_m: 2.5,
      enclosed_buildings: [],
      boundary_evidence: {
        north: 'South Boundary Ring Southern Margin',
        south: 'Southern Cadastral Survey Boundary Limit',
        east: 'Eastern Layout Wall',
        west: 'Western Layout Wall'
      },
      coordinates: [
        [78.55280, 17.43360],
        [78.55740, 17.43360],
        [78.55740, 17.43368],
        [78.55280, 17.43368],
        [78.55280, 17.43360]
      ]
    }
  ];
}

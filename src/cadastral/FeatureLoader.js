/**
 * Module 3: FeatureLoader
 * 
 * Loads physical geospatial features (Roads, Buildings, Walls, Open Land)
 * for the Controlled Test Area and Real Cadastral Regions.
 * 
 * All coordinates are in WGS84 (EPSG:4326) [longitude, latitude].
 */

// Controlled Test Area (Realistic Irregular Urban Layout with Curved Roads & Rotated Buildings)
export const CONTROLLED_TEST_AREA = {
  id: 'controlled_test_area',
  name: 'Controlled Test Area (Reference Urban Layout)',
  center: [17.4350, 78.5545],
  zoom: 17,
  bounds: {
    west: 78.55280,
    south: 17.43360,
    east: 78.55740,
    north: 17.43600
  },
  roads: [
    {
      id: 'road-spine',
      name: 'Main Central Avenue (40ft / 12m Spine)',
      type: 'Primary Avenue',
      width_m: 12.0,
      centerline: [
        [78.55280, 17.43485],
        [78.55740, 17.43485]
      ]
    },
    {
      id: 'road-cross-1',
      name: 'Cross Street 1 (30ft / 9m Corridor)',
      type: 'Secondary Street',
      width_m: 9.0,
      centerline: [
        [78.55415, 17.43360],
        [78.55415, 17.43600]
      ]
    },
    {
      id: 'road-cross-2',
      name: 'Cross Street 2 (30ft / 9m Corridor)',
      type: 'Secondary Street',
      width_m: 9.0,
      centerline: [
        [78.55540, 17.43360],
        [78.55540, 17.43600]
      ]
    },
    {
      id: 'road-north-alley',
      name: 'North Service Alley (15ft / 4.5m Lane)',
      type: 'Service Alley',
      width_m: 4.5,
      centerline: [
        [78.55280, 17.43580],
        [78.55740, 17.43580]
      ]
    },
    {
      id: 'road-south-lane',
      name: 'South Perimeter Lane (15ft / 4.5m Lane)',
      type: 'Perimeter Lane',
      width_m: 4.5,
      centerline: [
        [78.55280, 17.43370],
        [78.55740, 17.43370]
      ]
    },
    // Curved Road: Park Crescent curving smoothly along 5 points
    {
      id: 'road-park-crescent',
      name: 'Park Access Crescent (Curved Thoroughfare)',
      type: 'Curved Residential Crescent',
      width_m: 8.0,
      isCurved: true,
      centerline: [
        [78.55545, 17.43475],
        [78.55580, 17.43472],
        [78.55620, 17.43470],
        [78.55660, 17.43471],
        [78.55700, 17.43475]
      ]
    }
  ],
  buildings: [
    // Standard horizontal (0°)
    {
      id: 'bld-01',
      name: 'Villa 12 Footprint',
      type: 'Residential Villa',
      storeys: 'G+2',
      coords: [
        [78.55328, 17.43516],
        [78.55352, 17.43516],
        [78.55352, 17.43549],
        [78.55328, 17.43549],
        [78.55328, 17.43516]
      ]
    },
    {
      id: 'bld-02',
      name: 'Villa 14 Footprint',
      type: 'Residential Villa',
      storeys: 'G+1',
      coords: [
        [78.55372, 17.43516],
        [78.55398, 17.43516],
        [78.55398, 17.43549],
        [78.55372, 17.43549],
        [78.55372, 17.43516]
      ]
    },
    // Rotated 15° clockwise
    {
      id: 'bld-03',
      name: 'Villa 25 Modern Angular Footprint (Rotated 15°)',
      type: 'Residential Villa',
      storeys: 'G+2',
      coords: [
        [78.55435, 17.43518],
        [78.55465, 17.43512],
        [78.55470, 17.43545],
        [78.55440, 17.43551],
        [78.55435, 17.43518]
      ]
    },
    // Rotated 30° clockwise
    {
      id: 'bld-04',
      name: 'Villa 42 Diagonal Duplex Footprint (Rotated 30°)',
      type: 'Residential Villa',
      storeys: 'G+1',
      coords: [
        [78.55480, 17.43520],
        [78.55506, 17.43508],
        [78.55518, 17.43542],
        [78.55492, 17.43554],
        [78.55480, 17.43520]
      ]
    },
    {
      id: 'bld-05',
      name: 'Residence 58 Footprint',
      type: 'Residential Residence',
      storeys: 'G+2',
      coords: [
        [78.55328, 17.43398],
        [78.55352, 17.43398],
        [78.55352, 17.43447],
        [78.55328, 17.43447],
        [78.55328, 17.43398]
      ]
    },
    // Rotated 45° diagonal corner bungalow
    {
      id: 'bld-06',
      name: 'Residence 64 45° Corner Bungalow Footprint',
      type: 'Corner Bungalow',
      storeys: 'G+1',
      coords: [
        [78.55375, 17.43402],
        [78.55395, 17.43422],
        [78.55380, 17.43437],
        [78.55360, 17.43417],
        [78.55375, 17.43402]
      ]
    },
    {
      id: 'bld-07',
      name: 'Residence 102 Footprint',
      type: 'Residential Villa',
      storeys: 'G+2',
      coords: [
        [78.55482, 17.43398],
        [78.55508, 17.43398],
        [78.55508, 17.43447],
        [78.55482, 17.43447],
        [78.55482, 17.43398]
      ]
    },
    // Multi-Building Compound 1: Commercial Supermarket + Warehouse Annex
    {
      id: 'bld-08-main',
      name: 'HMT Supermarket Main Complex (L-Shaped)',
      type: 'Commercial Retail',
      storeys: 'G+2',
      compoundGroup: 'compound-commercial',
      coords: [
        [78.55568, 17.43516],
        [78.55615, 17.43516],
        [78.55615, 17.43538],
        [78.55595, 17.43538],
        [78.55595, 17.43552],
        [78.55568, 17.43552],
        [78.55568, 17.43516]
      ]
    },
    {
      id: 'bld-08-annex',
      name: 'Supermarket Rear Logistics Annex',
      type: 'Commercial Annex',
      storeys: 'Ground',
      compoundGroup: 'compound-commercial',
      coords: [
        [78.55602, 17.43542],
        [78.55624, 17.43542],
        [78.55624, 17.43566],
        [78.55602, 17.43566],
        [78.55602, 17.43542]
      ]
    },
    // Multi-Building Compound 2: Community Auditorium + Administrative Wing
    {
      id: 'bld-09-hall',
      name: 'Community Center Main Auditorium',
      type: 'Civic Auditorium',
      storeys: 'G+1',
      compoundGroup: 'compound-civic',
      coords: [
        [78.55642, 17.43518],
        [78.55692, 17.43518],
        [78.55692, 17.43560],
        [78.55642, 17.43560],
        [78.55642, 17.43518]
      ]
    },
    {
      id: 'bld-09-admin',
      name: 'RWA Senior Citizen Administrative Office',
      type: 'Civic Office',
      storeys: 'Ground',
      compoundGroup: 'compound-civic',
      coords: [
        [78.55642, 17.43564],
        [78.55675, 17.43564],
        [78.55675, 17.43576],
        [78.55642, 17.43576],
        [78.55642, 17.43564]
      ]
    }
  ],
  walls: [
    { id: 'wall-01', name: 'Western Colony Boundary Wall', coords: [[78.55315, 17.43380], [78.55315, 17.43575]] },
    { id: 'wall-02', name: 'Masonry Compound Wall (Plot 12 / Plot 14)', coords: [[78.55363, 17.43502], [78.55363, 17.43568]] },
    { id: 'wall-03', name: 'Partition Wall (Plot 25 / Plot 42)', coords: [[78.55473, 17.43502], [78.55473, 17.43568]] },
    { id: 'wall-04', name: 'Commercial Western Boundary Wall', coords: [[78.55555, 17.43502], [78.55555, 17.43575]] },
    { id: 'wall-05', name: 'Eastern Colony Perimeter Wall', coords: [[78.55710, 17.43380], [78.55710, 17.43585]] },
    { id: 'wall-06', name: 'Compound Wall (Plot 58 / Plot 64)', coords: [[78.55363, 17.43382], [78.55363, 17.43468]] },
    { id: 'fence-07', name: 'Four-Sided Wire Fence (Plot 78 Vacant Site)', coords: [[78.55428, 17.43382], [78.55472, 17.43382], [78.55472, 17.43468], [78.55428, 17.43468], [78.55428, 17.43382]] },
    { id: 'wall-08', name: 'Residence 102 Compound Wall', coords: [[78.55530, 17.43382], [78.55530, 17.43468]] },
    { id: 'wall-09', name: 'GHMC Community Park Masonry Wall', coords: [[78.55555, 17.43382], [78.55705, 17.43382], [78.55705, 17.43468], [78.55555, 17.43468], [78.55555, 17.43382]] }
  ],
  openSpaces: [
    {
      id: 'open-park',
      name: 'GHMC Community Park & Walking Lawn',
      type: 'Dedicated Public Park',
      coords: [
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
      id: 'open-vacant-78',
      name: 'Fenced Open Ground (Plot 78 Vacant Holding)',
      type: 'Vacant Plotted Site',
      coords: [
        [78.55430, 17.43390],
        [78.55470, 17.43390],
        [78.55470, 17.43455],
        [78.55430, 17.43455],
        [78.55430, 17.43390]
      ]
    }
  ]
};

// Rural Agricultural Reference Layout: Varaha Nagar Village
export const VARAHA_NAGAR_AREA = {
  id: 'varaha_nagar',
  name: 'Varaha Nagar Revenue Village (Agricultural Layout)',
  center: [15.1375, 76.9245],
  zoom: 16,
  bounds: {
    west: 76.9190,
    south: 15.1320,
    east: 76.9310,
    north: 15.1440
  },
  roads: [
    {
      id: 'road-var-main',
      name: 'Rampur-Varaha PWD Asphalt Road',
      type: 'Rural Arterial Road (Curved)',
      width_m: 10.0,
      centerline: [
        [76.9190, 15.1368],
        [76.9220, 15.1370],
        [76.9250, 15.1372],
        [76.9280, 15.1373],
        [76.9310, 15.1375]
      ]
    },
    {
      id: 'canal-var-distributary',
      name: 'Tungabhadra D-4 Irrigation Canal',
      type: 'Irrigation Negative Corridor',
      width_m: 6.0,
      centerline: [
        [76.9200, 15.1424],
        [76.9240, 15.1426],
        [76.9280, 15.1428],
        [76.9305, 15.1430]
      ]
    }
  ],
  buildings: [
    {
      id: 'bld-var-storage',
      name: 'Agro-Commodity Storage Godown',
      type: 'Agricultural Warehouse',
      storeys: 'Ground',
      coords: [[76.9212, 15.1395], [76.9220, 15.1395], [76.9220, 15.1402], [76.9212, 15.1402], [76.9212, 15.1395]]
    },
    {
      id: 'bld-var-phc',
      name: 'Primary Health Centre Building',
      type: 'Rural Civic Healthcare',
      storeys: 'G+1',
      coords: [[76.9205, 15.1338], [76.9215, 15.1338], [76.9215, 15.1348], [76.9205, 15.1348], [76.9205, 15.1338]]
    },
    {
      id: 'bld-var-res',
      name: 'Farmer Farmstead Residence',
      type: 'Rural Residence',
      storeys: 'G+2',
      coords: [[76.9240, 15.1342], [76.9250, 15.1342], [76.9250, 15.1352], [76.9240, 15.1352], [76.9240, 15.1342]]
    }
  ],
  walls: [
    { id: 'bund-01', name: 'Paddy Field Bund (Sy 14/1A)', coords: [[76.9205, 15.1410], [76.9235, 15.1412]] },
    { id: 'bund-02', name: 'Dry Cotton Field Ridge (Sy 14/1B)', coords: [[76.9235, 15.1412], [76.9265, 15.1415]] },
    { id: 'lake-boundary', name: 'Varaha Lake 30m Buffer Contour', coords: [[76.9265, 15.1415], [76.9300, 15.1420], [76.9298, 15.1370], [76.9262, 15.1388]] }
  ],
  openSpaces: [
    {
      id: 'open-var-lake-buffer',
      name: 'Varaha Lake Inalienable Eco-Buffer (30m Protection)',
      type: 'Protected Water Body Buffer',
      coords: [[76.9265, 15.1415], [76.9300, 15.1420], [76.9298, 15.1370], [76.9262, 15.1388], [76.9265, 15.1415]]
    }
  ]
};

/**
 * FeatureLoader helper to retrieve features for a selected area.
 */
export function loadPhysicalFeatures(areaId = 'controlled_test_area') {
  if (areaId === 'varaha_nagar') {
    return VARAHA_NAGAR_AREA;
  }
  // Default to the controlled test area / HMT Nagar
  return CONTROLLED_TEST_AREA;
}

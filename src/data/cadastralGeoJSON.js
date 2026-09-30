// Cadastral GeoJSON layers for BHOOVARAHAM GIS Platform
// Calibrated to WGS84 coordinates (EPSG:4326)
// Covers:
// 1. HMT Nagar Colony, Nacharam, Uppal Mandal, Medchal-Malkajgiri District, Hyderabad, Telangana (17.4350° N, 78.5545° E)
// 2. Varaha Nagar Revenue Village, Rampur Taluk, Ballari District, Karnataka (15.1375° N, 76.9245° E)

export const LOCATIONS = {
  HMT_NAGAR: {
    id: 'hmt_nagar',
    name: 'HMT Nagar Colony, Nacharam',
    subtext: 'Hyderabad, Medchal-Malkajgiri Dist, Telangana',
    city: 'Hyderabad',
    mandal: 'Uppal',
    district: 'Medchal-Malkajgiri',
    state: 'Telangana',
    center: [17.4350, 78.5545],
    zoom: 17,
    isCaseStudy: true,
    caseBadge: 'NON-ENCROACHED CASE STUDY',
    caseTitle: 'Non-Encroached Residential Colony Case: HMT Nagar Colony, Nacharam',
    surveyPrefix: 'Sy Nos. 70, 71, 72, 73, 74'
  },
  VARAHA_NAGAR: {
    id: 'varaha_nagar',
    name: 'Varaha Nagar Village',
    subtext: 'Rampur Taluk, Ballari District, Karnataka',
    city: 'Ballari',
    mandal: 'Rampur',
    district: 'Ballari',
    state: 'Karnataka',
    center: [15.1375, 76.9245],
    zoom: 16,
    isCaseStudy: false,
    caseBadge: 'AI SATELLITE DEMO',
    caseTitle: 'Water Body & Agricultural Buffer Monitoring (AI Alert)',
    surveyPrefix: 'Sy Nos. 14 to 21'
  }
};

export const MAP_CENTER = LOCATIONS.HMT_NAGAR.center;
export const MAP_DEFAULT_ZOOM = LOCATIONS.HMT_NAGAR.zoom;

// Master Cadastral Feature Collection (Parcels, Road Corridors, Parks, Civic Amenities)
export const cadastralGeoJSON = {
  "type": "FeatureCollection",
  "name": "Bhoovaraham_Cadastral_Layer",
  "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
  "features": [
    // ==========================================
    // HMT NAGAR COLONY, NACHARAM, HYDERABAD (TELANGANA)
    // Non-Encroached Plotted Residential Colony
    // Coordinates: ~17.4350 N, 78.5545 E
    // ==========================================
    {
      "type": "Feature",
      "properties": {
        "ulpin": "IN36-5840-0072-0012",
        "survey_no": "72/12",
        "plot_no": "Plot 12",
        "layout_name": "HMT Nagar Colony",
        "colony_road": "Road No. 2 (North Avenue)",
        "land_use": "Residential",
        "category": "Approved Plotted Layout (Independent Villa)",
        "owner_name": "K. Venkata Ramana Rao & K. Anuradha",
        "area_acres": 0.062,
        "area_sq_yds": 300,
        "building_storeys": "G+2",
        "building_height_m": 9.8,
        "has_ai_alert": false,
        "encumbrance_status": "Clean (No Mortgage)",
        "encroachment_status": "NON-ENCROACHED",
        "region": "hmt_nagar"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [78.55320, 17.43510],
          [78.55360, 17.43510],
          [78.55360, 17.43555],
          [78.55320, 17.43555],
          [78.55320, 17.43510]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "ulpin": "IN36-5840-0072-0014",
        "survey_no": "72/14",
        "plot_no": "Plot 14",
        "layout_name": "HMT Nagar Colony",
        "colony_road": "Road No. 2 (North Avenue)",
        "land_use": "Residential",
        "category": "Approved Plotted Layout (Duplex Villa)",
        "owner_name": "Dr. P. Ramesh Babu",
        "area_acres": 0.055,
        "area_sq_yds": 267,
        "building_storeys": "G+1",
        "building_height_m": 6.5,
        "has_ai_alert": false,
        "encumbrance_status": "Clean (No Mortgage)",
        "encroachment_status": "NON-ENCROACHED",
        "region": "hmt_nagar"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [78.55365, 17.43510],
          [78.55405, 17.43510],
          [78.55405, 17.43555],
          [78.55365, 17.43555],
          [78.55365, 17.43510]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "ulpin": "IN36-5840-0072-0025",
        "survey_no": "72/25",
        "plot_no": "Plot 25",
        "layout_name": "HMT Nagar Colony",
        "colony_road": "Road No. 1 (Main Colony Spine)",
        "land_use": "Residential",
        "category": "Approved Plotted Layout (Modern G+2 Villa)",
        "owner_name": "Smt. S. Lakshmi & S. Muralidhar",
        "area_acres": 0.072,
        "area_sq_yds": 350,
        "building_storeys": "G+2",
        "building_height_m": 9.8,
        "has_ai_alert": false,
        "encumbrance_status": "Clean (No Mortgage)",
        "encroachment_status": "NON-ENCROACHED",
        "region": "hmt_nagar"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [78.55430, 17.43510],
          [78.55470, 17.43510],
          [78.55470, 17.43555],
          [78.55430, 17.43555],
          [78.55430, 17.43510]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "ulpin": "IN36-5840-0072-0042",
        "survey_no": "72/42",
        "plot_no": "Plot 42",
        "layout_name": "HMT Nagar Colony",
        "colony_road": "Road No. 1 (Main Colony Spine)",
        "land_use": "Residential",
        "category": "Approved Plotted Layout (G+1 Villa)",
        "owner_name": "Capt. V. Sudhakar Reddy (Retd.)",
        "area_acres": 0.049,
        "area_sq_yds": 240,
        "building_storeys": "G+1",
        "building_height_m": 6.5,
        "has_ai_alert": false,
        "encumbrance_status": "Clean (No Mortgage)",
        "encroachment_status": "NON-ENCROACHED",
        "region": "hmt_nagar"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [78.55475, 17.43510],
          [78.55515, 17.43510],
          [78.55515, 17.43555],
          [78.55475, 17.43555],
          [78.55475, 17.43510]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "ulpin": "IN36-5840-0072-0058",
        "survey_no": "72/58",
        "plot_no": "Plot 58",
        "layout_name": "HMT Nagar Colony",
        "colony_road": "Road No. 3 (South Ring Road)",
        "land_use": "Residential",
        "category": "Approved Plotted Layout (G+2 Residence)",
        "owner_name": "T. Satyanarayana & Sons",
        "area_acres": 0.082,
        "area_sq_yds": 400,
        "building_storeys": "G+2",
        "building_height_m": 9.8,
        "has_ai_alert": false,
        "encumbrance_status": "SBI Housing Loan (Standard Charge)",
        "encroachment_status": "NON-ENCROACHED",
        "region": "hmt_nagar"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [78.55320, 17.43390],
          [78.55360, 17.43390],
          [78.55360, 17.43455],
          [78.55320, 17.43455],
          [78.55320, 17.43390]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "ulpin": "IN36-5840-0072-0064",
        "survey_no": "72/64",
        "plot_no": "Plot 64",
        "layout_name": "HMT Nagar Colony",
        "colony_road": "Road No. 3 (South Ring Road)",
        "land_use": "Residential",
        "category": "Approved Plotted Layout (G+1 Residence)",
        "owner_name": "G. Krishna Murthy",
        "area_acres": 0.051,
        "area_sq_yds": 250,
        "building_storeys": "G+1",
        "building_height_m": 6.5,
        "has_ai_alert": false,
        "encumbrance_status": "Clean (No Mortgage)",
        "encroachment_status": "NON-ENCROACHED",
        "region": "hmt_nagar"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [78.55365, 17.43390],
          [78.55405, 17.43390],
          [78.55405, 17.43455],
          [78.55365, 17.43455],
          [78.55365, 17.43390]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "ulpin": "IN36-5840-0072-0078",
        "survey_no": "72/78",
        "plot_no": "Plot 78",
        "layout_name": "HMT Nagar Colony",
        "colony_road": "Road No. 1 (Main Colony Spine)",
        "land_use": "Residential",
        "category": "Vacant Plotted Site (Geo-Fenced & Clear)",
        "owner_name": "M. V. Subba Rao",
        "area_acres": 0.062,
        "area_sq_yds": 300,
        "building_storeys": "Vacant (G+0)",
        "building_height_m": 0,
        "has_ai_alert": false,
        "encumbrance_status": "Clean (No Mortgage)",
        "encroachment_status": "NON-ENCROACHED",
        "region": "hmt_nagar"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [78.55430, 17.43390],
          [78.55470, 17.43390],
          [78.55470, 17.43455],
          [78.55430, 17.43455],
          [78.55430, 17.43390]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "ulpin": "IN36-5840-0073-0102",
        "survey_no": "73/102",
        "plot_no": "Plot 102",
        "layout_name": "HMT Nagar Colony",
        "colony_road": "Road No. 1 (Main Colony Spine)",
        "land_use": "Residential",
        "category": "Approved Plotted Layout (G+2 Residence)",
        "owner_name": "Smt. B. Nirmala Kumari",
        "area_acres": 0.066,
        "area_sq_yds": 320,
        "building_storeys": "G+2",
        "building_height_m": 9.8,
        "has_ai_alert": false,
        "encumbrance_status": "Clean (No Mortgage)",
        "encroachment_status": "NON-ENCROACHED",
        "region": "hmt_nagar"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [78.55475, 17.43390],
          [78.55515, 17.43390],
          [78.55515, 17.43455],
          [78.55475, 17.43455],
          [78.55475, 17.43390]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "ulpin": "IN36-5840-0071-0115",
        "survey_no": "71/115",
        "plot_no": "Plot 115",
        "layout_name": "HMT Nagar Colony",
        "colony_road": "2nd Cross Corner Avenue",
        "land_use": "Commercial",
        "category": "Mixed-Use (Supermarket & Residence G+2)",
        "owner_name": "HMT Nagar Cooperative Stores & N. Rajeshwar",
        "area_acres": 0.093,
        "area_sq_yds": 450,
        "building_storeys": "G+2",
        "building_height_m": 10.5,
        "has_ai_alert": false,
        "encumbrance_status": "Clean (No Mortgage)",
        "encroachment_status": "NON-ENCROACHED",
        "region": "hmt_nagar"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [78.55560, 17.43510],
          [78.55620, 17.43510],
          [78.55620, 17.43555],
          [78.55560, 17.43555],
          [78.55560, 17.43510]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "ulpin": "IN36-5840-0070-0001",
        "survey_no": "70/Park",
        "plot_no": "Colony Park",
        "layout_name": "HMT Nagar Colony",
        "colony_road": "Central Green Corridor",
        "land_use": "Government / Public",
        "category": "Public Park & Walking Track (GHMC Dedicated)",
        "owner_name": "GHMC Urban Biodiversity Wing (Govt of Telangana)",
        "area_acres": 0.75,
        "area_sq_yds": 3630,
        "building_storeys": "Open Green Belt",
        "building_height_m": 0,
        "has_ai_alert": false,
        "encumbrance_status": "Public Dedicated Park (Inalienable)",
        "encroachment_status": "NON-ENCROACHED",
        "region": "hmt_nagar"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [78.55560, 17.43390],
          [78.55690, 17.43390],
          [78.55690, 17.43465],
          [78.55560, 17.43465],
          [78.55560, 17.43390]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "ulpin": "IN36-5840-0074-0002",
        "survey_no": "74/CH",
        "plot_no": "Community Hall",
        "layout_name": "HMT Nagar Colony",
        "colony_road": "Road No. 2 (North East)",
        "land_use": "Government / Public",
        "category": "Civic Amenity / RWA Community Center",
        "owner_name": "HMT Nagar Residents Welfare Association (Regd. 412/1988)",
        "area_acres": 0.35,
        "area_sq_yds": 1694,
        "building_storeys": "G+1",
        "building_height_m": 7.5,
        "has_ai_alert": false,
        "encumbrance_status": "Civic Amenity Site (Not for Sale)",
        "encroachment_status": "NON-ENCROACHED",
        "region": "hmt_nagar"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [78.55630, 17.43510],
          [78.55700, 17.43510],
          [78.55700, 17.43580],
          [78.55630, 17.43580],
          [78.55630, 17.43510]
        ]]
      }
    },
    // Colony Road Corridors for HMT Nagar Layout
    {
      "type": "Feature",
      "properties": {
        "ulpin": "ROAD-HMT-001",
        "survey_no": "Road 1",
        "plot_no": "Central Spine",
        "layout_name": "HMT Nagar Colony",
        "land_use": "Colony Road",
        "category": "40ft Colony Central Spine Avenue",
        "owner_name": "GHMC Engineering Wing",
        "area_acres": 0.50,
        "has_ai_alert": false,
        "encumbrance_status": "Public Thoroughfare",
        "encroachment_status": "NON-ENCROACHED",
        "region": "hmt_nagar"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [78.55300, 17.43475],
          [78.55720, 17.43475],
          [78.55720, 17.43495],
          [78.55300, 17.43495],
          [78.55300, 17.43475]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "ulpin": "ROAD-HMT-CR1",
        "survey_no": "Cross Road 1",
        "plot_no": "1st Cross",
        "layout_name": "HMT Nagar Colony",
        "land_use": "Colony Road",
        "category": "30ft Cross Avenue 1",
        "owner_name": "GHMC Engineering Wing",
        "area_acres": 0.25,
        "has_ai_alert": false,
        "encumbrance_status": "Public Thoroughfare",
        "encroachment_status": "NON-ENCROACHED",
        "region": "hmt_nagar"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [78.55410, 17.43380],
          [78.55425, 17.43380],
          [78.55425, 17.43590],
          [78.55410, 17.43590],
          [78.55410, 17.43380]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "ulpin": "ROAD-HMT-CR2",
        "survey_no": "Cross Road 2",
        "plot_no": "2nd Cross",
        "layout_name": "HMT Nagar Colony",
        "land_use": "Colony Road",
        "category": "30ft Cross Avenue 2",
        "owner_name": "GHMC Engineering Wing",
        "area_acres": 0.25,
        "has_ai_alert": false,
        "encumbrance_status": "Public Thoroughfare",
        "encroachment_status": "NON-ENCROACHED",
        "region": "hmt_nagar"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [78.55535, 17.43380],
          [78.55550, 17.43380],
          [78.55550, 17.43590],
          [78.55535, 17.43590],
          [78.55535, 17.43380]
        ]]
      }
    },

    // ==========================================
    // VARAHA NAGAR REVENUE VILLAGE (BALLARI, KARNATAKA)
    // Agricultural & Water Body Anomaly Demo
    // Coordinates: ~15.1375 N, 76.9245 E
    // ==========================================
    {
      "type": "Feature",
      "properties": {
        "ulpin": "IN29-0412-0014-9201",
        "survey_no": "14/1A",
        "land_use": "Agricultural",
        "category": "Paddy / Wet Land",
        "owner_name": "Rameshappa Gowda",
        "area_acres": 2.45,
        "has_ai_alert": false,
        "encumbrance_status": "Clean (No Mortgage)",
        "region": "varaha_nagar"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [76.9205, 15.1410],
          [76.9235, 15.1412],
          [76.9233, 15.1385],
          [76.9202, 15.1383],
          [76.9205, 15.1410]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "ulpin": "IN29-0412-0014-9202",
        "survey_no": "14/1B",
        "land_use": "Agricultural",
        "category": "Dry Land / Cotton",
        "owner_name": "Basavaraj Patil",
        "area_acres": 1.80,
        "has_ai_alert": false,
        "encumbrance_status": "Bank Lien (Canara Bank)",
        "region": "varaha_nagar"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [76.9235, 15.1412],
          [76.9265, 15.1415],
          [76.9262, 15.1388],
          [76.9233, 15.1385],
          [76.9235, 15.1412]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "ulpin": "IN29-0412-0015-1033",
        "survey_no": "15/2",
        "land_use": "Residential",
        "category": "Plotted Layout",
        "owner_name": "Sunitha Devi & M. K. Rao",
        "area_acres": 0.65,
        "has_ai_alert": false,
        "encumbrance_status": "Clean (No Mortgage)",
        "region": "varaha_nagar"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [76.9202, 15.1383],
          [76.9233, 15.1385],
          [76.9230, 15.1358],
          [76.9198, 15.1355],
          [76.9202, 15.1383]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "ulpin": "IN29-0412-0016-4402",
        "survey_no": "16/A",
        "land_use": "Commercial",
        "category": "Highway Retail Corridor",
        "owner_name": "Varaha Agro Logistics LLP",
        "area_acres": 1.15,
        "has_ai_alert": false,
        "encumbrance_status": "State Bank of India Loan",
        "region": "varaha_nagar"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [76.9233, 15.1385],
          [76.9262, 15.1388],
          [76.9260, 15.1360],
          [76.9230, 15.1358],
          [76.9233, 15.1385]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "ulpin": "IN29-0412-0018-7711",
        "survey_no": "18/3",
        "land_use": "Water Body Buffer",
        "category": "Kere (Lake) Eco-Protection Buffer",
        "owner_name": "Revenue Department (Govt of Karnataka)",
        "area_acres": 3.40,
        "has_ai_alert": true,
        "ai_alert_type": "Possible change detected: Unauthorized structural footprint within 30m buffer",
        "encumbrance_status": "Government Inalienable Land",
        "region": "varaha_nagar"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [76.9265, 15.1415],
          [76.9300, 15.1420],
          [76.9298, 15.1370],
          [76.9262, 15.1388],
          [76.9265, 15.1415]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "ulpin": "IN29-0412-0019-2045",
        "survey_no": "19/1",
        "land_use": "Government / Public",
        "category": "Primary Health Centre & GP Office",
        "owner_name": "Gram Panchayat Varaha Nagar",
        "area_acres": 0.85,
        "has_ai_alert": false,
        "encumbrance_status": "Public Infrastructure",
        "region": "varaha_nagar"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [76.9198, 15.1355],
          [76.9230, 15.1358],
          [76.9228, 15.1330],
          [76.9195, 15.1328],
          [76.9198, 15.1355]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "ulpin": "IN29-0412-0020-5519",
        "survey_no": "20/2B",
        "land_use": "Residential",
        "category": "Approved G+2 Residential",
        "owner_name": "Farhan Ahmed & Parveen Begum",
        "area_acres": 0.42,
        "has_ai_alert": false,
        "encumbrance_status": "HDFC Home Loan",
        "region": "varaha_nagar"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [76.9230, 15.1358],
          [76.9260, 15.1360],
          [76.9257, 15.1332],
          [76.9228, 15.1330],
          [76.9230, 15.1358]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "ulpin": "IN29-0412-0021-8830",
        "survey_no": "21/4",
        "land_use": "Agro-Forestry",
        "category": "Teak & Tamarind Plantation",
        "owner_name": "Devappa Nayak",
        "area_acres": 2.10,
        "has_ai_alert": true,
        "ai_alert_type": "Possible change detected: Vegetation density variance / boundary alignment",
        "encumbrance_status": "Clean (No Mortgage)",
        "region": "varaha_nagar"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [76.9260, 15.1360],
          [76.9295, 15.1365],
          [76.9292, 15.1335],
          [76.9257, 15.1332],
          [76.9260, 15.1360]
        ]]
      }
    }
  ]
};

// Building Footprints Layer for 2.5D Isometric Elevation & Extrusion
// Extruded using documented municipal heights (G+1: 6.5m, G+2: 9.8m, G+0: vacant)
export const buildingFootprintsGeoJSON = {
  "type": "FeatureCollection",
  "name": "Bhoovaraham_Building_Footprints",
  "features": [
    // Plot 12 Building Footprint (G+2 Villa)
    {
      "type": "Feature",
      "properties": {
        "ulpin": "IN36-5840-0072-0012",
        "plot_no": "Plot 12",
        "building_name": "Villa 12 (K. Venkata Ramana Rao)",
        "storeys": "G+2",
        "height_m": 9.8,
        "roof_color": "#fed7aa",
        "wall_color": "#fb923c",
        "shadow_offset": [0.00003, 0.00003]
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [78.55328, 17.43516],
          [78.55352, 17.43516],
          [78.55352, 17.43549],
          [78.55328, 17.43549],
          [78.55328, 17.43516]
        ]]
      }
    },
    // Plot 14 Building Footprint (G+1 Duplex)
    {
      "type": "Feature",
      "properties": {
        "ulpin": "IN36-5840-0072-0014",
        "plot_no": "Plot 14",
        "building_name": "Villa 14 (Dr. P. Ramesh Babu)",
        "storeys": "G+1",
        "height_m": 6.5,
        "roof_color": "#fed7aa",
        "wall_color": "#f97316",
        "shadow_offset": [0.00002, 0.00002]
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [78.55372, 17.43516],
          [78.55398, 17.43516],
          [78.55398, 17.43549],
          [78.55372, 17.43549],
          [78.55372, 17.43516]
        ]]
      }
    },
    // Plot 25 Building Footprint (G+2 Modern Villa)
    {
      "type": "Feature",
      "properties": {
        "ulpin": "IN36-5840-0072-0025",
        "plot_no": "Plot 25",
        "building_name": "Villa 25 (Smt. S. Lakshmi)",
        "storeys": "G+2",
        "height_m": 9.8,
        "roof_color": "#fed7aa",
        "wall_color": "#ea580c",
        "shadow_offset": [0.00003, 0.00003]
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [78.55438, 17.43516],
          [78.55462, 17.43516],
          [78.55462, 17.43549],
          [78.55438, 17.43549],
          [78.55438, 17.43516]
        ]]
      }
    },
    // Plot 42 Building Footprint (G+1 Villa)
    {
      "type": "Feature",
      "properties": {
        "ulpin": "IN36-5840-0072-0042",
        "plot_no": "Plot 42",
        "building_name": "Villa 42 (Capt. V. Sudhakar Reddy)",
        "storeys": "G+1",
        "height_m": 6.5,
        "roof_color": "#fed7aa",
        "wall_color": "#c2410c",
        "shadow_offset": [0.00002, 0.00002]
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [78.55482, 17.43516],
          [78.55508, 17.43516],
          [78.55508, 17.43549],
          [78.55482, 17.43549],
          [78.55482, 17.43516]
        ]]
      }
    },
    // Plot 58 Building Footprint (G+2 Residence)
    {
      "type": "Feature",
      "properties": {
        "ulpin": "IN36-5840-0072-0058",
        "plot_no": "Plot 58",
        "building_name": "Residence 58 (T. Satyanarayana)",
        "storeys": "G+2",
        "height_m": 9.8,
        "roof_color": "#fef08a",
        "wall_color": "#ca8a04",
        "shadow_offset": [0.00003, 0.00003]
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [78.55328, 17.43398],
          [78.55352, 17.43398],
          [78.55352, 17.43447],
          [78.55328, 17.43447],
          [78.55328, 17.43398]
        ]]
      }
    },
    // Plot 64 Building Footprint (G+1 Residence)
    {
      "type": "Feature",
      "properties": {
        "ulpin": "IN36-5840-0072-0064",
        "plot_no": "Plot 64",
        "building_name": "Residence 64 (G. Krishna Murthy)",
        "storeys": "G+1",
        "height_m": 6.5,
        "roof_color": "#fef08a",
        "wall_color": "#a16207",
        "shadow_offset": [0.00002, 0.00002]
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [78.55372, 17.43398],
          [78.55398, 17.43398],
          [78.55398, 17.43447],
          [78.55372, 17.43447],
          [78.55372, 17.43398]
        ]]
      }
    },
    // Plot 102 Building Footprint (G+2 Residence)
    {
      "type": "Feature",
      "properties": {
        "ulpin": "IN36-5840-0073-0102",
        "plot_no": "Plot 102",
        "building_name": "Residence 102 (Smt. B. Nirmala Kumari)",
        "storeys": "G+2",
        "height_m": 9.8,
        "roof_color": "#fef08a",
        "wall_color": "#854d0e",
        "shadow_offset": [0.00003, 0.00003]
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [78.55482, 17.43398],
          [78.55508, 17.43398],
          [78.55508, 17.43447],
          [78.55482, 17.43447],
          [78.55482, 17.43398]
        ]]
      }
    },
    // Plot 115 Commercial/Retail Footprint (G+2 Commercial)
    {
      "type": "Feature",
      "properties": {
        "ulpin": "IN36-5840-0071-0115",
        "plot_no": "Plot 115",
        "building_name": "HMT Nagar Supermarket & Retail Complex",
        "storeys": "G+2",
        "height_m": 10.5,
        "roof_color": "#bfdbfe",
        "wall_color": "#2563eb",
        "shadow_offset": [0.00003, 0.00003]
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [78.55568, 17.43516],
          [78.55612, 17.43516],
          [78.55612, 17.43549],
          [78.55568, 17.43549],
          [78.55568, 17.43516]
        ]]
      }
    },
    // Community Hall Footprint (G+1 Public Building)
    {
      "type": "Feature",
      "properties": {
        "ulpin": "IN36-5840-0074-0002",
        "plot_no": "Community Hall",
        "building_name": "HMT Nagar Community Hall & Senior Citizen Center",
        "storeys": "G+1",
        "height_m": 7.5,
        "roof_color": "#ddd6fe",
        "wall_color": "#7c3aed",
        "shadow_offset": [0.000025, 0.000025]
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [78.55640, 17.43518],
          [78.55690, 17.43518],
          [78.55690, 17.43572],
          [78.55640, 17.43572],
          [78.55640, 17.43518]
        ]]
      }
    }
  ]
};

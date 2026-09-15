// Cadastral GeoJSON layer for Varaha Nagar Revenue Village, Rampur Taluk, Ballari District
// Calibrated to WGS84 coordinates (EPSG:4326)

export const cadastralGeoJSON = {
  "type": "FeatureCollection",
  "name": "VarahaNagar_Cadastral_Parcels",
  "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
  "features": [
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
        "encumbrance_status": "Clean (No Mortgage)"
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
        "encumbrance_status": "Bank Lien (Canara Bank)"
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
        "encumbrance_status": "Clean (No Mortgage)"
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
        "encumbrance_status": "State Bank of India Loan"
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
        "encumbrance_status": "Government Inalienable Land"
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
        "encumbrance_status": "Public Infrastructure"
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
        "encumbrance_status": "HDFC Home Loan"
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
        "encumbrance_status": "Clean (No Mortgage)"
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

// Village center for map initialization
export const MAP_CENTER = [15.1375, 76.9245];
export const MAP_DEFAULT_ZOOM = 16;

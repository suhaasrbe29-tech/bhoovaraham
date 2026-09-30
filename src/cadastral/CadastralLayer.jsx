import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

/**
 * Module 10: CadastralLayer
 * 
 * Native Leaflet GeoJSON layer that guarantees 100% reliable SVG polygon rendering.
 * Eliminates React-Leaflet key-cache bugs by directly managing L.geoJSON on the map.
 */
export default function CadastralLayer({
  data,
  selectedParcelId,
  onSelectParcel,
  visible = true
}) {
  const map = useMap();
  const layerGroupRef = useRef(null);

  // Initialize LayerGroup once
  useEffect(() => {
    if (!layerGroupRef.current) {
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      if (layerGroupRef.current) {
        layerGroupRef.current.clearLayers();
        map.removeLayer(layerGroupRef.current);
        layerGroupRef.current = null;
      }
    };
  }, [map]);

  // Update GeoJSON features whenever data, selectedParcelId, or visibility changes
  useEffect(() => {
    if (!layerGroupRef.current) return;

    layerGroupRef.current.clearLayers();

    if (!visible || !data || !data.features || data.features.length === 0) {
      return;
    }

    const geoJsonLayer = L.geoJSON(data, {
      style: (feature) => {
        const p = feature.properties;
        const isSelected = selectedParcelId && (p.parcel_id === selectedParcelId || p.id === selectedParcelId);

        return {
          fillColor: isSelected ? '#d946ef' : (p.fillColor || '#ede9fe'),
          fillOpacity: isSelected ? 0.85 : 0.45,
          color: isSelected ? '#a21caf' : (p.strokeColor || '#7c3aed'),
          weight: isSelected ? 3.5 : 2.0,
          dashArray: isSelected ? undefined : '4, 4'
        };
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties;

        layer.on({
          click: (e) => {
            L.DomEvent.stopPropagation(e);
            if (onSelectParcel) {
              onSelectParcel(p);
            }
          },
          mouseover: (e) => {
            e.target.setStyle({
              weight: 3.5,
              fillOpacity: 0.80,
              color: '#9333ea'
            });
          },
          mouseout: (e) => {
            const isSelected = selectedParcelId && (p.parcel_id === selectedParcelId || p.id === selectedParcelId);
            e.target.setStyle({
              fillColor: isSelected ? '#d946ef' : (p.fillColor || '#ede9fe'),
              fillOpacity: isSelected ? 0.85 : 0.45,
              color: isSelected ? '#a21caf' : (p.strokeColor || '#7c3aed'),
              weight: isSelected ? 3.5 : 2.0,
              dashArray: isSelected ? undefined : '4, 4'
            });
          }
        });

        // Rich tooltip
        layer.bindTooltip(
          `<div class="text-xs font-sans p-1.5 max-w-xs">
            <div class="flex items-center gap-1.5 mb-1">
              <span class="px-1.5 py-0.2 bg-violet-600 text-white rounded text-[9px] font-bold">CADASTRAL PLOT</span>
              <strong class="text-slate-900 font-bold">${p.title || p.parcel_id}</strong>
            </div>
            <div class="text-[10px] text-slate-500 font-mono">${p.parcel_id || p.id}</div>
            <div class="mt-1 flex items-center justify-between text-[11px]">
              <span>Area: <strong>${p.area_sqm} m²</strong> (${p.area_sqyds} sq.yds)</span>
              <span class="font-bold text-emerald-700 bg-emerald-50 px-1 rounded">${p.confidence}% Match</span>
            </div>
            <div class="text-[10px] text-slate-700 font-medium mt-1 truncate">
              ${p.building_count > 0 ? `${p.building_count} Enclosed Structure(s)` : 'Open Ground / Vacant Plot'}
            </div>
            <div class="text-[9px] text-violet-600 font-semibold mt-1">Click polygon to view data box</div>
          </div>`,
          { sticky: true, className: 'leaflet-custom-tooltip' }
        );
      }
    });

    layerGroupRef.current.addLayer(geoJsonLayer);
    console.log(`[BHOOVARAHAM CadastralLayer] Rendered ${data.features.length} polygons on map.`);
  }, [data, selectedParcelId, visible, onSelectParcel]);

  return null;
}

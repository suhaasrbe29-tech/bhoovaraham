import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Sparkles, Building2, Globe, Loader2, Navigation } from 'lucide-react';
import { LOCATIONS } from '../data/cadastralGeoJSON';

/**
 * Google Places & Cadastral Autocomplete Search Bar
 * 
 * Supports:
 * 1. Official Google Places AutocompleteService (when Google API key / window.google is loaded)
 * 2. Rapid type-ahead predictions for locations (e.g. "Nach", "Hyderabad", "HMT Nagar", "Uppal", "Ballari")
 * 3. Registered cadastral plots and layout entities
 * 4. Live Nominatim OSM geocoding fallback for comprehensive coverage across India
 */
export default function GooglePlacesSearch({
  onSelectLocation,
  parcelsData = [],
  activeLocation,
  placeholder = "Search places, addresses, or plots (e.g. 'Nach', 'Hyderabad', 'HMT Nagar')..."
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [googleServiceAvailable, setGoogleServiceAvailable] = useState(false);

  const autocompleteServiceRef = useRef(null);
  const placesServiceRef = useRef(null);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize Google Maps Places AutocompleteService if available on window
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      try {
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
        const dummyDiv = document.createElement('div');
        placesServiceRef.current = new window.google.maps.places.PlacesService(dummyDiv);
        setGoogleServiceAvailable(true);
      } catch (err) {
        console.warn('Google Places service initialization notice:', err);
      }
    }
  }, []);

  // Pre-indexed local cadastral and regional places database
  const catalogPlaces = [
    // High-level metropolitan and colony entities
    {
      id: 'place-hmt-nagar',
      title: 'HMT Nagar Colony, Nacharam',
      subtitle: 'Hyderabad, Medchal-Malkajgiri District, Telangana, 500076',
      type: 'colony_layout',
      badge: 'Cadastral Layout',
      coords: LOCATIONS.HMT_NAGAR.center,
      zoom: 17,
      locationId: 'hmt_nagar',
      isPreCalibrated: true
    },
    {
      id: 'place-nacharam',
      title: 'Nacharam, Secunderabad/Hyderabad',
      subtitle: 'Uppal Mandal, Medchal-Malkajgiri Dist, Telangana',
      type: 'locality',
      badge: 'Locality',
      coords: [17.4300, 78.5580],
      zoom: 15,
      locationId: 'hmt_nagar',
      isPreCalibrated: true
    },
    {
      id: 'place-nacharam-ind',
      title: 'Nacharam Industrial Area',
      subtitle: 'TSIIC Industrial Zone, Nacharam, Hyderabad, Telangana',
      type: 'industrial',
      badge: 'Industrial Estate',
      coords: [17.4260, 78.5620],
      zoom: 16,
      locationId: 'hmt_nagar',
      isPreCalibrated: true
    },
    {
      id: 'place-hyderabad',
      title: 'Hyderabad, Telangana',
      subtitle: 'Capital City of Telangana, Greater Hyderabad Municipal Corporation (GHMC)',
      type: 'city',
      badge: 'City Center',
      coords: [17.3850, 78.4867],
      zoom: 13,
      isPreCalibrated: false
    },
    {
      id: 'place-uppal',
      title: 'Uppal, Hyderabad',
      subtitle: 'Uppal Mandal, Medchal-Malkajgiri Dist, Hyderabad, Telangana',
      type: 'locality',
      badge: 'Mandal HQ',
      coords: [17.4018, 78.5602],
      zoom: 15,
      isPreCalibrated: false
    },
    {
      id: 'place-secunderabad',
      title: 'Secunderabad, Telangana',
      subtitle: 'Twin City of Hyderabad, Telangana, 500003',
      type: 'city',
      badge: 'Metropolitan Area',
      coords: [17.4399, 78.4983],
      zoom: 14,
      isPreCalibrated: false
    },
    {
      id: 'place-varaha-nagar',
      title: 'Varaha Nagar Revenue Village',
      subtitle: 'Rampur Taluk, Ballari District, Karnataka (Tungabhadra Basin)',
      type: 'revenue_village',
      badge: 'Revenue Village',
      coords: LOCATIONS.VARAHA_NAGAR.center,
      zoom: 16,
      locationId: 'varaha_nagar',
      isPreCalibrated: true
    },
    {
      id: 'place-ballari',
      title: 'Ballari, Karnataka',
      subtitle: 'Ballari District Headquarters, Karnataka, 583101',
      type: 'city',
      badge: 'District HQ',
      coords: [15.1394, 76.9214],
      zoom: 14,
      isPreCalibrated: false
    },
    // Cadastral Registered Plots in HMT Nagar
    {
      id: 'plot-hmt-12',
      title: 'Plot 12 (Sy 72/12) - K. Venkata Ramana Rao',
      subtitle: 'Road No. 2 (North Avenue), HMT Nagar Colony, Nacharam (G+2 Villa)',
      type: 'cadastral_plot',
      badge: 'Plot 12 (Non-Encroached)',
      ulpin: 'IN36-5840-0072-0012',
      coords: [17.43532, 78.55340],
      zoom: 18,
      locationId: 'hmt_nagar',
      isPreCalibrated: true
    },
    {
      id: 'plot-hmt-14',
      title: 'Plot 14 (Sy 72/14) - Dr. P. Ramesh Babu',
      subtitle: 'Road No. 2 (North Avenue), HMT Nagar Colony, Nacharam (G+1 Villa)',
      type: 'cadastral_plot',
      badge: 'Plot 14 (Non-Encroached)',
      ulpin: 'IN36-5840-0072-0014',
      coords: [17.43532, 78.55385],
      zoom: 18,
      locationId: 'hmt_nagar',
      isPreCalibrated: true
    },
    {
      id: 'plot-hmt-25',
      title: 'Plot 25 (Sy 72/25) - Smt. S. Lakshmi & S. Muralidhar',
      subtitle: 'Road No. 1 (Main Spine), HMT Nagar Colony, Nacharam (Modern G+2 Villa)',
      type: 'cadastral_plot',
      badge: 'Plot 25 (Non-Encroached)',
      ulpin: 'IN36-5840-0072-0025',
      coords: [17.43532, 78.55450],
      zoom: 18,
      locationId: 'hmt_nagar',
      isPreCalibrated: true
    },
    {
      id: 'plot-hmt-42',
      title: 'Plot 42 (Sy 72/42) - Capt. V. Sudhakar Reddy',
      subtitle: 'Road No. 1, HMT Nagar Colony, Nacharam (G+1 Duplex)',
      type: 'cadastral_plot',
      badge: 'Plot 42 (Non-Encroached)',
      ulpin: 'IN36-5840-0072-0042',
      coords: [17.43532, 78.55495],
      zoom: 18,
      locationId: 'hmt_nagar',
      isPreCalibrated: true
    },
    {
      id: 'plot-hmt-115',
      title: 'Plot 115 (Sy 71/115) - Supermarket & Retail Store',
      subtitle: '2nd Cross Corner, HMT Nagar Colony (Commercial G+2 Complex)',
      type: 'cadastral_plot',
      badge: 'Commercial Complex',
      ulpin: 'IN36-5840-0071-0115',
      coords: [17.43532, 78.55590],
      zoom: 18,
      locationId: 'hmt_nagar',
      isPreCalibrated: true
    },
    {
      id: 'plot-hmt-park',
      title: 'GHMC Community Park & Walking Lawn',
      subtitle: 'Sy 70/Park, HMT Nagar Colony, Nacharam (Public Amenity)',
      type: 'cadastral_plot',
      badge: 'GHMC Park',
      ulpin: 'IN36-5840-0070-0001',
      coords: [17.43425, 78.55625],
      zoom: 18,
      locationId: 'hmt_nagar',
      isPreCalibrated: true
    }
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search effect triggered on input change
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSuggestions([]);
      setShowDropdown(false);
      setIsLoading(false);
      return;
    }

    const lower = trimmed.toLowerCase();

    // 1. Instant Catalog Matches (Local & Cadastral)
    const localMatches = catalogPlaces.filter(p => 
      p.title.toLowerCase().includes(lower) ||
      p.subtitle.toLowerCase().includes(lower) ||
      (p.ulpin && p.ulpin.toLowerCase().includes(lower)) ||
      (p.badge && p.badge.toLowerCase().includes(lower))
    );

    setSuggestions(localMatches);
    setShowDropdown(true);

    // 2. Query Google Places Autocomplete if available
    if (autocompleteServiceRef.current && trimmed.length >= 2) {
      setIsLoading(true);
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: trimmed,
          componentRestrictions: { country: 'in' }
        },
        (predictions, status) => {
          setIsLoading(false);
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            const googleResults = predictions.slice(0, 4).map(p => ({
              id: `google-${p.place_id}`,
              placeId: p.place_id,
              title: p.structured_formatting?.main_text || p.description,
              subtitle: p.structured_formatting?.secondary_text || p.description,
              type: 'google_place',
              badge: 'Google Place',
              isGooglePlace: true,
              isPreCalibrated: false
            }));

            // Merge local cadastral results on top of Google Places
            setSuggestions(prev => {
              const ids = new Set(prev.map(item => item.title.toLowerCase()));
              const nonDups = googleResults.filter(g => !ids.has(g.title.toLowerCase()));
              return [...prev, ...nonDups];
            });
          }
        }
      );
    } 
    // 3. Fallback: Live Geocoding via OpenStreetMap Nominatim for queries with >= 3 chars
    else if (localMatches.length < 3 && trimmed.length >= 3) {
      const timer = setTimeout(() => {
        setIsLoading(true);
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmed)}&countrycodes=in&limit=4&addressdetails=1`)
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data) && data.length > 0) {
              const osmResults = data.map(item => ({
                id: `osm-${item.place_id}`,
                title: item.display_name.split(',')[0],
                subtitle: item.display_name,
                coords: [parseFloat(item.lat), parseFloat(item.lon)],
                zoom: item.type === 'city' ? 13 : 16,
                type: 'osm_place',
                badge: item.type ? item.type.toUpperCase() : 'Place',
                isPreCalibrated: false
              }));

              setSuggestions(prev => {
                const seenTitles = new Set(prev.map(p => p.title.toLowerCase()));
                const filteredOsm = osmResults.filter(o => !seenTitles.has(o.title.toLowerCase()));
                return [...prev, ...filteredOsm];
              });
            }
          })
          .catch(() => {})
          .finally(() => {
            setIsLoading(false);
          });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [query]);

  // Handle item selection from autocomplete
  const handleSelect = (item) => {
    setShowDropdown(false);
    setQuery(item.title);

    // If it's a Google Place with placeId, fetch precise geometry
    if (item.isGooglePlace && item.placeId && placesServiceRef.current) {
      setIsLoading(true);
      placesServiceRef.current.getDetails(
        { placeId: item.placeId, fields: ['geometry', 'name', 'formatted_address'] },
        (place, status) => {
          setIsLoading(false);
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            onSelectLocation({
              title: place.name || item.title,
              subtitle: place.formatted_address || item.subtitle,
              coords: [lat, lng],
              zoom: 16,
              badge: 'Google Place',
              isPreCalibrated: false
            });
          } else {
            // Fallback
            onSelectLocation(item);
          }
        }
      );
    } else {
      onSelectLocation(item);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-slate-500" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setShowDropdown(true);
          }}
          placeholder={placeholder}
          className="w-full pl-9 pr-8 py-2 bg-white/95 backdrop-blur-sm border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-sans"
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Predictive Autocomplete Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white/95 backdrop-blur-md rounded-lg border border-slate-300 shadow-xl overflow-hidden z-[500] max-h-72 overflow-y-auto font-sans divide-y divide-slate-100">
          <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Places & Cadastral Predictions</span>
            {googleServiceAvailable && (
              <span className="text-blue-600 font-semibold lowercase">google places active</span>
            )}
          </div>

          {suggestions.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              className="w-full px-3 py-2 text-left hover:bg-blue-50 transition-colors flex items-start gap-2.5 group"
            >
              <div className="mt-0.5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0">
                {item.type === 'cadastral_plot' ? (
                  <Building2 className="w-4 h-4 text-emerald-600" />
                ) : item.type === 'colony_layout' ? (
                  <Sparkles className="w-4 h-4 text-amber-500" />
                ) : item.type === 'google_place' ? (
                  <Navigation className="w-4 h-4 text-blue-500" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-slate-900 text-xs truncate group-hover:text-blue-900">
                    {item.title}
                  </span>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      item.badge.includes('Non-Encroached') || item.type === 'cadastral_plot'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : item.badge === 'Cadastral Layout'
                        ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                        : item.badge === 'Google Place'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * BHOOVARAHAM Cadastral GIS System Configuration
 * 
 * Centralized zoom thresholds and visibility rules for progressive cadastral visualization.
 */

export const CADASTRAL_CONFIG = {
  // Zoom Level < 14: Country / State / District / City overview (Parcels hidden)
  // Zoom Level >= 14: Cadastral parcel polygons become visible automatically
  CADASTRAL_MIN_ZOOM: 14,

  // Zoom Level >= 16: Detailed parcel boundary inspection and click-selection enabled
  PARCEL_INTERACTION_ZOOM: 16,

  // Zoom Level >= 17: High-resolution parcel labels, plinth footprints, and dimensional annotations
  DETAILED_LABELS_ZOOM: 17,

  // Maximum allowed parcels rendered simultaneously in one viewport for 60fps performance
  MAX_VIEWPORT_PARCELS: 150
};

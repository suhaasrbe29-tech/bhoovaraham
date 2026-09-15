/**
 * Court Case Resolution Time Estimator (Indicative Analytics)
 * 
 * Computes an indicative resolution timeline based on:
 * 1. Historical precedents of the same case type
 * 2. A bounded parcel-size adjustment factor
 * 
 * Note: This produces a 100% deterministic estimate for demonstration and planning
 * purposes and is not a formal legal prediction.
 */

export function estimateCourtResolution(caseType, parcelAreaAcres, historicalCases = []) {
  // 1. Filter historical cases matching the case type
  const matching = (historicalCases || []).filter(
    (c) => c.case_type?.toLowerCase() === (caseType || '').toLowerCase()
  );

  const dataset = matching.length > 0 ? matching : historicalCases;
  const sampleSize = matching.length;

  // Safe parcel area fallback
  const area = typeof parcelAreaAcres === 'number' && parcelAreaAcres > 0 ? parcelAreaAcres : 2.0;

  // If no dataset available at all, return safe default
  if (!dataset || dataset.length === 0) {
    return {
      estimatedMonths: 18,
      rangeMin: 14,
      rangeMax: 22,
      confidence: 'Indicative',
      sampleSize: 0,
      historicalAverage: 18.0,
      parcelSizeAcres: area,
      sizeAdjustmentPercent: 0,
      caseTypeUsed: caseType || 'General Civil Dispute',
      disclaimer: 'AI/Analytics-based indicative estimate — not a legal prediction.'
    };
  }

  // 2. Base duration from historical average
  const totalMonths = dataset.reduce((sum, c) => sum + (c.actual_duration_months || 18), 0);
  const historicalAverage = totalMonths / dataset.length;

  // 3. Bounded Parcel-Size Adjustment Factor:
  // Baseline is 2.0 acres. We apply a mild logarithmic adjustment clamped between -10% (-0.10) and +15% (+0.15).
  // Larger acreage accounts for multiple survey verifications or partition lines, but never dominates the timeline.
  let delta = 0.06 * Math.log(area / 2.0);
  delta = Math.max(-0.10, Math.min(0.15, delta));
  const sizeMultiplier = 1 + delta;
  const sizeAdjustmentPercent = Number((delta * 100).toFixed(1));

  // 4. Indicative estimate
  const estimatedMonths = Math.max(6, Math.round(historicalAverage * sizeMultiplier));

  // 5. Calculate range using sorted historical durations
  const sortedDurations = dataset.map(c => c.actual_duration_months || 18).sort((a, b) => a - b);
  const p25Index = Math.max(0, Math.floor(0.25 * (sortedDurations.length - 1)));
  const p75Index = Math.min(sortedDurations.length - 1, Math.ceil(0.75 * (sortedDurations.length - 1)));
  
  const rawMin = Math.round(sortedDurations[p25Index] * sizeMultiplier);
  const rawMax = Math.round(sortedDurations[p75Index] * sizeMultiplier);
  
  const rangeMin = Math.max(6, Math.min(rawMin, estimatedMonths - 2));
  const rangeMax = Math.max(rangeMin + 3, Math.max(rawMax, estimatedMonths + 3));

  // 6. Confidence rating based on precedent count
  let confidence = 'Indicative';
  if (sampleSize >= 15) {
    confidence = 'High';
  } else if (sampleSize >= 8) {
    confidence = 'Moderate';
  }

  return {
    estimatedMonths,
    rangeMin,
    rangeMax,
    confidence,
    sampleSize,
    historicalAverage: Number(historicalAverage.toFixed(1)),
    parcelSizeAcres: area,
    sizeAdjustmentPercent,
    caseTypeUsed: caseType,
    disclaimer: 'AI/Analytics-based indicative estimate — not a legal prediction.'
  };
}

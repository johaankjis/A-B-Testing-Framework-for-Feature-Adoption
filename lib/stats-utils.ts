/**
 * Client-side statistical utilities for A/B testing
 */

export interface ZTestResult {
  testType: string
  controlRate: number
  treatmentRate: number
  liftPercent: number
  zScore: number
  pValue: number
  isSignificant: boolean
  confidenceLevel: number
  controlCi: [number, number]
  treatmentCi: [number, number]
}

export interface PowerAnalysisResult {
  baselineRate: number
  expectedTreatmentRate: number
  mdePercent: number
  alpha: number
  power: number
  sampleSizePerVariant: number
  totalSampleSize: number
}

/**
 * Calculate z-test for two proportions (client-side approximation)
 */
export function calculateZTest(
  controlConversions: number,
  controlTotal: number,
  treatmentConversions: number,
  treatmentTotal: number,
): ZTestResult {
  const pControl = controlConversions / controlTotal
  const pTreatment = treatmentConversions / treatmentTotal

  const pPooled = (controlConversions + treatmentConversions) / (controlTotal + treatmentTotal)
  const se = Math.sqrt(pPooled * (1 - pPooled) * (1 / controlTotal + 1 / treatmentTotal))

  const zScore = (pTreatment - pControl) / se

  // Approximate p-value using normal distribution
  const pValue = 2 * (1 - normalCDF(Math.abs(zScore)))

  const lift = pControl > 0 ? ((pTreatment - pControl) / pControl) * 100 : 0

  return {
    testType: "z_test",
    controlRate: Number((pControl * 100).toFixed(2)),
    treatmentRate: Number((pTreatment * 100).toFixed(2)),
    liftPercent: Number(lift.toFixed(2)),
    zScore: Number(zScore.toFixed(4)),
    pValue: Number(pValue.toFixed(4)),
    isSignificant: pValue < 0.05,
    confidenceLevel: 95,
    controlCi: [
      Number((pControl * 100 - 1.96 * Math.sqrt((pControl * (1 - pControl)) / controlTotal) * 100).toFixed(2)),
      Number((pControl * 100 + 1.96 * Math.sqrt((pControl * (1 - pControl)) / controlTotal) * 100).toFixed(2)),
    ],
    treatmentCi: [
      Number((pTreatment * 100 - 1.96 * Math.sqrt((pTreatment * (1 - pTreatment)) / treatmentTotal) * 100).toFixed(2)),
      Number((pTreatment * 100 + 1.96 * Math.sqrt((pTreatment * (1 - pTreatment)) / treatmentTotal) * 100).toFixed(2)),
    ],
  }
}

/**
 * Calculate required sample size for power analysis
 */
export function calculatePowerAnalysis(
  baselineRate: number,
  mde: number,
  alpha = 0.05,
  power = 0.8,
): PowerAnalysisResult {
  const treatmentRate = baselineRate * (1 + mde)

  const zAlpha = 1.96 // For alpha = 0.05 (two-tailed)
  const zBeta = 0.84 // For power = 0.8

  const pPooled = (baselineRate + treatmentRate) / 2

  const numerator = Math.pow(
    zAlpha * Math.sqrt(2 * pPooled * (1 - pPooled)) +
      zBeta * Math.sqrt(baselineRate * (1 - baselineRate) + treatmentRate * (1 - treatmentRate)),
    2,
  )

  const denominator = Math.pow(treatmentRate - baselineRate, 2)

  const nPerVariant = Math.ceil(numerator / denominator)

  return {
    baselineRate: Number((baselineRate * 100).toFixed(2)),
    expectedTreatmentRate: Number((treatmentRate * 100).toFixed(2)),
    mdePercent: Number((mde * 100).toFixed(2)),
    alpha,
    power,
    sampleSizePerVariant: nPerVariant,
    totalSampleSize: nPerVariant * 2,
  }
}

/**
 * Normal cumulative distribution function approximation
 */
function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x))
  const d = 0.3989423 * Math.exp((-x * x) / 2)
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
  return x > 0 ? 1 - prob : prob
}

/**
 * Format p-value for display
 */
export function formatPValue(pValue: number): string {
  if (pValue < 0.001) return "< 0.001"
  if (pValue < 0.01) return pValue.toFixed(3)
  return pValue.toFixed(2)
}

/**
 * Get significance badge variant
 */
export function getSignificanceBadge(pValue: number): {
  label: string
  variant: "default" | "secondary" | "destructive" | "outline"
} {
  if (pValue < 0.001) return { label: "Highly Significant", variant: "default" }
  if (pValue < 0.05) return { label: "Significant", variant: "default" }
  if (pValue < 0.1) return { label: "Marginally Significant", variant: "secondary" }
  return { label: "Not Significant", variant: "outline" }
}

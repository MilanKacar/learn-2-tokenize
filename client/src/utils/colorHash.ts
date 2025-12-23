/**
 * Generate a consistent pastel color from a token ID
 * Uses HSL color space to ensure high contrast between adjacent IDs
 */
export function generateTokenColor(id: number): string {
  // Use golden angle approximation for good color distribution
  const goldenAngle = 137.508
  
  // Generate hue based on ID with golden angle spacing
  const hue = (id * goldenAngle) % 360
  
  // Use high saturation (60-80%) for visibility but keep it pastel
  const saturation = 60 + (id % 20)
  
  // Use high lightness (75-90%) for pastel effect and readability
  const lightness = 75 + (id % 15)
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}


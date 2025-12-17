/**
 * Converts a width/length string to a numeric rating
 * @param {string|number} width - The width/length value to convert
 * @returns {number} Numeric rating (1-5)
 */
export const getWidthNumericValue = (width) => {
  if (typeof width === 'number') return width;
  if (typeof width === 'string') {
    const lowerWidth = width.toLowerCase();
    if (lowerWidth.includes('too tight') || lowerWidth === 'too-tight') return 1;
    if (lowerWidth.includes('slightly tight') || lowerWidth === 'slightly-tight') return 2;
    if (lowerWidth === 'perfect') return 3;
    if (lowerWidth.includes('slightly loose') || lowerWidth === 'slightly-loose') return 4;
    if (lowerWidth.includes('too loose') || lowerWidth === 'too-loose') return 5;
  }
  return 3; // Default to 'Perfect'
};

/**
 * Converts a numeric rating to a display string
 * @param {number} rating - The numeric rating (1-5)
 * @returns {string} Display string for the rating
 */
export const getWidthDisplayText = (rating) => {
  switch (rating) {
    case 1: return 'Too Tight';
    case 2: return 'Slightly Tight';
    case 3: return 'Perfect';
    case 4: return 'Slightly Loose';
    case 5: return 'Too Loose';
    default: return 'Perfect';
  }
};

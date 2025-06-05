// Inspired by https://github.com/bartlomiejzuber/password-strength-score

/**
 * Configuration options for password strength scoring
 *
 * The password strength is calculated based on:
 * - Password length (up to 4 points):
 * - 2 points if length >= 8 characters
 * - Additional 2 points if length >= 14 characters
 * - Character types (1 point each):
 * - Lowercase letters
 * - Uppercase letters
 * - Numbers
 * - Special characters
 *
 * Maximum possible score is 8 points
 * @typedef PasswordStrengthOptions
 * @property {number} isVeryLongLength - Number of characters required for a very long password (default: 14)
 * @property {number} isLongLength - Number of characters required for a long password (default: 8)
 * @property {number} isVeryLongScore - Additional score for a very long password (default: 2)
 * @property {number} isLongScore - Score for a long password (default: 2)
 * @property {number} uppercaseScore - Score for including uppercase letters (default: 1)
 * @property {number} lowercaseScore - Score for including lowercase letters (default: 1)
 * @property {number} numbersScore - Score for including numbers (default: 1)
 * @property {number} nonAlphanumericsScore - Score for including special characters (default: 1)
 */

/** @type {PasswordStrengthOptions} */
export const defaultOptions = {
  isVeryLongLength: 14,
  isLongLength: 8,
  isLongScore: 2,
  isVeryLongScore: 2,
  uppercaseScore: 1,
  lowercaseScore: 1,
  numbersScore: 1,
  nonAlphanumericsScore: 1
};

/**
 * Calculates the strength score of a password
 *
 * Examples of scores:
 * - "" → 0 (empty password)
 * - "abc" → 1 (lowercase only)
 * - "abcABC" → 2 (lowercase + uppercase)
 * - "abcABC123" → 5 (lowercase + uppercase + numbers + length ≥8)
 * - "abcABC123!@#" → 6 (lowercase + uppercase + numbers + special + length ≥8)
 * - "SuperSecureP@ssw0rd" → 8 (all criteria + very long)
 * @param {string} password - Password to evaluate
 * @param {PasswordStrengthOptions} options - Scoring configuration options
 * @returns {number} Password strength score (0-8)
 */
export const passwordStrength = (password: any, options: any) => {
  if (!password) {
    return 0;
  }

  const mergedOptions = { ...defaultOptions, ...options };

  const lowercaseScore = (/[a-z]/.test(password) && mergedOptions.lowercaseScore) || 0;
  const uppercaseScore = (/[A-Z]/.test(password) && mergedOptions.uppercaseScore) || 0;
  const numbersScore = (/\d/.test(password) && mergedOptions.numbersScore) || 0;
  const nonalphasScore = (/\W/.test(password) && mergedOptions.nonAlphanumericsScore) || 0;

  // Calculate length score separately
  let lengthScore = 0;
  if (password.length >= mergedOptions.isVeryLongLength) {
    lengthScore = mergedOptions.isLongScore + mergedOptions.isVeryLongScore;
  } else if (password.length >= mergedOptions.isLongLength) {
    lengthScore = mergedOptions.isLongScore;
  }

  return uppercaseScore + lowercaseScore + numbersScore + nonalphasScore + lengthScore;
};

/**
 * Analyzes a password and returns suggestions for improvement
 * @param {string} password - Password to analyze
 * @param {PasswordStrengthOptions} options - Scoring configuration options
 * @returns {{
 *   score: number,
 *   suggestions: string[],
 *   missingCriteria: {
 *     lowercase: boolean,
 *     uppercase: boolean,
 *     numbers: boolean,
 *     special: boolean,
 *     length: boolean,
 *     veryLong: boolean
 *   }
 * }} Analysis result containing:
 *   - score: Current password score
 *   - suggestions: Array of improvement suggestions
 *   - missingCriteria: Object indicating which criteria are not met
 */
export const analyzePassword = (password: any, options = defaultOptions) => {
  const mergedOptions = { ...defaultOptions, ...options };
  const score = passwordStrength(password, mergedOptions);

  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecial = /\W/.test(password);
  const isLong = password.length >= mergedOptions.isLongLength;
  const isVeryLong = password.length >= mergedOptions.isVeryLongLength;

  const suggestions = [];

  if (!hasLowercase) {
    suggestions.push('add_lowercase_letters_a_z');
  }
  if (!hasUppercase) {
    suggestions.push('add_uppercase_letters_a_z');
  }
  if (!hasNumbers) {
    suggestions.push('add_numbers_0_9');
  }
  if (!hasSpecial) {
    suggestions.push('add_special_characters');
  }
  if (!isLong) {
    suggestions.push('make_it_at_least_8_characters_long');
  } else if (!isVeryLong) {
    suggestions.push('make_it_at_least_14_characters_long_for_maximum_strength');
  }

  return {
    score,
    suggestions,
    missingCriteria: {
      lowercase: !hasLowercase,
      uppercase: !hasUppercase,
      numbers: !hasNumbers,
      special: !hasSpecial,
      length: !isLong,
      veryLong: !isVeryLong
    }
  };
};

/**
 * Creates a password scorer with custom configuration
 * @param {PasswordStrengthOptions} options - Custom scoring configuration (optional)
 * @param {number} minRequiredScore - Minimum score required for password acceptance (default: 5)
 * @returns {{
 *   scoreFn: (password: string) => number,
 *   analyzeFn: (password: string) => {
 *     score: number,
 *     suggestions: string[],
 *     missingCriteria: {
 *       lowercase: boolean,
 *       uppercase: boolean,
 *       numbers: boolean,
 *       special: boolean,
 *       length: boolean,
 *       veryLong: boolean
 *     }
 *   },
 *   minRequiredScore: number,
 *   maxScore: number
 * }} Scorer object containing:
 *   - scoreFn: Function to calculate password score
 *   - analyzeFn: Function to analyze password and return suggestions for improvement
 *   - minRequiredScore: Minimum required score
 *   - maxScore: Maximum possible score (8)
 */
export const createPasswordScorer = (options = defaultOptions, minRequiredScore = 5) => {
  const mergedOptions = { ...defaultOptions, ...options };

  return {
    scoreFn: (password: any) => passwordStrength(password, mergedOptions),
    analyzeFn: (password: any) => analyzePassword(password, mergedOptions),
    minRequiredScore,
    maxScore:
      mergedOptions.uppercaseScore +
      mergedOptions.lowercaseScore +
      mergedOptions.numbersScore +
      mergedOptions.nonAlphanumericsScore +
      mergedOptions.isLongScore +
      mergedOptions.isVeryLongScore
  };
};

export const defaultScorer = createPasswordScorer(defaultOptions, 5);

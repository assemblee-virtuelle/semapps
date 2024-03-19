// Inspired by https://github.com/bartlomiejzuber/password-strength-score

/**
 * @typedef PasswordStrengthOptions
 * @property {number} isVeryLongLength - Required characters for a very long password (default: 12)
 * @property {number} isLongLength - Required characters for a long password (default: 6)
 * @property {number} isVeryLongScore - Score for a very long password (default: 2.5)
 * @property {number} isLongScore - Score for a long password (default: 1.5)
 * @property {number} uppercaseScore - Score for a password with uppercase letters (default: 1)
 * @property {number} lowercaseScore - Score for a password with lowercase letters (default: 1)
 * @property {number} numbersScore - Score for a password with numbers (default: 1)
 * @property {number} nonAlphanumericsScore - Score for a password without non-alphanumeric characters (default: 1)
 */

/** @type {PasswordStrengthOptions} */
export const defaultOptions = {
  isVeryLongLength: 14,
  isLongLength: 8,
  isLongScore: 2,
  isVeryLongScore: 4,
  uppercaseScore: 1,
  lowercaseScore: 1,
  numbersScore: 1,
  nonAlphanumericsScore: 1
};

/**
 *
 * @param {string} password Password text.
 * @param {PasswordStrengthOptions} options Password options.
 * @returns {number} The password strength score.
 */
export const passwordStrength = (password, options) => {
  if (!password) {
    return 0;
  }

  const mergedOptions = { ...defaultOptions, ...options };

  const longScore = (password.length >= mergedOptions.isLongLength && mergedOptions.isLongScore) || 0;
  const veryLongScore = (password.length >= mergedOptions.isVeryLongLength && mergedOptions.isVeryLongScore) || 0;
  const lowercaseScore = (/[a-z]/.test(password) && mergedOptions.lowercaseScore) || 0;
  const uppercaseScore = (/[A-Z]/.test(password) && mergedOptions.uppercaseScore) || 0;
  const numbersScore = (/\d/.test(password) && mergedOptions.numbersScore) || 0;
  const nonalphasScore = (/\W/.test(password) && mergedOptions.nonAlphanumericsScore) || 0;

  return uppercaseScore + lowercaseScore + numbersScore + nonalphasScore + longScore + veryLongScore;
};

export const createPasswordScorer = (options = defaultOptions, minRequiredScore = 5) => {
  const mergedOptions = { ...defaultOptions, ...options };

  return {
    scoreFn: password => passwordStrength(password, mergedOptions),
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

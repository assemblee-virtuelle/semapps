import { defaultScorer } from '../../passwordScorer';

const validatePasswordStrength = (scorer = defaultScorer) => (value: any) => {
  if (!scorer) return undefined;
  const strength = scorer.scoreFn(value);
  if (strength < scorer.minRequiredScore) {
    return 'auth.input.password_too_weak';
  }
  return undefined;
};

export default validatePasswordStrength;

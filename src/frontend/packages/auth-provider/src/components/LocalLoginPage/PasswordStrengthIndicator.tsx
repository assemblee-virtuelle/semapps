import React from 'react';
import ColorGradientProgressBar from './ColorGradientProgressBar';
import { defaultScorer } from '../../passwordScorer';

export default function PasswordStrengthIndicator({
  scorer = defaultScorer,
  password,
  ...restProps
}: any) {
  const strength = scorer.scoreFn(password);
  return <ColorGradientProgressBar currentVal={strength} minVal={0} maxVal={scorer.maxScore} {...restProps} />;
}

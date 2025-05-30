import React from 'react';
import { LinearProgress, withStyles } from '@mui/material';

/**
 * @typedef {object} Color
 * @property {number} red
 * @property {number} green
 * @property {number} blue
 */

/**
 * Calculate a rgb-color from a gradient between `color1` and `color2`
 * @param {number} fade - Indicates the fade between `color1` and `color2` in the range [0, 1].
 * @param {Color} color1
 * @param {Color} color2
 * @returns {string} `` `rgb(${red}, ${green}, ${blue})` ``
 */
const colorGradient = (fade, color1, color2) => {
  const diffRed = color2.red - color1.red;
  const diffGreen = color2.green - color1.green;
  const diffBlue = color2.blue - color1.blue;

  const gradient = {
    red: Math.floor(color1.red + diffRed * fade),
    green: Math.floor(color1.green + diffGreen * fade),
    blue: Math.floor(color1.blue + diffBlue * fade)
  };

  return `rgb(${gradient.red},${gradient.green},${gradient.blue})`;
};

/**
 * A progress bar that changes its color between its min an max value.
 * @param {object} props
 * @param {Color} [props.badColor] - default: `#FF4047`
 * @param {Color} [props.goodColor] - default: `#00FF6E`
 * @param {number} props.maxVal
 * @param {number} props.minVal
 * @param {number} props.currentVal
 */
export default function ColorGradientProgressBar(props) {
  const { minVal, maxVal, currentVal, badColor, goodColor, ...restProps } = props;

  const color1 = badColor || { red: 0xff, green: 0x40, blue: 0x47 };
  const color2 = goodColor || { red: 0x00, green: 0xff, blue: 0x6e };

  const fade = Math.max(0, Math.min(1, (currentVal - minVal) / (maxVal - minVal)));
  const currentColor = colorGradient(fade, color1, color2);

  const StyledLinearProgress = withStyles({
    colorPrimary: {
      backgroundColor: 'black' // '#e0e0e0'
    },
    barColorPrimary: {
      backgroundColor: currentColor
    }
  })(LinearProgress);

  return <StyledLinearProgress {...restProps} value={100 * fade} variant="determinate" />;
}

import React from 'react';
import { ImageInput as RaImageInput } from 'react-admin';

const ImageInput = (props) => (
  <RaImageInput {...props} format={v => typeof v === 'string' ? { src: v } : v} />
);

export default ImageInput;

import React from 'react';
import { ImageInput as RaImageInput } from 'react-admin';

const format = v => {
  if (typeof v === 'string') {
    return ({ src: v });
  } else if ( Array.isArray(v) ) {
    return v.map(e => typeof e === 'string' ? { src: e } : e);
  } else {
    return v;
  }
}

const ImageInput = (props) => (
  <RaImageInput {...props} format={format} />
);

export default ImageInput;

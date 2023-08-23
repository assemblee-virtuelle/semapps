import React from 'react';
import { ImageInput as RaImageInput } from 'react-admin';

// Since we overwrite FileInput default parse, we must transform the file
// See https://github.com/marmelab/react-admin/blob/2d6a1982981b0f1882e52dd1a974a60eef333e59/packages/ra-ui-materialui/src/input/FileInput.tsx#L57
const transformFile = file => {
  const preview = URL.createObjectURL(file);
  return ({
    rawFile: file,
    src: preview,
    title: file.name,
  });
};

const format = v => {
  if (typeof v === 'string') {
    return ({ src: v });
  } else if ( Array.isArray(v) ) {
    return v.map(e => typeof e === 'string' ? { src: e } : e);
  } else {
    return v;
  }
}

const parse = v => {
  if (v instanceof File) {
    return transformFile(v);
  } else if (v && v.src && !v.rawFile) {
    return v.src;
  } else if (Array.isArray(v)) {
    return v.map(e => parse(e));
  } else {
    return v;
  }
}

const ImageInput = (props) => (
  <RaImageInput {...props} format={format} parse={parse} />
);

export default ImageInput;

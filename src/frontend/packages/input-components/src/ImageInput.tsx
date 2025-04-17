/* eslint-disable react/react-in-jsx-scope */
import { FunctionComponent } from 'react';
import { ImageInputProps, ImageInput as RaImageInput } from 'react-admin';

type AddedFile = {
  rawFile: File;
  src: string;
  title: string;
};

// Since we overwrite FileInput default parse, we must transform the file
// See https://github.com/marmelab/react-admin/blob/2d6a1982981b0f1882e52dd1a974a60eef333e59/packages/ra-ui-materialui/src/input/FileInput.tsx#L57
const transformFile = (file: File): AddedFile => {
  const preview = URL.createObjectURL(file);
  return {
    rawFile: file,
    src: preview,
    title: file.name
  };
};

type PreFormatValue = string | AddedFile;

const format = (v: undefined | PreFormatValue | PreFormatValue[]) => {
  if (typeof v === 'string') {
    return { src: v };
  }
  if (Array.isArray(v)) {
    return v.map(e => (typeof e === 'string' ? { src: e } : e));
  }
  return v;
};

type RawInput = File | { src: string };
type ParsedInput = AddedFile | string | { src: string } | null;

const parse = (v: RawInput | RawInput[] | null): ParsedInput | ParsedInput[] => {
  if (Array.isArray(v)) {
    return v.map(e => parse(e) as ParsedInput);
  }
  if (v instanceof File) {
    return transformFile(v);
  }
  if (v?.src && !('rawFile' in v)) {
    return v.src;
  }

  return v;
};

const ImageInput: FunctionComponent<ImageInputProps> = ({ source, ...otherProps }) => {
  return <RaImageInput source={source} format={format} parse={parse} {...otherProps} />;
};

export default ImageInput;

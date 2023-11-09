/* eslint-disable react/react-in-jsx-scope */
import { FunctionComponent } from 'react';
import { ImageInputProps, ImageInput as RaImageInput, useRecordContext } from 'react-admin';

type AddedFile = {
  rawFile: File;
  src: string;
  title: string;
  fileToDelete: string | null;
};

type DeletedFile = {
  fileToDelete: string | null;
};

// Since we overwrite FileInput default parse, we must transform the file
// See https://github.com/marmelab/react-admin/blob/2d6a1982981b0f1882e52dd1a974a60eef333e59/packages/ra-ui-materialui/src/input/FileInput.tsx#L57
const transformFile = (file: File, oldValue: string | null): AddedFile => {
  const preview = URL.createObjectURL(file);
  return {
    rawFile: file,
    src: preview,
    title: file.name,
    fileToDelete: oldValue
  };
};

type PreFormatValue = string | AddedFile | DeletedFile;

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
type ParsedInput = AddedFile | DeletedFile | string | null;

const parse =
  (oldValue: string | null) =>
  (v: RawInput | RawInput[] | null): ParsedInput | ParsedInput[] => {
    if (Array.isArray(v)) {
      return v.map(e => parse(oldValue)(e) as ParsedInput);
    }
    if (v instanceof File) {
      return transformFile(v, oldValue);
    }
    if (v && v.src) {
      return v.src;
    }
    if (!v && oldValue) {
      return {
        fileToDelete: oldValue
      };
    }

    return null;
  };

type Props = ImageInputProps;

const ImageInput: FunctionComponent<Props> = ({ source, ...otherProps }) => {
  const record = useRecordContext();
  const previousValue = record ? record[source] : null;

  return <RaImageInput source={source} format={format} parse={parse(previousValue)} {...otherProps} />;
};

export default ImageInput;

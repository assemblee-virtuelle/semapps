import { Readable } from 'stream';
import { Binary } from '../types.ts';

export interface BinaryAdapterInterface {
  name: string;
  storeBinary(stream: Readable, mimeType: string, dataset: string): Promise<string>;
  isBinary(uri: string): Promise<boolean>;
  getBinary(uri: string): Promise<Binary>;
  deleteBinary(uri: string): Promise<void>;
}

abstract class BaseBinaryAdapter implements BinaryAdapterInterface {
  abstract name: string;

  abstract storeBinary(stream: Readable, mimeType: string, dataset: string): Promise<string>;

  abstract isBinary(uri: string): Promise<boolean>;

  abstract getBinary(uri: string): Promise<Binary>;

  abstract deleteBinary(uri: string): Promise<void>;
}

export default BaseBinaryAdapter;

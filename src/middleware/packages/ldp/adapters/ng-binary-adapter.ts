import ng from 'nextgraph';
import { Readable } from 'stream';
import path from 'path';
import fs from 'fs';
import urlJoin from 'url-join';
import { v4 as uuidv4 } from 'uuid';
import { NextGraphAdapter } from '@semapps/triplestore';
import { getDatasetFromUri, getSlugFromUri, streamToFile } from '../utils.ts';
import { Binary, BinaryAdapterInterface } from '../types.ts';

class NgBinaryAdapter implements BinaryAdapterInterface {
  name: 'nextgraph';

  private settings: NgBinaryAdapterSettings;

  constructor(settings: NgBinaryAdapterSettings) {
    this.name = 'nextgraph';
    this.settings = settings;
  }

  async storeBinary(stream: Readable, mimeType: string, dataset: string): Promise<string> {
    const session = await this.settings.ngAdapter.openOrGetSession(dataset);

    const tmpFilePath = path.join(this.settings.tmpDir, `${uuidv4()}.tmp`);

    // TODO Convert stream to string, or pass directly the stream to NG method
    // const fileContent = (await streamToString(stream)) as string;
    await streamToFile(stream, tmpFilePath, this.settings.maxSize);

    const uuid = await ng.file_put_to_private_store(session.session_id, tmpFilePath, mimeType);

    // Delete the temporary file
    fs.unlinkSync(tmpFilePath);

    return urlJoin(this.settings.baseUrl, dataset, uuid);
  }

  async isBinary(uri: string): Promise<boolean> {
    const uuid = getSlugFromUri(uri)!;

    return uuid.startsWith('did:ng:j:');
  }

  async getBinary(uri: string): Promise<Binary> {
    const uuid = getSlugFromUri(uri)!;
    const dataset = getDatasetFromUri(uri)!;

    const session = await this.settings.ngAdapter.openOrGetSession(dataset);

    return new Promise(resolve => {
      let buffers: Buffer[] = [];
      let metadata: NgFileMeta;

      ng.file_get_from_private_store(session.session_id, uuid, (blob: any) => {
        if (blob.V0.FileMeta) {
          metadata = blob.V0.FileMeta;
        } else if (blob.V0.FileBinary) {
          if (blob.V0.FileBinary.byteLength > 0) {
            buffers.push(blob.V0.FileBinary);
          }
        } else if (blob.V0 === 'EndOfStream') {
          resolve({
            file: Buffer.concat(buffers), // TODO If content is text, add .toString('utf8') ?
            mimeType: metadata.content_type,
            size: metadata.size,
            time: undefined // NextGraph does not save creation time
          });
        }
      });
    });
  }

  async deleteBinary(dataset: string, uri: string): Promise<void> {
    throw new Error(`Not implemented in NextGraph yet`);
    // const session = await this.settings.ngAdapter.openOrGetSession(dataset);
    // await ng.file_delete_from_private_store(session.session_id, uri);
  }
}

interface NgBinaryAdapterSettings {
  tmpDir: string;
  baseUrl: string;
  maxSize: string | number;
  ngAdapter: NextGraphAdapter;
}

// https://git.nextgraph.org/NextGraph/nextgraph-rs/src/commit/f5758d250f81a0c485744973268c4c946bdee8e1/engine/net/src/app_protocol.rs#L1225-L1228
interface NgFileMeta {
  content_type: string;
  size: number;
}

export default NgBinaryAdapter;

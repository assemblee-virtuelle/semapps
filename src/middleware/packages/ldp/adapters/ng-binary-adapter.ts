import ng from 'nextgraph';
import { Readable } from 'stream';
import urlJoin from 'url-join';
import { ServiceBroker } from 'moleculer';
import { AdapterInterface } from '@semapps/triplestore/adapters/base.ts';
import { getDatasetFromUri, getSlugFromUri } from '../utils.ts';
import { Binary, BinaryAdapterInterface } from '../types.ts';

const streamToString = (stream: Readable) => {
  let res: string = '';
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: Buffer) => {
      res += chunk;
      return res;
    });
    stream.on('error', (err: Error) => reject(err));
    stream.on('end', () => resolve(res));
  });
};

class NgBinaryAdapter implements BinaryAdapterInterface {
  name: 'nextgraph';

  private settings: NgBinaryAdapterSettings;

  constructor(settings: NgBinaryAdapterSettings) {
    this.name = 'nextgraph';
    this.settings = settings;
  }

  async init({ broker } = { broker: ServiceBroker }) {
    // Temporary solution. The adapter should be initialized through the TripleStoreService
    await this.settings.ngAdapter.init({ broker });
  }

  async storeBinary(stream: Readable, mimeType: string, dataset: string): Promise<string> {
    const session = await this.settings.ngAdapter.openSession(dataset);

    const fileContent = streamToString(stream);

    const uuid = await ng.file_put_to_private_store(session.session_id, fileContent, mimeType);

    await this.settings.ngAdapter.closeSession(session);

    return urlJoin(this.settings.baseUrl, dataset, uuid);
  }

  async isBinary(uri: string): Promise<boolean> {
    const uuid = getSlugFromUri(uri)!;

    return uuid.startsWith('did:ng:j:');
  }

  async getBinary(uri: string): Promise<Binary> {
    const uuid = getSlugFromUri(uri)!;
    const dataset = getDatasetFromUri(uri);

    const session = await this.settings.ngAdapter.openSession(dataset);

    let content: string;
    let buffers: Buffer[] = [];
    let metadata: NgFileMeta;

    await ng.file_get_from_private_store(session.session_id, uuid, async (blob: any) => {
      if (blob.V0.FileMeta) {
        metadata = blob.V0.FileMeta;
      } else if (blob.V0.FileBinary) {
        if (blob.V0.FileBinary.byteLength > 0) {
          buffers.push(blob.V0.FileBinary);
        }
      } else if (blob.V0 === 'EndOfStream') {
        content = Buffer.concat(buffers).toString('utf8'); // See if we need encoding
      }
    });

    await this.settings.ngAdapter.closeSession(session);

    return {
      file: content,
      mimeType: metadata.content_type,
      size: metadata.size,
      time: undefined // NextGraph does not save creation time
    };
  }

  async deleteBinary(uri: string): Promise<void> {
    await this.settings.ngAdapter.deleteNamedGraph(uri);
  }
}

interface NgBinaryAdapterSettings {
  baseUrl: string;
  ngAdapter: AdapterInterface;
}

// https://git.nextgraph.org/NextGraph/nextgraph-rs/src/commit/f5758d250f81a0c485744973268c4c946bdee8e1/engine/net/src/app_protocol.rs#L1225-L1228
interface NgFileMeta {
  content_type: string;
  size: number;
}

export default NgBinaryAdapter;

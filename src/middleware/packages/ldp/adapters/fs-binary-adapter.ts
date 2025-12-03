import fs from 'fs';
import bytes from 'bytes';
import path from 'path';
import { Readable } from 'stream';
import { IBindings } from 'sparqljson-parse';
import urlJoin from 'url-join';
import { Errors, ServiceBroker } from 'moleculer';
import { v4 as uuidv4 } from 'uuid';
import { AdapterInterface } from '@semapps/triplestore/adapters/base.ts';
import { getDatasetFromUri, getSlugFromUri } from '../utils.ts';
import { Binary, BinaryAdapterInterface } from '../types.ts';

const { MoleculerError } = Errors;

const streamToFile = (inputStream: Readable, filePath: string, maxSize: string | number): Promise<number> => {
  return new Promise((resolve, reject) => {
    const fileWriteStream = fs.createWriteStream(filePath);
    const maxSizeInBytes = maxSize && bytes.parse(maxSize);
    let fileSize = 0;
    inputStream
      .on('data', (chunk: Buffer) => {
        fileSize += chunk.length;
        if (maxSizeInBytes && fileSize > maxSizeInBytes) {
          fileWriteStream.destroy(); // Stop persisting the file
          reject(new MoleculerError(`The file size is limited to ${maxSize}`, 413, 'CONTENT TOO LARGE'));
        }
      })
      .pipe(fileWriteStream)
      .on('finish', () => resolve(fileSize))
      .on('error', reject);
  });
};

const createDirectoryIfNotExist = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    process.umask(0);
    fs.mkdirSync(dirPath, { recursive: true, mode: 0o0777 });
  }
};

class FsBinaryAdapter implements BinaryAdapterInterface {
  name: 'filesystem';

  private settings: FsBinaryAdapterSettings;

  constructor(settings: FsBinaryAdapterSettings) {
    this.name = 'filesystem';
    this.settings = settings;
  }

  async init({ broker } = { broker: ServiceBroker }) {
    createDirectoryIfNotExist(this.settings.rootDir);

    // Temporary solution. The adapter should be initialized through the TripleStoreService
    await this.settings.tripleStoreAdapter.init({ broker });
  }

  async storeBinary(stream: Readable, mimeType: string, dataset: string): Promise<string> {
    const dirPath = path.join(this.settings.rootDir, dataset);
    createDirectoryIfNotExist(dirPath);

    // Replace with this.createNamedGraph() ?
    const uuid = uuidv4();
    const fileUri = urlJoin(this.settings.baseUrl, dataset, uuid);

    const filePath = path.join(dirPath, uuid);

    const fileSize = await streamToFile(stream, filePath, this.settings.maxSize);

    const now = new Date();

    await this.settings.tripleStoreAdapter.update(
      dataset,
      `
        INSERT DATA {
          GRAPH <${fileUri}> {
            <${fileUri}> a <https://www.w3.org/ns/iana/media-types/application/octet-stream#Resource>, <https://www.w3.org/ns/iana/media-types/${mimeType}#Resource>.
            <${fileUri}> <http://www.w3.org/ns/posix/stat#size> ${fileSize} .
            <${fileUri}> <http://www.w3.org/ns/posix/stat#mtime> "${now.toISOString()}"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
            <${fileUri}> <http://purl.org/dc/terms/created> "${now.toISOString()}"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
            <${fileUri}> <http://purl.org/dc/terms/modified> "${now.toISOString()}"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
          }
        }
      `
    );

    return fileUri;
  }

  async isBinary(uri: string): Promise<boolean> {
    const dataset = getDatasetFromUri(uri)!;

    // For NextGraph, we can look if the uri starts with "did:ng:j:"

    const result: boolean = await this.settings.tripleStoreAdapter.query(
      dataset,
      `
        ASK
        WHERE {
          GRAPH <${uri}> {
            <${uri}> a <https://www.w3.org/ns/iana/media-types/application/octet-stream#Resource> .
          }
        }
      `
    );

    return result;
  }

  async getBinary(uri: string): Promise<Binary> {
    const dataset = getDatasetFromUri(uri)!;

    const result: IBindings[] = await this.settings.tripleStoreAdapter.query(
      dataset,
      `
        SELECT ?ianaMimeType ?size ?time
        WHERE {
          GRAPH <${uri}> {
            <${uri}> a <https://www.w3.org/ns/iana/media-types/application/octet-stream#Resource>, ?ianaMimeType .
            <${uri}> <http://www.w3.org/ns/posix/stat#size> ?size .
            <${uri}> <http://www.w3.org/ns/posix/stat#mtime> ?time .
          }
        }
      `
    );

    if (result.length === 0) throw new Error(`Binary not found ${uri}`);

    const regexResults = /^https:\/\/www\.w3\.org\/ns\/iana\/media-types\/(.*)#Resource$/.exec(
      result[0].ianaMimeType.value
    );

    return {
      file: fs.readFileSync(this.getPathFromUri(uri)),
      mimeType: regexResults![1],
      size: parseInt(result[0].size.value, 10),
      time: new Date(result[0].time.value)
    };
  }

  async deleteBinary(uri: string): Promise<void> {
    const dataset = getDatasetFromUri(uri)!;

    // Replace with this.deleteNamedGraph(uri) ?
    await this.settings.tripleStoreAdapter.query(
      dataset,
      `
        DELETE
        WHERE {
          GRAPH <${uri}> {
            <${uri}> a <https://www.w3.org/ns/iana/media-types/application/octet-stream#Resource>, ?ianaMimeType .
            <${uri}> <http://www.w3.org/ns/posix/stat#size> ?size .
            <${uri}> <http://www.w3.org/ns/posix/stat#mtime> ?time .
          }
        }
      `
    );

    fs.unlinkSync(this.getPathFromUri(uri));
  }

  private getPathFromUri(uri: string): string {
    const uuid = getSlugFromUri(uri);
    const dataset = getDatasetFromUri(uri);
    return path.join(this.settings.rootDir, dataset!, uuid);
  }
}

interface FsBinaryAdapterSettings {
  rootDir: string;
  baseUrl: string;
  maxSize: string | number;
  tripleStoreAdapter: AdapterInterface;
}

export default FsBinaryAdapter;

import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { IBindings } from 'sparqljson-parse';
import urlJoin from 'url-join';
import { FusekiAdapter, NextGraphAdapter } from '@semapps/triplestore';
import { getDatasetFromUri, getSlugFromUri, createDirectoryIfNotExist, streamToFile } from '../utils.ts';
import { Binary, BinaryAdapterInterface } from '../types.ts';

class FsBinaryAdapter implements BinaryAdapterInterface {
  name: 'filesystem';

  private settings: FsBinaryAdapterSettings;

  constructor(settings: FsBinaryAdapterSettings) {
    this.name = 'filesystem';
    this.settings = settings;

    createDirectoryIfNotExist(this.settings.rootDir);
  }

  async storeBinary(stream: Readable, mimeType: string, dataset: string): Promise<string> {
    const dirPath = path.join(this.settings.rootDir, dataset);
    createDirectoryIfNotExist(dirPath);

    const graphName = await this.settings.tripleStoreAdapter.createNamedGraph(dataset);
    const fileUri = urlJoin(this.settings.baseUrl, dataset, graphName);

    const filePath = path.join(dirPath, graphName);

    const fileSize = await streamToFile(stream, filePath, this.settings.maxSize);

    const now = new Date();

    await this.settings.tripleStoreAdapter.update(
      dataset,
      `
        INSERT DATA {
          GRAPH <${graphName}> {
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
        SELECT ?type ?size ?time
        WHERE {
          GRAPH ?g {
            <${uri}> a ?type .
            <${uri}> <http://www.w3.org/ns/posix/stat#size> ?size .
            <${uri}> <http://www.w3.org/ns/posix/stat#mtime> ?time .
          }
        }
      `
    );

    if (result.length === 0) throw new Error(`Binary not found ${uri}`);

    const ianaMimeType = result.find(
      node => node.type.value !== 'https://www.w3.org/ns/iana/media-types/application/octet-stream#Resource'
    )!.type.value;

    const regexResults = /^https:\/\/www\.w3\.org\/ns\/iana\/media-types\/(.*)#Resource$/.exec(ianaMimeType);

    return {
      file: fs.readFileSync(this.getPathFromUri(uri)),
      mimeType: regexResults![1],
      size: parseInt(result[0].size.value, 10),
      time: new Date(result[0].time.value)
    };
  }

  async deleteBinary(dataset: string, uri: string): Promise<void> {
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
  tripleStoreAdapter: FusekiAdapter | NextGraphAdapter;
}

export default FsBinaryAdapter;

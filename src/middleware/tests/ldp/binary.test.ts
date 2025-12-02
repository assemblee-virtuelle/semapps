import fetch from 'node-fetch';
import fs from 'fs';
import { ServiceBroker } from 'moleculer';
import path, { join as pathJoin } from 'path';
import { Binary } from '@semapps/ldp';
import { fileURLToPath } from 'url';
import { createAccount } from '../utils.ts';
import initialize from './initialize.ts';
import * as CONFIG from '../config.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

jest.setTimeout(20000);
let broker: ServiceBroker;
let alice: any;

beforeAll(async () => {
  broker = await initialize(false);
  await broker.start();
  alice = await createAccount(broker, 'alice');
});

afterAll(async () => {
  if (broker) await broker.stop();
});

describe('Binary handling of LDP server', () => {
  let fileUri: string;
  let filePath: string | null;
  let binary: Binary;
  let containerUri: string;

  test('Post image to container', async () => {
    containerUri = await alice.getContainerUri(
      'https://www.w3.org/ns/iana/media-types/application/octet-stream#Resource'
    );

    const readStream = fs.createReadStream(pathJoin(__dirname, 'av-icon.png'));

    const { headers } = await alice.fetch(containerUri, {
      method: 'POST',
      body: readStream,
      headers: new fetch.Headers({ 'Content-Type': 'image/png' })
    });

    fileUri = headers.get('Location')!;
    expect(fileUri).not.toBeNull();

    filePath = fileUri!.replace(CONFIG.HOME_URL!, '');

    expect(fs.existsSync(pathJoin(__dirname, '../uploads', filePath))).toBeTruthy();
  });

  test('Get binary', async () => {
    binary = await alice.call('ldp.binary.get', { resourceUri: fileUri });

    expect(binary).toMatchObject({
      file: expect.anything(),
      mimeType: 'image/png',
      size: 3181,
      time: expect.anything()
    });
  });

  test('Get container', async () => {
    await expect(alice.fetch(containerUri)).resolves.toMatchObject({
      json: {
        type: expect.arrayContaining(['ldp:Container', 'ldp:BasicContainer']),
        'ldp:contains': [
          {
            id: fileUri,
            type: expect.arrayContaining([
              'https://www.w3.org/ns/iana/media-types/application/octet-stream#Resource',
              'https://www.w3.org/ns/iana/media-types/image/png#Resource'
            ]),
            'stat:size': '3181',
            'stat:mtime': binary.time.toISOString()
          }
        ]
      }
    });
  });

  test('Get image as binary (via API)', async () => {
    const { headers, body } = await alice.fetch(fileUri, {
      headers: new fetch.Headers({ Accept: '*/*' })
    });

    expect(headers.get('Content-Length')).toBe('3181');
    expect(headers.get('Cache-Control')).toBe('public, max-age=31536000');
    expect(headers.get('Content-Type')).toBe('image/png');

    expect(body).toContain('PNG');
  });

  test('Get image as resource (via Moleculer action)', async () => {
    await expect(alice.call('ldp.resource.get', { resourceUri: fileUri })).resolves.toMatchObject({
      id: fileUri,
      type: expect.arrayContaining([
        'https://www.w3.org/ns/iana/media-types/application/octet-stream#Resource',
        'https://www.w3.org/ns/iana/media-types/image/png#Resource'
      ]),
      'stat:size': '3181',
      'stat:mtime': binary.time.toISOString()
    });
  });

  test('Delete image', async () => {
    await expect(
      alice.fetch(fileUri, {
        method: 'DELETE'
      })
    ).resolves.toMatchObject({
      status: 204
    });

    expect(fs.existsSync(pathJoin(__dirname, '../uploads/files/av-icon.png'))).toBeFalsy();

    await expect(alice.fetch(fileUri)).resolves.toMatchObject({ status: 404 });

    await expect(alice.fetch(containerUri)).resolves.toMatchObject({
      json: {
        type: expect.arrayContaining(['ldp:Container', 'ldp:BasicContainer']),
        'ldp:contains': []
      }
    });
  });
});

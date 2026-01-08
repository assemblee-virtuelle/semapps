import fetch from 'node-fetch';
import waitForExpect from 'wait-for-expect';
import fs from 'fs';
import { ServiceBroker } from 'moleculer';
import path, { join as pathJoin } from 'path';
import { getSlugFromUri } from '@semapps/ldp';
import { fileURLToPath } from 'url';
import { fetchServer, createAccount } from '../utils.ts';
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
  let fileUri: string | null;
  let filePath: string | null;
  let fileName: string | null;
  let containerUri: string;

  test('Post image to container', async () => {
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      containerUri = await alice.call('ldp.registry.getUri', { type: 'semapps:File', isContainer: true });
      expect(containerUri).not.toBeUndefined();
    });

    const readStream = fs.createReadStream(pathJoin(__dirname, 'av-icon.png'));

    const { headers } = await fetchServer(containerUri, {
      method: 'POST',
      body: readStream,
      headers: new fetch.Headers({ 'Content-Type': 'image/png' })
    });

    fileUri = headers.get('Location');
    expect(fileUri).not.toBeNull();

    filePath = fileUri!.replace(CONFIG.HOME_URL!, '');
    fileName = getSlugFromUri(fileUri);

    expect(fs.existsSync(pathJoin(__dirname, '../uploads', filePath))).toBeTruthy();
  });

  test('Get container', async () => {
    await expect(fetchServer(containerUri)).resolves.toMatchObject({
      json: {
        type: expect.arrayContaining(['ldp:Container', 'ldp:BasicContainer']),
        'ldp:contains': [
          {
            id: fileUri,
            type: 'semapps:File',
            'semapps:fileName': fileName,
            'semapps:localPath': `uploads/${filePath}`,
            'semapps:mimeType': 'image/png'
          }
        ]
      }
    });
  });

  test('Get image as binary (via API)', async () => {
    const { headers, body } = await fetchServer(fileUri, {
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
      type: 'semapps:File',
      'semapps:fileName': fileName,
      'semapps:localPath': `uploads/${filePath}`,
      'semapps:mimeType': 'image/png'
    });
  });

  test('Delete image', async () => {
    await expect(
      fetchServer(fileUri, {
        method: 'DELETE'
      })
    ).resolves.toMatchObject({
      status: 204
    });

    expect(fs.existsSync(pathJoin(__dirname, '../uploads/files/av-icon.png'))).toBeFalsy();

    await expect(fetchServer(fileUri)).resolves.toMatchObject({ status: 404 });

    await expect(fetchServer(containerUri)).resolves.toMatchObject({
      json: {
        type: expect.arrayContaining(['ldp:Container', 'ldp:BasicContainer']),
        'ldp:contains': []
      }
    });
  });
});

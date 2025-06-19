// @ts-expect-error TS(7016): Could not find a declaration file for module 'node... Remove this comment to see the full error message
import fetch from 'node-fetch';
import fs from 'fs';
// @ts-expect-error TS(2305): Module '"path"' has no exported member 'pathJoin'.
import { pathJoin as join } from 'path';
import urlJoin from 'url-join';
import { MIME_TYPES } from '@semapps/mime-types';
import { getSlugFromUri } from '@semapps/ldp';
import { fetchServer } from '../utils.ts';
import initialize from './initialize.ts';
// @ts-expect-error TS(1192): Module '"/home/laurin/projects/virtual-assembly/se... Remove this comment to see the full error message
import CONFIG from '../config.ts';

// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.setTimeout(20000);
let broker: any;

// @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
beforeAll(async () => {
  broker = await initialize();
});

// @ts-expect-error TS(2304): Cannot find name 'afterAll'.
afterAll(async () => {
  if (broker) await broker.stop();
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Binary handling of LDP server', () => {
  let fileUri: any;
  let filePath: any;
  let fileName: any;

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Post image to container', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'pathJoin'.
    const readStream = fs.createReadStream(pathJoin(__dirname, 'av-icon.png'));

    const { headers } = await fetchServer(urlJoin(CONFIG.HOME_URL, 'files'), {
      method: 'POST',
      body: readStream,
      headers: new fetch.Headers({
        'Content-Type': 'image/png'
      })
    });

    fileUri = headers.get('Location');
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(fileUri).not.toBeNull();

    filePath = fileUri.replace(CONFIG.HOME_URL, '');
    fileName = getSlugFromUri(fileUri);

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(fs.existsSync(pathJoin(__dirname, '../uploads', filePath))).toBeTruthy();
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Get container', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(fetchServer(urlJoin(CONFIG.HOME_URL, 'files'))).resolves.toMatchObject({
      json: {
        '@type': ['ldp:Container', 'ldp:BasicContainer'],
        'ldp:contains': [
          {
            '@id': fileUri,
            '@type': 'semapps:File',
            'semapps:fileName': fileName,
            'semapps:localPath': `uploads/${filePath}`,
            'semapps:mimeType': 'image/png'
          }
        ]
      }
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Get image as binary (via API)', async () => {
    const { headers, body } = await fetchServer(fileUri, {
      headers: new fetch.Headers({
        Accept: '*/*'
      })
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(headers.get('Content-Length')).toBe('3181');
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(headers.get('Cache-Control')).toBe('public, max-age=31536000');
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(headers.get('Content-Type')).toBe('image/png');

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(body).toContain('PNG');
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Get image as resource (via Moleculer action)', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(
      broker.call('ldp.resource.get', {
        resourceUri: fileUri,
        accept: MIME_TYPES.JSON
      })
    ).resolves.toMatchObject({
      '@id': fileUri,
      '@type': 'semapps:File',
      'semapps:fileName': fileName,
      'semapps:localPath': `uploads/${filePath}`,
      'semapps:mimeType': 'image/png'
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Delete image', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(
      fetchServer(fileUri, {
        method: 'DELETE'
      })
    ).resolves.toMatchObject({
      status: 204
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(fs.existsSync(pathJoin(__dirname, '../uploads/files/av-icon.png'))).toBeFalsy();

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(fetchServer(fileUri)).resolves.toMatchObject({
      status: 404
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(fetchServer(urlJoin(CONFIG.HOME_URL, 'files'))).resolves.toMatchObject({
      json: {
        '@type': ['ldp:Container', 'ldp:BasicContainer'],
        'ldp:contains': []
      }
    });
  });
});

const fetch = require('node-fetch');
const fs = require('fs');
const { join: pathJoin } = require('path');
const urlJoin = require('url-join');
const { getSlugFromUri } = require('@semapps/ldp');
const { fetchServer } = require('../utils');
const initialize = require('./initialize');
const CONFIG = require('../config');

jest.setTimeout(20000);
let broker;

beforeAll(async () => {
  broker = await initialize();
});
afterAll(async () => {
  if (broker) await broker.stop();
});

describe('Binary handling of LDP server', () => {
  let fileUri;
  let filePath;
  let fileName;

  test('Post image to container', async () => {
    const readStream = fs.createReadStream(pathJoin(__dirname, 'av-icon.png'));

    const { headers } = await fetchServer(urlJoin(CONFIG.HOME_URL, 'files'), {
      method: 'POST',
      body: readStream,
      headers: new fetch.Headers({
        'Content-Type': 'image/png'
      })
    });

    fileUri = headers.get('Location');
    expect(fileUri).not.toBeNull();

    filePath = fileUri.replace(CONFIG.HOME_URL, '');
    fileName = getSlugFromUri(fileUri);

    expect(fs.existsSync(pathJoin(__dirname, '../uploads', filePath))).toBeTruthy();
  });

  test('Get container', async () => {
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

  test('Get image as binary (via API)', async () => {
    const { headers, body } = await fetchServer(fileUri, {
      headers: new fetch.Headers({
        Accept: '*/*'
      })
    });

    expect(headers.get('Content-Length')).toBe('3181');
    expect(headers.get('Cache-Control')).toBe('public, max-age=31536000');
    expect(headers.get('Content-Type')).toBe('image/png');

    expect(body).toContain('PNG');
  });

  test('Get image as resource (via Moleculer action)', async () => {
    await expect(broker.call('ldp.resource.get', { resourceUri: fileUri })).resolves.toMatchObject({
      '@id': fileUri,
      '@type': 'semapps:File',
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

    await expect(fetchServer(fileUri)).resolves.toMatchObject({
      status: 404
    });

    await expect(fetchServer(urlJoin(CONFIG.HOME_URL, 'files'))).resolves.toMatchObject({
      json: {
        '@type': ['ldp:Container', 'ldp:BasicContainer'],
        'ldp:contains': []
      }
    });
  });
});

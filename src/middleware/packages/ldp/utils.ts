import bytes from 'bytes';
import fs from 'fs';
import { Readable } from 'stream';
import urlJoin from 'url-join';
import { Errors } from 'moleculer';

const { MoleculerError } = Errors;

export const regexPrefix = new RegExp('^@prefix ([\\w-]*: +<.*>) .', 'gm');
export const regexProtocolAndHostAndPort = new RegExp('^http(s)?:\\/\\/([\\w-\\.:]*)');

export const createFragmentURL = (baseUrl: any, serverUrl: any) => {
  let fragment = 'me';
  const res = serverUrl.match(regexProtocolAndHostAndPort);
  if (res) fragment = res[2].replace('-', '_').replace('.', '_').replace(':', '_');

  return urlJoin(baseUrl, `#${fragment}`);
};

export const isMirror = (resourceUri: any, baseUrl: any) => {
  return !urlJoin(resourceUri, '/').startsWith(baseUrl);
};

export const buildBlankNodesQuery = (depth: any) => {
  const BASE_QUERY = '?s1 ?p1 ?o1 .';
  let construct = BASE_QUERY;
  let where = '';
  if (depth > 0) {
    let whereQueries = [];
    whereQueries.push([BASE_QUERY]);
    for (let i = 1; i <= depth; i++) {
      construct += `\r\n?o${i} ?p${i + 1} ?o${i + 1} .`;
      whereQueries.push([
        ...whereQueries[whereQueries.length - 1],
        `FILTER((isBLANK(?o${i}))) .`,
        `?o${i} ?p${i + 1} ?o${i + 1} .`
      ]);
    }
    where = `{\r\n${whereQueries.map(q1 => q1.join('\r\n')).join('\r\n} UNION {\r\n')}\r\n}`;
  } else if (depth === 0) {
    where = BASE_QUERY;
  } else {
    throw new Error('The depth of buildBlankNodesQuery should be 0 or more');
  }
  return { construct, where };
};

export const isURL = (value: any) => (typeof value === 'string' || value instanceof String) && value.startsWith('http');

/** If the value starts with `http` or `urn:` */
export const isURI = (value: any) =>
  (typeof value === 'string' || value instanceof String) && (value.startsWith('http') || value.startsWith('urn:'));

export const isWebId = (value: any) => value !== 'system' && value !== 'anon' && isURL(value);

export const buildFiltersQuery = (filters: any) => {
  let query = '';
  if (filters) {
    Object.keys(filters).forEach((predicate, i) => {
      if (filters[predicate]) {
        query += `
          FILTER EXISTS { 
            GRAPH ?g1 { ?s1 ${isURI(predicate) ? `<${predicate}>` : predicate} ${
              isURI(filters[predicate]) ? `<${filters[predicate]}>` : `"${filters[predicate]}"`
            } } }.
        `;
      } else {
        query += `
          FILTER NOT EXISTS { GRAPH ?g1 { ?s1 ${isURI(predicate) ? `<${predicate}>` : predicate} ?unwanted${i} } } .
        `;
      }
    });
  }
  return query;
};

export const isObject = (value: any) => typeof value === 'object' && !Array.isArray(value) && value !== null;
export const getSlugFromUri = (uri: any) => uri.match(new RegExp(`.*/(.*)`))[1];

/** @deprecated Use the ldp.resource.getContainers action instead */
export const getContainerFromUri = (uri: any) => uri.match(new RegExp(`(.*)/.*`))[1];

export const getPathFromUri = (uri: any) => {
  try {
    const urlObject = new URL(uri);
    return urlObject.pathname;
  } catch (e) {
    return false;
  }
};

// Transforms "http://localhost:3000/alice/{uuid}" to "alice"
export const getDatasetFromUri = (uri: string): string | undefined => {
  const path = getPathFromUri(uri);
  if (path) {
    const parts = path.split('/');
    if (parts.length > 1) return parts[1];
  } else {
    throw new Error(`${uri} is not a valid URL`);
  }
};

// Transforms "http://localhost:3000/alice/{uuid}" to "http://localhost:3000/alice"
export const getBaseUrlFromUri = (uri: string): string => {
  const { origin } = new URL(uri);
  const dataset = getDatasetFromUri(uri);
  return urlJoin(origin, dataset!);
};

export const getId = (resource: any) => resource.id || resource['@id'];
export const getType = (resource: any) => resource.type || resource['@type'];

export const hasType = (resource: any, type: any) => {
  const resourceType = getType(resource);
  return Array.isArray(resourceType) ? resourceType.includes(type) : resourceType === type;
};

export const isContainer = (resource: any) => hasType(resource, 'ldp:Container');

/** @deprecated Use arrayOf instead */
export const defaultToArray = (value: any) => (!value ? undefined : Array.isArray(value) ? value : [value]);

export const delay = (t: any) => new Promise(resolve => setTimeout(resolve, t));

// Remove undefined values from object
export const cleanUndefined = (obj: any) =>
  Object.keys(obj).reduce((acc, key) => (obj[key] === undefined ? acc : { ...acc, [key]: obj[key] }), {});

export const parseJson = (json: any) => {
  try {
    if (json) {
      return JSON.parse(json);
    }
  } catch (e) {
    // Ignore parse error. Assume it is a simple string.
  }
  return json;
};

export const arrayOf = (value: any) => {
  // If the field is null-ish, we suppose there are no values.
  if (value === null || value === undefined) {
    return [];
  }
  // Return as is.
  if (Array.isArray(value)) {
    return value;
  }
  // Single value is made an array.
  return [value];
};

/**
 * Call a callback and expect the result object to have all properties in `fieldNames`.
 * If not, try again after `delayMs` until `maxTries` is reached.
 * If `fieldNames` is `undefined`, the return value of `callback` is expected to not be
 * `undefined`.
 */
export const waitForResource = async <T>(
  delayMs: number,
  fieldNames: keyof T | string | (string | keyof T)[],
  maxTries: number,
  callback: () => T
): Promise<T> => {
  for (let i = 0; i < maxTries; i += 1) {
    const result = await callback();
    // If a result (and the expected field, if required) is present, return.
    if (result !== undefined && arrayOf(fieldNames).every(fieldName => Object.keys(result).includes(fieldName))) {
      return result;
    }
    await delay(delayMs);
  }
  throw new Error(`Waiting for resource failed. No results after ${maxTries} tries`);
};

export const streamToString = (stream: Readable) => {
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

export const streamToFile = (inputStream: Readable, filePath: string, maxSize: string | number): Promise<number> => {
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

export const createDirectoryIfNotExist = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    process.umask(0);
    fs.mkdirSync(dirPath, { recursive: true, mode: 0o0777 });
  }
};

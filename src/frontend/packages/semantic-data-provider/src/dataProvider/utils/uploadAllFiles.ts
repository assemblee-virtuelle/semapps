import { RaRecord } from 'react-admin';
import { v4 as uuidv4 } from 'uuid';
import { Configuration } from '../types';

export const getRandomNameWithExtension = (fileName: string) => {
  const splitFileName = fileName.split('.');
  if (splitFileName.length > 1) {
    const extension = splitFileName.pop();
    return `${uuidv4()}.${extension?.toLowerCase()}`;
  }
  return uuidv4();
};

export const isFile = (o: any) => o?.rawFile && o.rawFile instanceof File;

const getUploadsContainerUri = (config: Configuration) => {
  const serverKey = Object.keys(config.dataServers).find(key => config.dataServers[key].uploadsContainer);
  if (serverKey && config.dataServers[serverKey].uploadsContainer) {
    const url = new URL(config.dataServers[serverKey].uploadsContainer!, config.dataServers[serverKey].baseUrl).href;
    return url;
  }
};

const uploadFile = async (rawFile: File, config: Configuration) => {
  const uploadsContainerUri = getUploadsContainerUri(config);
  if (!uploadsContainerUri) throw new Error("You must define an uploadsContainer in one of the server's configuration");

  const response = await config.httpClient(uploadsContainerUri, {
    method: 'POST',
    body: rawFile,
    headers: new Headers({
      Slug: getRandomNameWithExtension(rawFile.name),
      'Content-Type': rawFile.type
    })
  });

  if (response.status === 201) {
    return response.headers.get('Location');
  }
};

/*
 * Look for raw files in the record data.
 * If there are any, upload them and replace the file by its URL.
 */
const uploadAllFiles = async (record: RaRecord, config: Configuration) => {
  for (const property of Object.keys(record)) {
    const value = record[property];
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        if (isFile(value[i])) {
          record[property][i] = await uploadFile(record[property][i].rawFile, config);
        }
      }
    } else if (isFile(record[property])) {
      record[property] = await uploadFile(record[property].rawFile, config);
    }
  }
  return record;
};

export default uploadAllFiles;

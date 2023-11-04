import urlJoin from 'url-join';
import { v4 as uuidv4 } from 'uuid';

export const getRandomNameWithExtension = fileName => {
  const splitFileName = fileName.split('.');
  if (splitFileName.length > 1) {
    const extension = splitFileName.pop();
    return `${uuidv4()}.${extension?.toLowerCase()}`;
  }
  return uuidv4();
};

export const isFile = o => o?.rawFile && o.rawFile instanceof File;

const getUploadsContainerUri = config => {
  const serverKey = Object.keys(config.dataServers).find(key => config.dataServers[key].uploadsContainer);
  if (serverKey) {
    return urlJoin(config.dataServers[serverKey].baseUrl, config.dataServers[serverKey].uploadsContainer);
  }
};

const uploadFile = async (rawFile, config) => {
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
const uploadAllFiles = async (record, config) => {
  for (const property in record) {
    if (Object.prototype.hasOwnProperty.call(record, property)) {
      if (Array.isArray(record[property])) {
        for (let i = 0; i < record[property].length; i++) {
          if (isFile(record[property][i])) {
            record[property][i] = await uploadFile(record[property][i].rawFile, config);
          }
        }
      } else if (isFile(record[property])) {
        record[property] = await uploadFile(record[property].rawFile, config);
      }
    }
  }
  return record;
};

export default uploadAllFiles;

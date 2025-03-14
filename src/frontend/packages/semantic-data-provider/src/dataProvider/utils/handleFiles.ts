import { RaRecord } from 'react-admin';
import { Configuration } from '../types';
import getUploadsContainerUri from './getUploadsContainerUri';

const isFile = (o: any): o is { rawFile: File } => o?.rawFile && o.rawFile instanceof File;
const isFileToDelete = (o: any): o is { fileToDelete: string } =>
  o?.fileToDelete !== undefined && o?.fileToDelete !== null;

export const uploadFile = async (rawFile: File, config: Configuration, serverKey?: string) => {
  const uploadsContainerUri = getUploadsContainerUri(config, serverKey);
  if (!uploadsContainerUri)
    throw new Error("You must define an container with binaryResources in one of the server's configuration");

  const response = await config.httpClient(uploadsContainerUri, {
    method: 'POST',
    body: rawFile,
    headers: new Headers({
      'Content-Type': rawFile.type
    })
  });

  if (response.status === 201) {
    return response.headers.get('Location');
  }
  return null;
};

const deleteFiles = async (filesToDelete: string[], config: Configuration) => {
  return Promise.all(
    filesToDelete.map(file =>
      config.httpClient(file, {
        method: 'DELETE'
      })
    )
  );
};

/*
 * Look for raw files in the record data.
 * If there are any, upload them and replace the file by its URL.
 */
const uploadAllFiles = async (record: Partial<RaRecord>, config: Configuration, serverKey?: string) => {
  const filesToDelete: string[] = [];
  const updatedRecord = { ...record };

  for (const property of Object.keys(record)) {
    const value = record[property];
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const itemValue = value[i];
        if (isFile(itemValue)) {
          if (isFileToDelete(itemValue)) {
            filesToDelete.push(itemValue.fileToDelete);
          }
          updatedRecord[property][i] = await uploadFile(itemValue.rawFile, config, serverKey);
        } else if (isFileToDelete(itemValue)) {
          filesToDelete.push(itemValue.fileToDelete);
          updatedRecord[property][i] = null;
        }
      }
    } else if (isFile(value)) {
      if (isFileToDelete(value)) {
        filesToDelete.push(value.fileToDelete);
      }
      updatedRecord[property] = await uploadFile(value.rawFile, config, serverKey);
    } else if (isFileToDelete(value)) {
      filesToDelete.push(value.fileToDelete);
      updatedRecord[property] = null;
    }
  }

  return {
    updatedRecord,
    filesToDelete
  };
};

export default {
  upload: uploadAllFiles,
  delete: deleteFiles
};

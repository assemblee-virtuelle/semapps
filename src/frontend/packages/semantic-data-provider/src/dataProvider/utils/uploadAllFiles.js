import createSlug from 'speakingurl';

export const getSlugWithExtension = fileName => {
  let fileExtension = '';
  let splitFileName = fileName.split('.');
  if (splitFileName.length > 1) {
    fileExtension = splitFileName.pop();
    fileName = splitFileName.join('.');
  }
  return createSlug(fileName, { lang: 'fr' }) + '.' + fileExtension;
};

export const isFile = o => o && o.rawFile && o.rawFile instanceof File;

const uploadFile = async (rawFile, config) => {
  const response = await config.httpClient(config.uploadsContainerUri, {
    method: 'POST',
    body: rawFile,
    headers: new Headers({
      // We must sluggify the file name, because we can't use non-ASCII characters in the header
      // However we keep the extension apart (if it exists) so that it is not replaced with a -
      // TODO let the middleware guess the extension based on the content type
      Slug: getSlugWithExtension(rawFile.name),
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
  if (!config.uploadsContainerUri) throw new Error('No uploadsContainerUri defined for the data provider');

  for (let property in record) {
    if (record.hasOwnProperty(property)) {
      if (Array.isArray(record[property])) {
        for (let i = 0; i < record[property].length; i++) {
          if (isFile(record[property][i])) {
            record[property][i] = await uploadFile(record[property][i].rawFile, config);
          }
        }
      } else {
        if (isFile(record[property])) {
          record[property] = await uploadFile(record[property].rawFile, config);
        }
      }
    }
  }
  return record;
};

export default uploadAllFiles;

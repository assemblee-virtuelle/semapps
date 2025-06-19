import { fsPromises as promises } from 'fs';
import sanitizeHtml from 'sanitize-html';
import googlelibphonenumberModule from 'google-libphonenumber';
const PNF = googlelibphonenumberModule.PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const convertToIsoString = str => str && new Date(str).toISOString();

const formatPhoneNumber = (number, countryCode) => {
  if (number && countryCode) {
    try {
      const parsedNumber = phoneUtil.parseAndKeepRawInput(number, countryCode);
      return phoneUtil.format(parsedNumber, PNF.INTERNATIONAL);
    } catch (e) {
      // In case of error, return the raw phone number
      return number;
    }
  }
};

const frenchAddressSearch = async query => {
  const url = new URL('https://api-adresse.data.gouv.fr/search/');
  url.searchParams.set('q', query);
  const response = await fetch(url.toString());

  if (response.ok) {
    const json = await response.json();
    return json.features[0];
  }
  return false;
};

const frenchAddressReverseSearch = async (lat, lon) => {
  const url = new URL('https://api-adresse.data.gouv.fr/reverse/');
  url.searchParams.set('lat', lat);
  url.searchParams.set('lon', lon);
  const response = await fetch(url.toString());

  if (response.ok) {
    const json = await response.json();
    return json.features.length > 0 ? json.features[0] : false;
  }
  return false;
};

const removeHtmlTags = text => sanitizeHtml(text, { allowedTags: [] }).trim();

const isDir = async path => {
  try {
    const stat = await fsPromises.lstat(path);
    const value = stat.isDirectory();
    return value;
  } catch (e) {
    // lstatSync throws an error if path doesn't exist
    return false;
  }
};

export {
  convertToIsoString,
  formatPhoneNumber,
  frenchAddressSearch,
  frenchAddressReverseSearch,
  removeHtmlTags,
  isDir
};

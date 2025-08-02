import Negotiator from 'negotiator';
import { MIME_TYPES, TYPES_REPO } from './constants.ts';

import { Errors } from 'moleculer';

const { MoleculerError } = Errors;

const negotiateType = function (incomingType: any) {
  const availableMediaTypes: any = [];
  const negotiatorType = incomingType;
  TYPES_REPO.forEach(trSupported => {
    trSupported.mimeFull.forEach(tr => availableMediaTypes.push(tr));
  });
  const negotiator = new Negotiator({
    headers: {
      accept: negotiatorType
    }
  });
  const rawNegotiatedAccept = negotiator.mediaType(availableMediaTypes);
  if (rawNegotiatedAccept !== undefined) {
    return TYPES_REPO.filter(tr => tr.mimeFull.includes(rawNegotiatedAccept))[0];
  }
  throw new MoleculerError(`Type not supported : ${incomingType}`, 400, 'TYPE_NOT_SUPPORTED');
};

const negotiateTypeMime = function (incomingType: any) {
  return negotiateType(incomingType).mime;
};

const negotiateTypeN3 = function (incomingType: any) {
  return negotiateType(incomingType).N3Mapping;
};

const negotiateTypeFuseki = function (incomingType: any) {
  return negotiateType(incomingType).fusekiMapping;
};

// Return true if the provided `type` is accepted by the allowedTypes.
// Note that allowedTypes may include wild cards such as "image/*"
const isMimeTypeMatching = (type: any, types: any) => {
  const negotiator = new Negotiator({
    headers: {
      accept: Array.isArray(types) ? types.join(', ') : types
    }
  });

  const result = negotiator.mediaType([type]);

  return !!result;
};

export { MIME_TYPES, negotiateType, negotiateTypeMime, negotiateTypeN3, negotiateTypeFuseki, isMimeTypeMatching };

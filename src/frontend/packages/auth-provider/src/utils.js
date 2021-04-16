import urlJoin from "url-join";

export const defaultToArray = value => (!value ? undefined : Array.isArray(value) ? value : [value]);

// Transform the URI to the one used to find the ACL
// To be compatible with all servers, we should do a HEAD request to the resource URI
export const getAclUri = (middlewareUri, resourceUri) => urlJoin(middlewareUri, resourceUri.replace(middlewareUri, '_acl/'));

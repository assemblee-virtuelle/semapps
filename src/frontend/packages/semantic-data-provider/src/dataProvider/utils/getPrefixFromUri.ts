const getPrefixFromUri = (uri: string, ontologies: Record<string, string>) => {
  for (const [prefix, namespace] of Object.entries(ontologies)) {
    if (uri.startsWith(namespace)) return uri.replace(namespace, `${prefix}:`);
  }
  return uri;
};

export default getPrefixFromUri;

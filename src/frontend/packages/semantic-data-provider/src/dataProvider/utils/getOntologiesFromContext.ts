import { fetchUtils } from 'react-admin';

const isURL = (value: any) => (typeof value === 'string' || value instanceof String) && value.startsWith('http');

const getOntologiesFromContextJson = (contextJson: any) => {
  const ontologies: Record<string, string> = {};

  for (const [key, value] of Object.entries(contextJson)) {
    if (isURL(value)) {
      ontologies[key] = value as string;
    }
  }

  return ontologies;
};

const getOntologiesFromContextUrl = async (contextUrl: string) => {
  const { json } = await fetchUtils.fetchJson(contextUrl, {
    headers: new Headers({ Accept: 'application/ld+json' })
  });

  return getOntologiesFromContextJson(json['@context']);
};

const getOntologiesFromContext = async (context: string | string[] | Record<string, string>) => {
  let ontologies: Record<string, string> = {};

  if (Array.isArray(context)) {
    for (const contextUrl of context) {
      ontologies = { ...ontologies, ...(await getOntologiesFromContextUrl(contextUrl)) };
    }
  } else if (typeof context === 'string') {
    ontologies = await getOntologiesFromContextUrl(context);
  } else {
    ontologies = getOntologiesFromContextJson(context);
  }

  return ontologies;
};

export default getOntologiesFromContext;

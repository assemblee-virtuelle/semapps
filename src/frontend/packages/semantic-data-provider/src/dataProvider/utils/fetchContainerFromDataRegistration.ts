import jsonld from 'jsonld';
import { fetchUtils } from 'react-admin';
import { Container, FetchJsonFn } from '../types';

const fetchContainerFromDataRegistration = async (
  dataRegistrationUri: string,
  httpClient: FetchJsonFn
): Promise<Omit<Container, 'path'>> => {
  const { json: dataRegistration } = await httpClient(dataRegistrationUri, {
    headers: new Headers({
      Accept: 'application/ld+json',
      Prefer: 'return=representation; include="http://www.w3.org/ns/ldp#PreferMinimalContainer"'
    })
  });

  const shapeTreeUri = dataRegistration['interop:registeredShapeTree'];

  let { json: shapeTree } = await fetchUtils.fetchJson(shapeTreeUri, {
    headers: new Headers({ Accept: 'application/ld+json' })
  });

  shapeTree = await jsonld.compact(shapeTree, {
    st: 'http://www.w3.org/ns/shapetrees#',
    skos: 'http://www.w3.org/2004/02/skos/core#',
    expectsType: { '@id': 'st:expectsType', '@type': '@id' },
    shape: { '@id': 'st:shape', '@type': '@id' },
    describesInstance: { '@id': 'st:describesInstance', '@type': '@id' },
    label: { '@id': 'skos:prefLabel', '@container': '@language' }
  });

  const container: Omit<Container, 'path'> = {
    uri: dataRegistration.id,
    shapeTreeUri,
    label: shapeTree.label,
    labelPredicate: shapeTree.describesInstance,
    binaryResources: shapeTree.expectsType === 'st:NonRDFResource'
  };

  if (shapeTree.shape) {
    const { json: shape } = await fetchUtils.fetchJson(shapeTree.shape, {
      headers: new Headers({ Accept: 'application/ld+json' })
    });

    container.types = shape?.[0]?.['http://www.w3.org/ns/shacl#targetClass']?.map((node: any) => node?.['@id']);
  }

  return container;
};

export default fetchContainerFromDataRegistration;

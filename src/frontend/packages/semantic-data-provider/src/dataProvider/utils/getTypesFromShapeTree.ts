import jsonld from 'jsonld';
import { fetchUtils } from 'react-admin';

const getTypesFromShapeTree = async (shapeTreeUri: string) => {
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

  if (shapeTree.shape) {
    const { json: shape } = await fetchUtils.fetchJson(shapeTree.shape, {
      headers: new Headers({ Accept: 'application/ld+json' })
    });

    return shape?.[0]?.['http://www.w3.org/ns/shacl#targetClass']?.map((node: any) => node?.['@id']) || [];
  } else {
    return [];
  }
};

export default getTypesFromShapeTree;

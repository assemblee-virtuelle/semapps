import jsonld from 'jsonld';
import ShexParser from '@shexjs/parser';
import { Configuration, Container } from '../types';

const shexParser = ShexParser.construct('');

const getContainerFromDataRegistration = async (dataRegistrationUri: string, config: Configuration) => {
  const { json: dataRegistration } = await config.httpClient(dataRegistrationUri, {
    headers: new Headers({
      Accept: 'application/ld+json',
      Prefer: 'return=representation; include="http://www.w3.org/ns/ldp#PreferMinimalContainer"'
    })
  });

  const shapeTreeUri = dataRegistration['interop:registeredShapeTree'];

  let { json: shapeTree } = await config.httpClient(shapeTreeUri);

  shapeTree = await jsonld.compact(shapeTree, {
    st: 'http://www.w3.org/ns/shapetrees#',
    skos: 'http://www.w3.org/2004/02/skos/core#',
    expectsType: { '@id': 'st:expectsType', '@type': '@id' },
    shape: { '@id': 'st:shape', '@type': '@id' },
    describesInstance: { '@id': 'st:describesInstance', '@type': '@id' },
    label: { '@id': 'skos:prefLabel', '@container': '@language' }
  });

  const { baseUrl } = config.dataServers.user;
  const containerPath = dataRegistration.id.replace(baseUrl, '');

  const container = {
    path: containerPath,
    label: shapeTree.label,
    labelPredicate: shapeTree.describesInstance
  } as Container;

  if (shapeTree.shape) {
    const { body: shexC } = await config.httpClient(shapeTree.shape, { headers: new Headers({ Accept: '*/*' }) }); // TODO use text/shex

    const shexJ = shexParser.parse(shexC);

    const type = shexJ?.shapes?.[0]?.shapeExpr?.expression?.expressions.find(
      expr => expr.predicate === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
    )?.valueExpr?.values?.[0];

    container.types = [type];
  }

  return container;
};

export default getContainerFromDataRegistration;

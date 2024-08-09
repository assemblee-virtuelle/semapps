import { RaRecord } from 'react-admin';
import { Generator as SparqlGenerator, Update } from 'sparqljs';
import { Configuration, PatchParams } from '../types';

const generator = new SparqlGenerator();

const patchMethod = (config: Configuration) => async (resourceId: string, params: PatchParams<RaRecord>) => {
  const { httpClient } = config;

  const sparqlUpdate = {
    type: 'update',
    prefixes: {},
    updates: []
  } as Update;

  if (params.triplesToAdd) {
    sparqlUpdate.updates.push({
      updateType: 'insert',
      insert: [{ type: 'bgp', triples: params.triplesToAdd }]
    });
  }

  if (params.triplesToRemove) {
    sparqlUpdate.updates.push({
      updateType: 'delete',
      delete: [{ type: 'bgp', triples: params.triplesToRemove }]
    });
  }

  await httpClient(`${params.id}`, {
    method: 'PATCH',
    headers: new Headers({
      'Content-Type': 'application/sparql-update'
    }),
    body: generator.stringify(sparqlUpdate)
  });
};

export default patchMethod;

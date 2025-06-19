import { parseHeader, negotiateAccept, parseSparql, saveDatasetMeta } from '@semapps/middlewares';

const middlewares = [parseHeader, parseSparql, negotiateAccept, saveDatasetMeta];

function getRoute(path: any) {
  return {
    path,
    name: 'sparql-endpoint' as const,
    authorization: false,
    authentication: true,
    mergeParams: true,
    aliases: {
      'GET /': [...middlewares, 'sparqlEndpoint.query'],
      'POST /': [...middlewares, 'sparqlEndpoint.query']
    },
    // Disable the body parsers so that we can parse the body ourselves
    // (Moleculer-web doesn't handle non-JSON bodies, so we must do it)
    bodyParsers: {
      json: false,
      urlencoded: false
    },
    onError(req: any, res: any, err: any) {
      const { type, code, message, data, name } = err;
      res.writeHead(Number(code) || 500, data && data.status ? data.status : 'Server error', {
        'Content-Type': 'application/json'
      });
      res.end(JSON.stringify({ type, code, message, data, name }));
    }
  };
}

export default getRoute;

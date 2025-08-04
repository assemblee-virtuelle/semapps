const urlJoin = require('url-join');
const { MIME_TYPES } = require('@semapps/mime-types');
const { void: voidOntology } = require('@semapps/ontologies');
const { JsonLdSerializer } = require('jsonld-streaming-serializer');
const { DataFactory, Writer } = require('n3');

const { quad, namedNode, literal, blankNode } = DataFactory;
const { MoleculerError } = require('moleculer').Errors;
const { createFragmentURL, regexProtocolAndHostAndPort, arrayOf } = require('@semapps/ldp');
const { parseHeader } = require('@semapps/middlewares');

const prefixes = {
  dc: 'http://purl.org/dc/terms/',
  void: 'http://rdfs.org/ns/void#',
  semapps: 'http://semapps.org/ns/core#',
  xsd: 'http://www.w3.org/2001/XMLSchema#'
};

function streamToString(stream) {
  let res = '';
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => (res += chunk));
    stream.on('error', err => reject(err));
    stream.on('end', () => resolve(res));
  });
}

const jsonContext = {
  ...prefixes,
  'dc:license': {
    '@type': '@id'
  },
  'void:feature': {
    '@type': '@id'
  },
  'void:sparqlEndpoint': {
    '@type': '@id'
  },
  'void:rootResource': {
    '@type': '@id'
  },
  'void:vocabulary': {
    '@type': '@id'
  },
  'void:entities': { '@type': 'xsd:integer' },
  'void:doNotMirror': { '@type': 'xsd:boolean' },
  'void:class': { '@type': '@id' },
  'void:classPartition': { '@type': '@id' }
};

const addClassPartition = (serverUrl, partition, graph, scalar) => {
  const blank = blankNode(`b${scalar}`);
  blank.data = [
    {
      s: blankNode(`b${scalar}`),
      p: namedNode('http://rdfs.org/ns/void#uriSpace'),
      o: literal(partition['http://rdfs.org/ns/void#uriSpace'])
    },
    ...partition['http://rdfs.org/ns/void#class'].map(t => {
      return { s: blankNode(`b${scalar}`), p: namedNode('http://rdfs.org/ns/void#class'), o: namedNode(t) };
    }),
    {
      s: blankNode(`b${scalar}`),
      p: namedNode('http://rdfs.org/ns/void#entities'),
      o: literal(
        partition['http://rdfs.org/ns/void#entities'].toString(),
        namedNode('http://www.w3.org/2001/XMLSchema#integer')
      )
    }
  ];
  if (partition['http://semapps.org/ns/core#doNotMirror'])
    blank.data.push({
      s: blankNode(`b${scalar}`),
      p: namedNode('http://semapps.org/ns/core#doNotMirror'),
      o: literal(true, namedNode('http://www.w3.org/2001/XMLSchema#boolean'))
    });

  graph.push({ s: namedNode(serverUrl), p: namedNode('http://rdfs.org/ns/void#classPartition'), o: blank });
};

const addMirrorServer = async (
  baseUrl,
  serverUrl,
  graph,
  hasSparql,
  containers,
  mirrorGraph,
  ctx,
  nextScalar,
  originalVoid
) => {
  const thisServer = createFragmentURL(baseUrl, serverUrl);

  graph.push({
    s: namedNode(thisServer),
    p: namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
    o: namedNode('http://rdfs.org/ns/void#Dataset')
  });
  // graph.push({
  //   s: namedNode(thisServer),
  //   p: namedNode('http://purl.org/dc/terms/modified'),
  //   o: literal('2020-11-17', namedNode('http://www.w3.org/2001/XMLSchema#date'))
  // });
  graph.push({
    s: namedNode(thisServer),
    p: namedNode('http://rdfs.org/ns/void#feature'),
    o: namedNode('http://www.w3.org/ns/formats/N-Triples')
  });
  graph.push({ s: namedNode(thisServer), p: namedNode('http://rdfs.org/ns/void#uriSpace'), o: literal(serverUrl) });

  if (hasSparql)
    graph.push({
      s: namedNode(thisServer),
      p: namedNode('http://rdfs.org/ns/void#sparqlEndpoint'),
      o: namedNode(hasSparql)
    });

  const partitionsMap = {};
  if (originalVoid) {
    const originalPartitions = originalVoid['void:classPartition'];

    if (originalPartitions) {
      for (const p of arrayOf(originalPartitions)) {
        // we skip empty containers and doNotMirror containers
        if (p['void:entities'] === '0' || p['semapps:doNotMirror']) continue;
        partitionsMap[p['void:uriSpace']] = p;
      }
    }
  }

  for (const [i, p] of containers.entries()) {
    const types = await ctx.call('triplestore.query', {
      query: `SELECT DISTINCT ?t FROM <${mirrorGraph}> { <${p}> <http://www.w3.org/ns/ldp#contains> ?o. ?o <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?t }`
    });

    const partition = {
      'http://rdfs.org/ns/void#uriSpace': p,
      'http://rdfs.org/ns/void#class': types.map(type => type.t.value)
    };

    const count = await ctx.call('triplestore.query', {
      query: `SELECT (COUNT (?o) as ?count) FROM <${mirrorGraph}> { <${p}> <http://www.w3.org/ns/ldp#contains> ?o }`
    });

    partition['http://rdfs.org/ns/void#entities'] = Number(count[0].count.value);

    addClassPartition(thisServer, partition, graph, nextScalar + i);
  }
};

module.exports = {
  name: 'void',
  settings: {
    baseUrl: null,
    mirrorGraphName: 'http://semapps.org/mirror',
    title: null,
    description: null,
    license: null
  },
  dependencies: ['ldp.registry', 'api', 'triplestore', 'ontologies', 'jsonld'],
  async started() {
    await this.broker.call('ontologies.register', voidOntology);
    await this.broker.call('api.addRoute', {
      route: {
        path: '/.well-known/void', // .well-known routes must use the root path
        name: 'void-endpoint',
        bodyParsers: false,
        authorization: false,
        authentication: true,
        aliases: {
          'GET /': [parseHeader, 'void.api_get']
        }
      }
    });
  },
  actions: {
    getRemote: {
      visibility: 'public',
      params: {
        serverUrl: { type: 'string', optional: false }
      },
      async handler(ctx) {
        try {
          const voidUrl = urlJoin(ctx.params.serverUrl, '/.well-known/void');
          const response = await fetch(voidUrl, {
            method: 'GET',
            headers: {
              Accept: 'application/ld+json'
            }
          });
          if (response.ok) {
            const json = await response.json();
            return json;
          }
        } catch (e) {
          this.logger.warn(`Silently ignored error when fetching void endpoint: ${e.message}`);
        }
      }
    },
    get: {
      visibility: 'public',
      params: {
        accept: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const accept = ctx.params.accept || MIME_TYPES.TURTLE;

        const ontologies = await ctx.call('ontologies.list');
        const partitions = await this.getContainers(ctx);

        const { origin } = new URL(this.settings.baseUrl);
        const url = urlJoin(origin, '.well-known/void');

        // first we compile the local data void information (local containers)

        const thisServer = createFragmentURL(url, this.settings.baseUrl);

        const graph = [];
        graph.push({
          s: namedNode(thisServer),
          p: namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
          o: namedNode('http://rdfs.org/ns/void#Dataset')
        });
        if (this.settings.title) {
          graph.push({
            s: namedNode(thisServer),
            p: namedNode('http://purl.org/dc/terms/title'),
            o: literal(this.settings.title)
          });
        }
        if (this.settings.description) {
          graph.push({
            s: namedNode(thisServer),
            p: namedNode('http://purl.org/dc/terms/description'),
            o: literal(this.settings.description)
          });
        }
        if (this.settings.license) {
          graph.push({
            s: namedNode(thisServer),
            p: namedNode('http://purl.org/dc/terms/license'),
            o: namedNode(this.settings.license)
          });
        }
        // graph.push({
        //   s: namedNode(thisServer),
        //   p: namedNode('http://purl.org/dc/terms/modified'),
        //   o: literal('2020-11-17', namedNode('http://www.w3.org/2001/XMLSchema#date'))
        // });
        graph.push({
          s: namedNode(thisServer),
          p: namedNode('http://rdfs.org/ns/void#feature'),
          o: namedNode('http://www.w3.org/ns/formats/N-Triples')
        });
        graph.push({
          s: namedNode(thisServer),
          p: namedNode('http://rdfs.org/ns/void#uriSpace'),
          o: literal(this.settings.baseUrl)
        });

        const services = await ctx.call('$node.services');
        const hasSparql =
          services.filter(s => s.name === 'sparqlEndpoint').length > 0
            ? urlJoin(this.settings.baseUrl, 'sparql')
            : undefined;
        if (hasSparql)
          graph.push({
            s: namedNode(thisServer),
            p: namedNode('http://rdfs.org/ns/void#sparqlEndpoint'),
            o: namedNode(hasSparql)
          });

        graph.push({
          s: namedNode(thisServer),
          p: namedNode('http://rdfs.org/ns/void#rootResource'),
          o: namedNode(this.settings.baseUrl)
        });
        for (const ontology of ontologies) {
          graph.push({
            s: namedNode(thisServer),
            p: namedNode('http://rdfs.org/ns/void#vocabulary'),
            o: namedNode(ontology.namespace)
          });
        }

        for (const [i, p] of partitions.entries()) {
          addClassPartition(thisServer, p, graph, i);
        }
        let scalar = partitions.length;

        // then we move on to the mirrored data (containers that have been mirrored from remote servers)

        const serversContainers = await ctx.call('triplestore.query', {
          query: `SELECT DISTINCT ?s FROM <${this.settings.mirrorGraphName}> { ?s <http://www.w3.org/ns/ldp#contains> ?o }`
        });

        const serversMap = {};
        for (const s of serversContainers.map(sc => sc.s.value)) {
          const res = s.match(regexProtocolAndHostAndPort);
          if (res) {
            const name = urlJoin(res[0], '/');
            let serverName = serversMap[name];
            if (!serverName) {
              serversMap[name] = [];
              serverName = serversMap[name];
            }
            serverName.push(s);
          }
        }

        for (const serverUrl of Object.keys(serversMap)) {
          let originalVoid;
          const json = await ctx.call('void.getRemote', { serverUrl });
          if (json) {
            const mapServers = {};
            for (const s of json['@graph']) {
              mapServers[s['@id']] = s;
            }
            const server = mapServers[createFragmentURL('', serverUrl)];
            originalVoid = server;
          }

          await addMirrorServer(
            url,
            serverUrl,
            graph,
            hasSparql,
            serversMap[serverUrl],
            this.settings.mirrorGraphName,
            ctx,
            scalar,
            originalVoid
          );
          scalar += serversMap[serverUrl].length;
        }

        ctx.meta.$responseType = accept;

        // TODO use Etag instead to keep track of changes in VOID
        // ctx.meta.$responseHeaders = {
        //   'Cache-Control': 'private, max-age=86400',
        //   Vary: 'authorization'
        // };

        return await this.formatOutput(ctx, graph, url, accept === MIME_TYPES.JSON);
      }
    },
    api_get: async function api(ctx) {
      let { accept } = ctx.meta.headers;
      if (accept.includes('*/*')) accept = MIME_TYPES.JSON;
      else if (accept && accept !== MIME_TYPES.JSON && accept !== MIME_TYPES.TURTLE)
        throw new MoleculerError(`Accept not supported : ${accept}`, 400, 'ACCEPT_NOT_SUPPORTED');

      return await ctx.call('void.get', {
        accept: accept
      });
    }
  },
  methods: {
    async getContainers(ctx) {
      const { baseUrl } = this.settings;
      const registeredContainers = await ctx.call('ldp.registry.list');

      const res = await Promise.all(
        Object.values(registeredContainers)
          .filter(c => c.acceptedTypes)
          .map(async c => {
            const partition = {
              'http://rdfs.org/ns/void#uriSpace': urlJoin(baseUrl, c.path),
              'http://rdfs.org/ns/void#class': arrayOf(c.acceptedTypes)
            };
            if (c.excludeFromMirror) partition['http://semapps.org/ns/core#doNotMirror'] = true;
            const count = await ctx.call('triplestore.query', {
              query: `SELECT (COUNT (?o) as ?count) { <${partition['http://rdfs.org/ns/void#uriSpace']}> <http://www.w3.org/ns/ldp#contains> ?o }`
            });
            partition['http://rdfs.org/ns/void#entities'] = Number(count[0].count.value);
            return partition;
          })
      );
      return res;
    },
    async formatOutput(ctx, output, voidUrl, jsonLD) {
      const prefix = await ctx.call('ontologies.getPrefixes');
      if (!jsonLD) {
        const turtle = await new Promise(resolve => {
          const writer = new Writer({
            prefixes: { ...prefixes, ...prefix, '': `${voidUrl}#` },
            format: 'Turtle'
          });
          output.forEach(f => {
            if (f.o.termType === 'BlankNode') {
              const predicates = f.o.data.map(p => {
                let obj = p.o;
                if (Array.isArray(obj)) obj = writer.list(obj);
                return {
                  predicate: p.p,
                  object: obj
                };
              });
              writer.addQuad(f.s, f.p, writer.blank(predicates));
            } else writer.addQuad(f.s, f.p, f.o);
          });
          writer.end((error, res) => {
            resolve(res);
          });
        });

        return turtle;
      }
      const jsonldContext = { ...jsonContext, ...prefix };

      // TODO put this in jsonld service
      const mySerializer = new JsonLdSerializer({
        context: jsonldContext,
        baseIRI: voidUrl
      });

      for (const f of output) {
        if (f.o.termType === 'BlankNode') {
          mySerializer.write(quad(f.s, f.p, f.o));
          for (const d of f.o.data) {
            const obj = d.o;
            if (Array.isArray(obj)) {
              // obj = await mySerializer.list(obj)
              for (const oo of obj) {
                mySerializer.write(quad(d.s, d.p, oo));
              }
            } else mySerializer.write(quad(d.s, d.p, obj));
          }
        } else mySerializer.write(quad(f.s, f.p, f.o));
      }
      mySerializer.end();

      const jsonLd = JSON.parse(await streamToString(mySerializer));

      const compactJsonLd = await ctx.call('jsonld.parser.frame', {
        input: jsonLd,
        frame: {
          '@context': jsonldContext,
          '@type': 'void:Dataset'
        },
        // Force results to be in a @graph, even if we have a single result
        options: { omitGraph: false }
      });

      // Add the @base context. We did not use it in the frame operation, as we don't want URIs to become relative
      compactJsonLd['@context'] = { ...compactJsonLd['@context'], '@base': voidUrl };

      return compactJsonLd;
    }
  }
};

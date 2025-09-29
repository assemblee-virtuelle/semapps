import urlJoin from 'url-join';
import { MIME_TYPES } from '@semapps/mime-types';
import { void as voidOntology } from '@semapps/ontologies';
import { JsonLdSerializer } from 'jsonld-streaming-serializer';
import { DataFactory, Writer } from 'n3';
import { createFragmentURL, arrayOf } from '@semapps/ldp';
import { parseHeader } from '@semapps/middlewares';
import { ServiceSchema, Errors } from 'moleculer';

const { quad, namedNode, literal, blankNode } = DataFactory;

const { MoleculerError } = Errors;

const prefixes = {
  dc: 'http://purl.org/dc/terms/',
  void: 'http://rdfs.org/ns/void#',
  semapps: 'http://semapps.org/ns/core#',
  xsd: 'http://www.w3.org/2001/XMLSchema#'
};

function streamToString(stream: any) {
  let res = '';
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: any) => (res += chunk));
    stream.on('error', (err: any) => reject(err));
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

const addClassPartition = (serverUrl: any, partition: any, graph: any, scalar: any) => {
  const blank = blankNode(`b${scalar}`);
  // @ts-expect-error TS(2339): Property 'data' does not exist on type 'BlankNode'... Remove this comment to see the full error message
  blank.data = [
    {
      s: blankNode(`b${scalar}`),
      p: namedNode('http://rdfs.org/ns/void#uriSpace'),
      o: literal(partition['http://rdfs.org/ns/void#uriSpace'])
    },
    ...partition['http://rdfs.org/ns/void#class'].map((t: any) => {
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
    // @ts-expect-error TS(2339): Property 'data' does not exist on type 'BlankNode'... Remove this comment to see the full error message
    blank.data.push({
      s: blankNode(`b${scalar}`),
      p: namedNode('http://semapps.org/ns/core#doNotMirror'),
      // @ts-expect-error TS(2345): Argument of type 'boolean' is not assignable to pa... Remove this comment to see the full error message
      o: literal(true, namedNode('http://www.w3.org/2001/XMLSchema#boolean'))
    });

  graph.push({ s: namedNode(serverUrl), p: namedNode('http://rdfs.org/ns/void#classPartition'), o: blank });
};

const VoidSchema = {
  name: 'void' as const,
  settings: {
    baseUrl: null,
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
          // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
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
          services.filter((s: any) => s.name === 'sparqlEndpoint').length > 0
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

        ctx.meta.$responseType = accept;

        // TODO use Etag instead to keep track of changes in VOID
        // ctx.meta.$responseHeaders = {
        //   'Cache-Control': 'private, max-age=86400',
        //   Vary: 'authorization'
        // };

        return await this.formatOutput(ctx, graph, url, accept === MIME_TYPES.JSON);
      }
    },

    api_get: {
      handler: async function api(ctx) {
        // @ts-expect-error TS(2339): Property 'headers' does not exist on type '{}'.
        let { accept } = ctx.meta.headers;
        if (accept.includes('*/*')) accept = MIME_TYPES.JSON;
        else if (accept && accept !== MIME_TYPES.JSON && accept !== MIME_TYPES.TURTLE)
          throw new MoleculerError(`Accept not supported : ${accept}`, 400, 'ACCEPT_NOT_SUPPORTED');

        return await ctx.call('void.get', {
          accept: accept
        });
      }
    }
  },
  methods: {
    async getContainers(ctx) {
      const { baseUrl } = this.settings;
      const registeredContainers = await ctx.call('ldp.registry.list');

      const res = await Promise.all(
        Object.values(registeredContainers)
          // @ts-expect-error TS(18046): 'c' is of type 'unknown'.
          .filter(c => c.acceptedTypes)
          .map(async c => {
            const partition = {
              // @ts-expect-error TS(18046): 'c' is of type 'unknown'.
              'http://rdfs.org/ns/void#uriSpace': urlJoin(baseUrl, c.path),
              // @ts-expect-error TS(18046): 'c' is of type 'unknown'.
              'http://rdfs.org/ns/void#class': arrayOf(c.acceptedTypes)
            };
            // @ts-expect-error TS(18046): 'c' is of type 'unknown'.
            if (c.excludeFromMirror) partition['http://semapps.org/ns/core#doNotMirror'] = true;
            const count = await ctx.call('triplestore.query', {
              query: `SELECT (COUNT (?o) as ?count) { <${partition['http://rdfs.org/ns/void#uriSpace']}> <http://www.w3.org/ns/ldp#contains> ?o }`,
              webId: 'system'
            });
            // @ts-expect-error TS(2551): Property 'http://rdfs.org/ns/void#entities' does n... Remove this comment to see the full error message
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
          output.forEach((f: any) => {
            if (f.o.termType === 'BlankNode') {
              const predicates = f.o.data.map((p: any) => {
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

      // @ts-expect-error TS(2345): Argument of type 'unknown' is not assignable to pa... Remove this comment to see the full error message
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
} satisfies ServiceSchema;

export default VoidSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [VoidSchema.name]: typeof VoidSchema;
    }
  }
}

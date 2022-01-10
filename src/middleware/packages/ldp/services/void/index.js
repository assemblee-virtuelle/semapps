const urlJoin = require('url-join');
const { MIME_TYPES } = require('@semapps/mime-types');
const JsonLdSerializer = require('jsonld-streaming-serializer').JsonLdSerializer;
const { DataFactory, Writer } = require('n3');
const { quad, namedNode, literal, blankNode } = DataFactory;
const { MoleculerError } = require('moleculer').Errors;
const {
    getPrefixJSON,
  } = require('../../utils');
const {
    parseHeader,
  } = require('@semapps/middlewares');

const prefixes = {
    dcterms: 'http://purl.org/dc/terms/',
    void: 'http://rdfs.org/ns/void#',
    semapps: 'http://semapps.org/ns/core#'
  };

function streamToString(stream) {
    let res = '';
    return new Promise((resolve, reject) => {
      stream.on('data', chunk => (res += chunk));
      stream.on('error', err => reject(err));
      stream.on('end', () => resolve(res));
    });
}

const regex = new RegExp('^http(s)?:\\/\\/([\\w-\\.:]*)');

function createFragmentURL(baseUrl, serverUrl){
    let fragment = 'me'
    const res = serverUrl.match(regex)
    if (res) fragment = res[2].replace('-','_').replace('.','_').replace(':','_')

    return urlJoin(baseUrl,'#'+fragment)
}

const regexServer = new RegExp('^http(s)?:\\/\\/([\\w-\\.:]*)\\/');

const jsonContext = {
    ...prefixes,
    'dcterms:license': {
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
    'semapps:blankNodes': {
        '@type': '@id'
    },

};

const addClassPartition = (serverUrl, partition, graph, scalar) => {

    let blank = blankNode('b'+scalar)
    blank.data = [
        { s: blankNode('b'+scalar), p: namedNode('http://rdfs.org/ns/void#uriSpace'), o: literal(partition['http://rdfs.org/ns/void#uriSpace']) },
        { s: blankNode('b'+scalar), p: namedNode('http://rdfs.org/ns/void#class'), o: namedNode(partition['http://rdfs.org/ns/void#class'])  },
        { s: blankNode('b'+scalar), p: namedNode('http://rdfs.org/ns/void#entities'), o: literal(partition['http://rdfs.org/ns/void#entities'].toString(),namedNode('http://www.w3.org/2001/XMLSchema#integer') ) },
    ]
    if (partition['http://semapps.org/ns/core#blankNodes'])
        blank.data.push({ s: blankNode('b'+scalar), p: namedNode('http://semapps.org/ns/core#blankNodes'), o: partition['http://semapps.org/ns/core#blankNodes'].map(bn => namedNode(bn)) })

    graph.push({ s: namedNode(serverUrl), p: namedNode('http://rdfs.org/ns/void#classPartition'), o: blank })

}

const addMirrorServer = async (baseUrl, serverUrl, graph, hasSparql, containers) => {

    let thisServer = createFragmentURL(baseUrl, serverUrl)

    graph.push({ s: namedNode(thisServer), p: namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), o: namedNode('http://rdfs.org/ns/void#Dataset') })
    graph.push({ s: namedNode(thisServer), p: namedNode('http://purl.org/dc/terms/modified'), o: literal('2020-11-17',namedNode('http://www.w3.org/2001/XMLSchema#date')) })
    graph.push({ s: namedNode(thisServer), p: namedNode('http://rdfs.org/ns/void#feature'), o: namedNode('http://www.w3.org/ns/formats/N-Triples') })
    graph.push({ s: namedNode(thisServer), p: namedNode('http://rdfs.org/ns/void#uriSpace'), o: literal(serverUrl) })

    if (hasSparql)
        graph.push({ s: namedNode(thisServer), p: namedNode('http://rdfs.org/ns/void#sparqlEndpoint'), o: namedNode(hasSparql) })

    for (const [i, p] of containers.entries()) {

        let partition = {
            'http://rdfs.org/ns/void#uriSpace': p,
            'http://rdfs.org/ns/void#class': undefined,
        }

        //if (dereference) partition['http://semapps.org/ns/core#blankNodes'] = dereference
        
        const count = await ctx.call('triplestore.query', {
            query: `SELECT (COUNT (?o) as ?count) FROM <http://semapps.org/mirror> { <${p}> <http://www.w3.org/ns/ldp#contains> ?o }`
        })
        partition['http://rdfs.org/ns/void#entities'] = Number(count[0].count.value);

        addClassPartition(thisServer, partition, graph, i)
    }

}

module.exports = {
  name: 'ldp.void',
  settings: {
    baseUrl: null,
    ontologies: [],
    servers: [],
  },
  dependencies: ['ldp.registry', 'api'],
  actions: {
    get: {
      visibility: 'public',
      params: {
        accept: { type: 'string', optional: true },
        webId: { type: 'string', optional: true }
      },
      cache: {
        keys: ['accept', 'webId', '#webId']
      },
      async handler(ctx) {

        let { webId, accept } = ctx.params;
        webId = webId || ctx.meta.webId || 'anon';

        accept = accept || MIME_TYPES.TURTLE;

        const partitions = await this.getContainers(ctx)

        const url = urlJoin(this.settings.baseUrl, '.well-known/void')
        
        let thisServer = createFragmentURL(url,this.settings.baseUrl)

        let graph = [];
        graph.push({ s: namedNode(thisServer), p: namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), o: namedNode('http://rdfs.org/ns/void#Dataset') })
        graph.push({ s: namedNode(thisServer), p: namedNode('http://purl.org/dc/terms/modified'), o: literal('2020-11-17',namedNode('http://www.w3.org/2001/XMLSchema#date')) })
        graph.push({ s: namedNode(thisServer), p: namedNode('http://rdfs.org/ns/void#feature'), o: namedNode('http://www.w3.org/ns/formats/N-Triples') })
        graph.push({ s: namedNode(thisServer), p: namedNode('http://rdfs.org/ns/void#uriSpace'), o: literal(this.settings.baseUrl) })

        const services = await ctx.call("$node.services")
        const hasSparql = services.filter(s => s.name == 'sparqlEndpoint').length > 0 ? urlJoin(this.settings.baseUrl,'sparql') : undefined
        if (hasSparql)
            graph.push({ s: namedNode(thisServer), p: namedNode('http://rdfs.org/ns/void#sparqlEndpoint'), o: namedNode(hasSparql) })

        graph.push({ s: namedNode(thisServer), p: namedNode('http://rdfs.org/ns/void#rootResource'), o: namedNode(this.settings.baseUrl) })        
        for (const onto of this.settings.ontologies) {
            graph.push({ s: namedNode(thisServer), p: namedNode('http://rdfs.org/ns/void#vocabulary'), o: namedNode(onto.url) })
        }

        for (const [i, p] of partitions.entries()) {
            addClassPartition(thisServer, p, graph, i)
        }

        const serversContainers = await ctx.call('triplestore.query', {
            query: `SELECT DISTINCT ?s FROM <http://semapps.org/mirror> { ?s <http://www.w3.org/ns/ldp#contains> ?o }`
        })

        let serversMap = {}
        for (const s of serversContainers.map(sc => sc.s.value)) {
            const res = s.match(regex)
            if (res){
               let name = res[0].slice(0, -1)
               let serverName = serversMap[name]
               if (!serverName) {
                serversMap[name] = []
                serverName = serversMap[name]
               }
               serverName.push(s)
            }
        }

        for (const server of Object.keys(serversMap)) {
            await addMirrorServer( url, server, graph, hasSparql, serversMap[server] )
        }

        ctx.meta.$responseType = accept;

        ctx.meta.$responseHeaders = {
            'Cache-Control': 'private, max-age=86400',
            'Vary': 'authorization'
          };

        return await this.formatOutput(ctx, graph, url, accept === MIME_TYPES.JSON);
      }
    },
    api_get: async function api(ctx) {
        const accept = ctx.meta.headers.accept;
        
        if (accept && accept !== MIME_TYPES.JSON && accept !== MIME_TYPES.TURTLE)
            throw new MoleculerError('Accept not supported : ' + accept, 400, 'ACCEPT_NOT_SUPPORTED');

        return await ctx.call('ldp.void.get',{
            accept: accept
        });
    }
  },
  async started() {

    await this.broker.call('api.addRoute', { 
        route: {
            path: '/.well-known/void',
            bodyParsers: false,
            authorization: false,
            authentication: true,
            aliases : {
                'GET /': [ parseHeader, 'ldp.void.api_get']
            }
        }
    });

    // this.mirroredServers = [];
    // if (this.settings.servers.length > 0) {
    //   for (let server of this.settings.servers) {
    //     await this.actions.mirror(server);
    //   }
    // }
  },
  methods: {
    async getContainers(ctx) {
        const baseUrl = this.settings.baseUrl;
        const registeredContainers = await ctx.call('ldp.registry.list');

        const res = await Promise.all(Object.values(registeredContainers).filter( c => c.acceptedTypes ).map( async c => { 
            let partition =
            {
                'http://rdfs.org/ns/void#uriSpace': urlJoin(baseUrl, c.path),
                'http://rdfs.org/ns/void#class': c.acceptedTypes[0],
            }
            if (c.dereference) partition['http://semapps.org/ns/core#blankNodes'] = c.dereference
            
            const count = await ctx.call('triplestore.query', {
                query: `SELECT (COUNT (?o) as ?count) { <${partition['http://rdfs.org/ns/void#uriSpace']}> <http://www.w3.org/ns/ldp#contains> ?o }`
            })
            partition['http://rdfs.org/ns/void#entities'] = Number(count[0].count.value);
            return partition
        }))
        return res.filter( c => c['http://rdfs.org/ns/void#entities'])
    },
    async formatOutput(ctx, output, voidUrl, jsonLD) {

        const prefix = getPrefixJSON(this.settings.ontologies);
        if (!jsonLD) {
          let turtle = await new Promise((resolve, reject) => {
            
            const writer = new Writer({
                prefixes: { ...prefixes,...prefix, '': voidUrl + '#' },
                format: 'Turtle'
            });
            output.forEach(f => {

                if (f.o.termType === 'BlankNode') {
                    let predicates = f.o.data.map( p => { 
                        let obj = p.o
                        if (Array.isArray(obj)) obj = writer.list(obj)
                        return { 
                            predicate: p.p,
                            object: obj
                    }} )
                    writer.addQuad(f.s, f.p, writer.blank(predicates));
                } else
                    writer.addQuad(f.s, f.p, f.o)
            });
            writer.end((error, res) => {
                resolve(res);
            });
          });
      
          return turtle;
        }
        else {

          const jsonldContext = {...jsonContext,...prefix}

          const mySerializer = new JsonLdSerializer({
            context: jsonldContext,
            baseIRI: voidUrl
          });
      
          for (const f of output){
            if (f.o.termType === 'BlankNode') {
                mySerializer.write(quad(f.s, f.p, f.o))
                for (const d of f.o.data) {
                    let obj = d.o
                    if (Array.isArray(obj)) //obj = await mySerializer.list(obj)
                    {
                        for (const oo of obj) {
                            mySerializer.write(quad(d.s, d.p, oo))
                        }
                    } 
                    else
                        mySerializer.write(quad(d.s, d.p, obj))
                }
            }
            else
                mySerializer.write(quad(f.s, f.p, f.o))
                
          }
          mySerializer.end();
      
          let jsonLd = JSON.parse(await streamToString(mySerializer));


          let compactJsonLd = await ctx.call('jsonld.frame', {
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
  }
};

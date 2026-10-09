import moleculer from 'moleculer';
const { Cachers } = moleculer;

let cacher: any;

const INDEX_PREFIX = 'index:';

/**
 * Return the index of a cache key, made of the action name and the first key param (if it is an URI).
 * For example, the key `ldp.resource.get:https://example.org/alice|application/ld+json` is indexed in
 * `ldp.resource.get:https://example.org/alice`.
 */
const getIndexName = (key: string) => {
  const separatorIndex = key.indexOf(':');
  if (separatorIndex === -1) return undefined;
  const actionName = key.slice(0, separatorIndex);
  const firstParam = key.slice(separatorIndex + 1).split('|')[0];
  if (!firstParam.startsWith('http://') && !firstParam.startsWith('https://')) return undefined;
  return `${INDEX_PREFIX}${actionName}:${firstParam}`;
};

/**
 * Keep track of the keys cached for each action and URI, so that they can be deleted directly by
 * `cleanByUri`. Moleculer's `clean` scans all the keys of the cache, which is very costly on a big cache
 * (with Redis, each pattern means one SCAN round trip per 100 keys).
 */
const addIndex = (cacher: any) => {
  const isRedis = !!cacher.client;
  const memoryIndexes = new Map<string, Set<string>>();

  const originalSet = cacher.set.bind(cacher);
  cacher.set = async (key: string, data: any, ttl?: number) => {
    const result = await originalSet(key, data, ttl);
    const indexName = getIndexName(key);
    if (indexName) {
      if (isRedis) {
        const indexKey = cacher.prefix + indexName;
        const indexTtl = ttl ?? cacher.opts.ttl;
        const pipeline = cacher.client.pipeline().sadd(indexKey, key);
        // The index must live at least as long as the keys it contains
        if (indexTtl) pipeline.expire(indexKey, indexTtl);
        await pipeline.exec();
      } else {
        if (!memoryIndexes.has(indexName)) memoryIndexes.set(indexName, new Set());
        memoryIndexes.get(indexName)!.add(key);
      }
    }
    return result;
  };

  /** Delete the keys cached by an action for a given URI (whatever the other key params) */
  cacher.cleanByUri = async (actionName: string, uri: string) => {
    const indexName = `${INDEX_PREFIX}${actionName}:${uri}`;
    if (isRedis) {
      const indexKey = cacher.prefix + indexName;
      const keys: string[] = await cacher.client.smembers(indexKey);
      await cacher.client.del(indexKey, ...keys.map(key => cacher.prefix + key));
    } else {
      const keys = memoryIndexes.get(indexName);
      if (keys?.size) await cacher.del([...keys]);
      memoryIndexes.delete(indexName);
    }
  };
};

// It has been suggested to put this middleware in Moleculer core code:
// https://github.com/moleculerjs/moleculer/issues/892
const CacherMiddleware = (opts: any) => ({
  name: 'CacherMiddleware',

  created(broker: any) {
    if (opts) {
      // @ts-expect-error TS(2339): Property 'resolve' does not exist on type 'typeof ... Remove this comment to see the full error message
      broker.cacher = Cachers.resolve(opts);
      broker.cacher.init(broker);
      addIndex(broker.cacher);
      cacher = broker.cacher.middleware();
    }
  },

  // TODO see why this is not called by Moleculer
  // async stopped(broker) {
  //   if (opts) {
  //     await broker.cacher.close();
  //   }
  // },
  localAction(next: any, action: any) {
    if (cacher) {
      return cacher.localAction(next, action);
    }
    return next;
  }
});

export default CacherMiddleware;

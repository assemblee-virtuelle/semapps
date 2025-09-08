import { ActionSchema } from 'moleculer';

export const api = async function api(this: any, ctx: any) {
  if (this.settings.podProvider) ctx.meta.dataset = ctx.params.username;
  return await ctx.call('webacl.group.getGroups', {});
};

export const action = {
  visibility: 'public',
  params: {
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    let groups;

    if (webId !== 'system') {
      const agentSelector = webId === 'anon' ? 'acl:agentClass foaf:Agent.' : `acl:agent <${webId}>.`;

      groups = await ctx.call('triplestore.query', {
        query: `
          PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>
          PREFIX acl: <http://www.w3.org/ns/auth/acl#>
          PREFIX foaf: <http://xmlns.com/foaf/0.1/>
          SELECT ?g 
          WHERE 
          { GRAPH <${this.settings.graphName}>
            { ?g a vcard:Group.
            ?auth a acl:Authorization;
              acl:mode acl:Read;
              acl:accessTo ?g;
              ${agentSelector}
            } 
          }
        `,
        webId: 'system'
      });

      /// TODO: implement to find the groups the user has Read access to, via his membership of other groups (agentGroup)
      // and also the groups with acl:AuthenticatedAgent
    } else {
      groups = await ctx.call('triplestore.query', {
        query: `
          PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>
          SELECT ?g 
          WHERE { 
            GRAPH <${this.settings.graphName}>
            { ?g a vcard:Group } 
          }
        `,
        webId: 'system'
      });
    }

    return groups.map((m: any) => m.g.value);
  }
} satisfies ActionSchema;

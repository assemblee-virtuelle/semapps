import { arrayOf } from '@semapps/ldp';
import type { ServiceSchema } from 'moleculer';

// The WebACL rights giving each mode. acl:Write implies acl:Append.
const MODES_RIGHTS: Record<string, string[]> = {
  'acl:Read': ['read'],
  'acl:Append': ['append', 'write'],
  'acl:Write': ['write'],
  'acl:Control': ['control']
};

const WebAclAuthorizerSchema = {
  name: 'webacl.authorizer' as const,
  settings: {
    podProvider: false
  },
  dependencies: ['permissions'],
  async started() {
    await this.broker.call('permissions.addUserAuthorizer', { actionName: `${this.name}.hasPermission` });
  },
  actions: {
    hasPermission: {
      async handler(ctx) {
        const { uri, type, mode, webId } = ctx.params;
        if (type !== 'resource' && type !== 'container') return undefined;

        // The owner of a Pod has all rights on it
        // End with a trailing slash, otherwise "bob" will have access to the pod of "bobby" !
        if (this.settings.podProvider && webId !== 'anon' && (uri === webId || uri.startsWith(`${webId}/`))) {
          return true;
        }

        const rightsToCheck = MODES_RIGHTS[mode];
        const rights: any = await ctx.call('webacl.resource.hasRights', {
          resourceUri: uri,
          rights: Object.fromEntries(rightsToCheck.map(right => [right, true])),
          webId
        });
        if (rightsToCheck.some(right => rights[right])) return true;

        if (ctx.meta.authorization?.capabilityPresentation && (await this.hasValidCapability(ctx, uri, mode))) {
          return true;
        }

        return false;
      }
    }
  },
  methods: {
    // Check if a capability grants access to the resource
    async hasValidCapability(ctx, resourceUri, mode) {
      const { capabilityPresentation } = ctx.meta.authorization;
      const vcs = arrayOf(capabilityPresentation.verifiableCredential);

      // Check if every VC contains a valid `hasAuthorization` property.
      const allHaveAuth = vcs.every((vc: any) => {
        const auth = vc.credentialSubject?.['apods:hasAuthorization'];
        return (
          arrayOf(auth.type).includes('acl:Authorization') &&
          arrayOf(auth['acl:mode']).includes(mode) &&
          arrayOf(auth['acl:accessTo'].id ?? auth['acl:accessTo']).includes(resourceUri)
        );
      });
      if (!allHaveAuth) return false;

      // Check if issuer of first VC actually has control over it.
      const hasRights = await ctx.call('webacl.resource.hasRights', {
        resourceUri,
        webId: vcs[0].issuer,
        rights: { control: true }
      });
      return !!hasRights?.control;
    }
  }
} satisfies ServiceSchema;

export default WebAclAuthorizerSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [WebAclAuthorizerSchema.name]: typeof WebAclAuthorizerSchema;
    }
  }
}

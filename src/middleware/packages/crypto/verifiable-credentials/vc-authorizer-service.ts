import { arrayOf } from '@semapps/ldp';
import { ServiceSchema } from 'moleculer';

// Check, if a capability grants access to the resource.
const hasValidCapability = async (ctx: any, resourceUri: any, mode: any) => {
  const { capabilityPresentation } = ctx.meta.authorization;
  const vcs = arrayOf(capabilityPresentation.verifiableCredential);

  // Check if every VC contains a valid `hasAuthorization` property.
  const allHaveAuth = vcs.every(vc => {
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
  if (!hasRights?.control) return false;

  return true;
};

const VcGuardSchema = {
  name: 'vc.guard' as const,
  dependencies: 'permissions',
  async started() {
    await this.broker.call('permissions.addAuthorizer', { actionName: `${this.name}.hasPermission` });
  },
  actions: {
    hasPermission: {
      async handler(ctx) {
        const { uri, mode } = ctx.params;

        if (ctx.meta.authorization?.capabilityPresentation) {
          if (await hasValidCapability(ctx, uri, mode)) {
            return true;
          }
        }

        return undefined;
      }
    }
  }
} satisfies ServiceSchema;

export default VcGuardSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [VcGuardSchema.name]: typeof VcGuardSchema;
    }
  }
}

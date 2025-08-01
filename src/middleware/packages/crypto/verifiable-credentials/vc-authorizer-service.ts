import { arrayOf } from '@semapps/ldp';

// Check, if a capability grants access to the resource.
const hasValidCapability = async (ctx, resourceUri, mode) => {
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
  name: 'vc.guard',
  dependencies: 'permissions',
  async started() {
    await this.broker.call('permissions.addAuthorizer', { actionName: `${this.name}.hasPermission` });
  },
  actions: {
    async hasPermission(ctx) {
      const { uri, mode } = ctx.params;

      if (ctx.meta.authorization?.capabilityPresentation) {
        if (await hasValidCapability(ctx, uri, mode)) {
          return true;
        }
      }

      return undefined;
    }
  }
};

export default VcGuardSchema;

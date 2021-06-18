import { ACL_APPEND, ACL_CONTROL, ACL_READ, ACL_WRITE } from '../constants';

const frenchMessages = {
  auth: {
    dialog: {
      container_permissions: 'Permissions sur le container',
      resource_permissions: 'Permissions sur la resource'
    },
    action: {
      permissions: 'Permissions'
    },
    right: {
      resource: {
        read: 'Lire',
        append: 'Enrichir',
        write: 'Modifier',
        control: 'Administrer'
      },
      container: {
        read: 'Lister',
        append: 'Ajouter',
        write: 'Ajouter',
        control: 'Administrer'
      }
    },
    agent: {
      anonymous: 'Tous les utilisateurs',
      authenticated: 'Utilisateurs connectés'
    },
    input: {
      agent_select: 'Ajouter un utilisateur...'
    },
    message: {
      resource_edit_forbidden: "Vous n'avez pas la permission d'éditer cette ressource",
      user_not_allowed_to_login: "Vous n'avez pas le droit de vous connecter avec ce compte",
      new_user_created: 'Votre compte a été créé, vous pouvez maintenant le compléter',
      user_connected: 'Vous êtes maintenant connecté',
      user_disconnected: 'Vous êtes maintenant déconnecté'
    }
  }
};

export default frenchMessages;

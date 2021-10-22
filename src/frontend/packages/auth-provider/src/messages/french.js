const frenchMessages = {
  auth: {
    dialog: {
      container_permissions: 'Permissions sur le container',
      resource_permissions: 'Permissions sur la resource'
    },
    action: {
      permissions: 'Permissions',
      signup: "S'inscrire"
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
      agent_select: 'Ajouter un utilisateur...',
      name: 'Prénom',
      username: 'Nom utilisateur',
      email: 'Adresse e-mail'
    },
    message: {
      resource_show_forbidden: "Vous n'avez pas la permission de voir cette ressource",
      resource_edit_forbidden: "Vous n'avez pas la permission d'éditer cette ressource",
      resource_delete_forbidden: "Vous n'avez pas la permission d'effacer cette ressource",
      resource_control_forbidden: "Vous n'avez pas la permission d'administrer cette ressource",
      container_create_forbidden: "Vous n'avez pas la permission de créer des ressources",
      container_list_forbidden: "Vous n'avez pas la permission de voir ces ressources",
      user_not_allowed_to_login: "Vous n'avez pas le droit de vous connecter avec ce compte",
      user_email_not_found: 'Aucun compte trouvé avec cette adresse mail',
      user_email_exist: 'Un compte existe déjà avec cette adresse mail',
      new_user_created: 'Votre compte a été créé avec succès',
      user_connected: 'Vous êtes maintenant connecté',
      user_disconnected: 'Vous êtes maintenant déconnecté',
      bad_request: "Requête erronée (Message d'erreur renvoyé par le serveur: %{error})"
    }
  }
};

export default frenchMessages;

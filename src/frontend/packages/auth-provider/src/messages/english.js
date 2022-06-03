const englishMessages = {
  auth: {
    dialog: {
      container_permissions: 'Container permissions',
      resource_permissions: 'Resource permissions'
    },
    action: {
      permissions: 'Permissions',
      signup: 'Signup',
      logout: 'Logout',
      login: 'Login',
      view_my_profile: 'View my profile',
      edit_my_profile: 'Edit my profile'
    },
    right: {
      resource: {
        read: 'Read',
        append: 'Append',
        write: 'Write',
        control: 'Control'
      },
      container: {
        read: 'List',
        append: 'Add',
        write: 'Add',
        control: 'Control'
      }
    },
    agent: {
      anonymous: 'All users',
      authenticated: 'Connected users'
    },
    input: {
      agent_select: 'Add an user...',
      name: 'Surname',
      username: 'User ID',
      email: 'Email address',
      username_or_email: 'User ID or email address'
    },
    message: {
      resource_show_forbidden: 'You are not allowed to view this resource',
      resource_edit_forbidden: 'You are not allowed to edit this resource',
      resource_delete_forbidden: 'You are not allowed to delete this resource',
      resource_control_forbidden: 'You are not allowed to control this resource',
      container_create_forbidden: 'You are not allowed to create new resource',
      container_list_forbidden: 'You are not allowed to list these resources',
      user_not_allowed_to_login: 'You are not allowed to login with this account',
      user_email_not_found: 'No account found with this email address',
      user_email_exist: 'An account already exist with this email address',
      username_exist: 'An account already exist with this user ID',
      username_invalid: 'This username is invalid. Only lowercase characters, numbers, dots and hyphens are authorized',
      new_user_created: 'Your account has been successfully created',
      user_connected: 'You are now connected',
      user_disconnected: 'You are now disconnected',
      bad_request: 'Bad request (Error message returned by the server: %{error})',
      account_settings_updated: 'Your account settings have been successfully updated'
    }
  }
};

export default englishMessages;

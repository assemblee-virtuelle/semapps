const englishMessages = {
  auth: {
    dialog: {
      container_permissions: 'Container permissions',
      resource_permissions: 'Resource permissions',
      login_required: 'Login required'
    },
    action: {
      submit: 'Submit',
      permissions: 'Permissions',
      signup: 'Signup',
      reset_password: 'Reset password',
      set_new_password: 'Set new password',
      logout: 'Logout',
      login: 'Login',
      view_my_profile: 'View my profile',
      edit_my_profile: 'Edit my profile',
      show_password: 'Show password',
      hide_password: 'Hide password'
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
      username_or_email: 'User ID or email address',
      current_password: 'Current password',
      new_password: 'New password',
      confirm_new_password: 'Confirm new password',
      password_strength: 'Password strength',
      password_suggestions: 'Suggestions to improve your password',
      password_suggestion: {
        add_lowercase_letters_a_z: 'Add lowercase letters (a-z)',
        add_uppercase_letters_a_z: 'Add uppercase letters (A-Z)',
        add_numbers_0_9: 'Add numbers (0-9)',
        add_special_characters: 'Add special characters (!@#$...)',
        make_it_at_least_8_characters_long: 'Make it at least 8 characters long',
        make_it_at_least_14_characters_long_for_maximum_strength:
          'Make it at least 14 characters long for maximum strength'
      },
      password_too_weak: 'Password too weak. Increase length or add special characters.',
      password_mismatch: 'The passwords you provided do not match.',
      required_field: 'Required field',
      required_field_description: 'This field is required',
      password_description: 'Characters you type will be visually hidden for security reasons'
    },
    helper: {
      login: 'Sign in to your account',
      signup: 'Create your account',
      reset_password: 'Enter your email address below and we will send you a link to reset your password',
      set_new_password: 'Please enter your email address and a new password below'
    },
    message: {
      resource_show_forbidden: 'You are not allowed to view this resource',
      resource_edit_forbidden: 'You are not allowed to edit this resource',
      resource_delete_forbidden: 'You are not allowed to delete this resource',
      resource_control_forbidden: 'You are not allowed to control this resource',
      container_create_forbidden: 'You are not allowed to create new resource',
      container_list_forbidden: 'You are not allowed to list these resources',
      unable_to_fetch_user_data: 'Unable to fetch user data',
      no_token_returned: 'No token returned',
      no_associated_oidc_issuer: 'No OIDC issuer associated with the provided WebID',
      invalid_token_returned: 'Invalid token returned',
      signup_error: 'Account registration failed',
      user_not_allowed_to_login: 'You are not allowed to login with this account',
      user_email_not_found: 'No account found with this email address',
      user_email_exist: 'An account already exist with this email address',
      user_email_invalid: 'The provided email address is not valid',
      username_exist: 'An account already exist with this user ID',
      username_invalid: 'This username is invalid. Only lowercase characters, numbers, dots and hyphens are authorized',
      username_too_short: 'The provided username is too short',
      password_too_short: 'The provided password is too short',
      new_user_created: 'Your account has been successfully created',
      user_connected: 'You are now connected',
      user_disconnected: 'You are now disconnected',
      bad_request: 'Bad request (Error message returned by the server: %{error})',
      account_settings_updated: 'Your account settings have been successfully updated',
      login_to_continue: 'Please login to continue',
      choose_pod_provider:
        'Please choose a Pod provider in the list below. All application data will be saved on your Pod.',
      unreachable_auth_server: 'The authentication server cannot be reached'
    },
    notification: {
      reset_password_submitted: 'An email has been sent with reset password instructions',
      reset_password_error: 'An error occurred',
      password_changed: 'Password changed successfully',
      new_password_error: 'An error occurred',
      invalid_password: 'Invalid password',
      get_settings_error: 'An error occurred',
      update_settings_error: 'An error occurred'
    },
    required: {
      email: 'Please enter your email address',
      password: 'Please enter your password',
      identifier: 'Please enter a unique identifier',
      newPassword: 'Please enter a new password',
      newPasswordAgain: 'Please enter the new password again'
    }
  }
};

export default englishMessages;

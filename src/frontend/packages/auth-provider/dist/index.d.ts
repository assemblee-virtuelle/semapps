import React from 'react';
import { ToolbarProps } from 'react-admin';
export function authProvider({
  dataProvider,
  authType,
  allowAnonymous,
  checkUser,
  checkPermissions,
  clientId
}: {
  dataProvider: any;
  authType: any;
  allowAnonymous?: boolean | undefined;
  checkUser: any;
  checkPermissions?: boolean | undefined;
  clientId: any;
}): {
  login: (params: any) => Promise<void>;
  handleCallback: () => Promise<void>;
  signup: (params: any) => Promise<any>;
  logout: (params: any) => Promise<any>;
  checkAuth: () => Promise<void>;
  checkUser: (userData: any) => any;
  checkError: (error: any) => Promise<void>;
  getPermissions: (uri: any) => Promise<any>;
  addPermission: (uri: any, agentId: any, predicate: any, mode: any) => Promise<void>;
  removePermission: (uri: any, agentId: any, predicate: any, mode: any) => Promise<void>;
  getIdentity: () => Promise<
    | {
        id: any;
        fullName: any;
        avatar: any;
        profileData: {};
        webIdData: any;
      }
    | undefined
  >;
  resetPassword: (params: any) => Promise<void>;
  setNewPassword: (params: any) => Promise<void>;
  getAccountSettings: (params: any) => Promise<any>;
  updateAccountSettings: (params: any) => Promise<void>;
};
type AclMode = 'acl:Read' | 'acl:Append' | 'acl:Write' | 'acl:Control';
/** foaf:Agent = anonymous, acl:AuthenticatedAgent = logged */
type AclClass = 'foaf:Agent' | 'acl:AuthenticatedAgent';
type BasePermission = {
  /** '#Control' | '#Read' | '#Write' | custom string */
  '@id': string;
  '@type': 'acl:Authorization';
  'acl:mode': AclMode;
} & (
  | {
      /** Related resource URI */
      'acl:accessTo'?: string;
    }
  | {
      /** Parent resource URI */
      'acl:default': string;
    }
);
type UserPermission = BasePermission & {
  /** User resource URI */
  'acl:agent': string;
};
type GroupPermission = BasePermission & {
  /** ACL Group resource URI */
  'acl:agentGroup': string;
};
type ClassPermission = BasePermission & {
  'acl:agentClass': AclClass | AclClass[];
};
type Permission = UserPermission | GroupPermission | ClassPermission;
type Permissions = Permission[];
declare const rights: {
  show: AclMode[];
  list: AclMode[];
  create: AclMode[];
  edit: AclMode[];
  delete: AclMode[];
  control: AclMode[];
};
export const useCheckPermissions: (
  uri: string,
  mode: keyof typeof rights,
  redirectUrl?: string
) => Permissions | undefined;
export function CreateWithPermissions(props: any): import('react/jsx-runtime').JSX.Element;
declare namespace CreateWithPermissions {
  namespace defaultProps {
    let actions: import('react/jsx-runtime').JSX.Element;
  }
}
export function useAgents(uri: any): {
  agents: {};
  addPermission: (agentId: any, predicate: any, mode: any) => void;
  removePermission: (agentId: any, predicate: any, mode: any) => void;
};
export function PermissionsButton({ isContainer }: { isContainer: any }): import('react/jsx-runtime').JSX.Element;
declare namespace PermissionsButton {
  namespace defaultProps {
    let isContainer: boolean;
  }
}
export const EditActionsWithPermissions: () => import('react/jsx-runtime').JSX.Element;
export function DeleteButtonWithPermissions(props: any): import('react/jsx-runtime').JSX.Element | null;
export const EditToolbarWithPermissions: React.FunctionComponent<ToolbarProps>;
export function EditWithPermissions(props: any): import('react/jsx-runtime').JSX.Element;
declare namespace EditWithPermissions {
  namespace defaultProps {
    let actions: import('react/jsx-runtime').JSX.Element;
  }
}
export function EditButtonWithPermissions(props: any): import('react/jsx-runtime').JSX.Element | null;
export function ListActionsWithPermissions({
  bulkActions,
  sort,
  displayedFilters,
  exporter,
  filters,
  filterValues,
  onUnselectItems,
  selectedIds,
  showFilter,
  total
}: {
  bulkActions: any;
  sort: any;
  displayedFilters: any;
  exporter: any;
  filters: any;
  filterValues: any;
  onUnselectItems: any;
  selectedIds: any;
  showFilter: any;
  total: any;
}): import('react/jsx-runtime').JSX.Element;
export function ListWithPermissions(props: any): import('react/jsx-runtime').JSX.Element;
declare namespace ListWithPermissions {
  namespace defaultProps {
    let actions: import('react/jsx-runtime').JSX.Element;
  }
}
export const ShowActionsWithPermissions: () => import('react/jsx-runtime').JSX.Element;
export function ShowWithPermissions(props: any): import('react/jsx-runtime').JSX.Element;
declare namespace ShowWithPermissions {
  namespace defaultProps {
    let actions: import('react/jsx-runtime').JSX.Element;
  }
}
export function AuthDialog({
  open,
  onClose,
  title,
  message,
  redirect,
  ...rest
}: {
  [x: string]: any;
  open: any;
  onClose: any;
  title: any;
  message: any;
  redirect: any;
}): import('react/jsx-runtime').JSX.Element;
declare namespace AuthDialog {
  namespace defaultProps {
    let title: string;
    let message: string;
  }
}
export declare namespace SsoLoginPageClasses {
  export let card: string;
  export let avatar: string;
  export let icon: string;
  let _switch: string;
  export { _switch as switch };
}
export function LoginPage({
  children,
  backgroundImage,
  buttons,
  userResource,
  propertiesExist,
  text,
  ...rest
}: {
  [x: string]: any;
  children: any;
  backgroundImage: any;
  buttons: any;
  userResource: any;
  propertiesExist: any;
  text: any;
}): import('react/jsx-runtime').JSX.Element | null;
declare namespace SsoLoginPage {
  namespace defaultProps {
    let propertiesExist: never[];
    let buttons: import('react/jsx-runtime').JSX.Element[];
    let userResource: string;
  }
}
export function useSignup(): (params?: {}) => any;
/**
 * Configuration options for password strength scoring
 *
 * The password strength is calculated based on:
 * - Password length (up to 4 points):
 * - 2 points if length >= 8 characters
 * - Additional 2 points if length >= 14 characters
 * - Character types (1 point each):
 * - Lowercase letters
 * - Uppercase letters
 * - Numbers
 * - Special characters
 *
 * Maximum possible score is 8 points
 * @typedef PasswordStrengthOptions
 * @property {number} isVeryLongLength - Number of characters required for a very long password (default: 14)
 * @property {number} isLongLength - Number of characters required for a long password (default: 8)
 * @property {number} isVeryLongScore - Additional score for a very long password (default: 2)
 * @property {number} isLongScore - Score for a long password (default: 2)
 * @property {number} uppercaseScore - Score for including uppercase letters (default: 1)
 * @property {number} lowercaseScore - Score for including lowercase letters (default: 1)
 * @property {number} numbersScore - Score for including numbers (default: 1)
 * @property {number} nonAlphanumericsScore - Score for including special characters (default: 1)
 */
/** @type {PasswordStrengthOptions} */
export const defaultPasswordScorerOptions: PasswordStrengthOptions;
export function createPasswordScorer(
  options?: PasswordStrengthOptions,
  minRequiredScore?: number
): {
  scoreFn: (password: string) => number;
  analyzeFn: (password: string) => {
    score: number;
    suggestions: string[];
    missingCriteria: {
      lowercase: boolean;
      uppercase: boolean;
      numbers: boolean;
      special: boolean;
      length: boolean;
      veryLong: boolean;
    };
  };
  minRequiredScore: number;
  maxScore: number;
};
export declare namespace defaultScorer {
  let scoreFn: (password: string) => number;
  let analyzeFn: (password: string) => {
    score: number;
    suggestions: string[];
    missingCriteria: {
      lowercase: boolean;
      uppercase: boolean;
      numbers: boolean;
      special: boolean;
      length: boolean;
      veryLong: boolean;
    };
  };
  let minRequiredScore: number;
  let maxScore: number;
}
/**
 * Configuration options for password strength scoring
 *
 * The password strength is calculated based on:
 * - Password length (up to 4 points):
 * - 2 points if length >= 8 characters
 * - Additional 2 points if length >= 14 characters
 * - Character types (1 point each):
 * - Lowercase letters
 * - Uppercase letters
 * - Numbers
 * - Special characters
 *
 * Maximum possible score is 8 points
 */
type PasswordStrengthOptions = {
  /**
   * - Number of characters required for a very long password (default: 14)
   */
  isVeryLongLength: number;
  /**
   * - Number of characters required for a long password (default: 8)
   */
  isLongLength: number;
  /**
   * - Additional score for a very long password (default: 2)
   */
  isVeryLongScore: number;
  /**
   * - Score for a long password (default: 2)
   */
  isLongScore: number;
  /**
   * - Score for including uppercase letters (default: 1)
   */
  uppercaseScore: number;
  /**
   * - Score for including lowercase letters (default: 1)
   */
  lowercaseScore: number;
  /**
   * - Score for including numbers (default: 1)
   */
  numbersScore: number;
  /**
   * - Score for including special characters (default: 1)
   */
  nonAlphanumericsScore: number;
};
export function validatePasswordStrength(scorer?: {
  scoreFn: (password: string) => number;
  analyzeFn: (password: string) => {
    score: number;
    suggestions: string[];
    missingCriteria: {
      lowercase: boolean;
      uppercase: boolean;
      numbers: boolean;
      special: boolean;
      length: boolean;
      veryLong: boolean;
    };
  };
  minRequiredScore: number;
  maxScore: number;
}): (value: any) => 'auth.input.password_too_weak' | undefined;
export function PasswordStrengthIndicator({
  scorer,
  password,
  ...restProps
}: {
  [x: string]: any;
  scorer?:
    | {
        scoreFn: (password: string) => number;
        analyzeFn: (password: string) => {
          score: number;
          suggestions: string[];
          missingCriteria: {
            lowercase: boolean;
            uppercase: boolean;
            numbers: boolean;
            special: boolean;
            length: boolean;
            veryLong: boolean;
          };
        };
        minRequiredScore: number;
        maxScore: number;
      }
    | undefined;
  password: any;
}): import('react/jsx-runtime').JSX.Element;
/**
 * @param {object} props Props
 * @param {boolean} props.hasSignup If to show signup form.
 * @param {boolean} props.allowUsername Indicates, if login is allowed with username (instead of email).
 * @param {function} props.onLogin Optional function to call when login is completed
 * @param {function} props.onSignup Optional function to call when signup is completed
 * @param {object} props.additionalSignupValues
 * @param {object} props.passwordScorer Scorer to evaluate and indicate password strength.
 *  Set to `null` or `false`, if you don't want password strength checks. Default is
 *  passwordStrength's `defaultScorer`.
 * @returns
 */
export function LocalLoginPage({
  hasSignup,
  allowUsername,
  onLogin,
  onSignup,
  additionalSignupValues,
  passwordScorer
}: {
  hasSignup: boolean;
  allowUsername: boolean;
  onLogin: Function;
  onSignup: Function;
  additionalSignupValues: object;
  passwordScorer: object;
}): import('react/jsx-runtime').JSX.Element | null;
declare namespace LocalLoginPage {
  namespace defaultProps {
    let hasSignup: boolean;
    let allowUsername: boolean;
    let additionalSignupValues: {};
  }
}
export function ResourceWithPermissions({
  name,
  create,
  ...rest
}: {
  [x: string]: any;
  name: any;
  create: any;
}): import('react/jsx-runtime').JSX.Element;
export function UserMenu({
  logout,
  profileResource,
  ...otherProps
}: {
  [x: string]: any;
  logout: any;
  profileResource: any;
}): import('react/jsx-runtime').JSX.Element;
declare namespace UserMenu {
  namespace defaultProps {
    let logout: import('react/jsx-runtime').JSX.Element;
    let profileResource: string;
  }
}
export function useCheckAuthenticated(message: any): {
  identity: import('react-admin').UserIdentity | undefined;
  isLoading: boolean;
};
export function usePermissionsWithRefetch(params?: {}): {
  refetch: () => Promise<void>;
  permissions?: any;
};
declare namespace englishMessages {
  namespace auth {
    namespace dialog {
      let container_permissions: string;
      let resource_permissions: string;
      let login_required: string;
    }
    namespace action {
      let submit: string;
      let permissions: string;
      let signup: string;
      let reset_password: string;
      let set_new_password: string;
      let logout: string;
      let login: string;
      let view_my_profile: string;
      let edit_my_profile: string;
      let show_password: string;
      let hide_password: string;
    }
    namespace right {
      namespace resource {
        let read: string;
        let append: string;
        let write: string;
        let control: string;
      }
      namespace container {
        let read_1: string;
        export { read_1 as read };
        let append_1: string;
        export { append_1 as append };
        let write_1: string;
        export { write_1 as write };
        let control_1: string;
        export { control_1 as control };
      }
    }
    namespace agent {
      let anonymous: string;
      let authenticated: string;
    }
    namespace input {
      let agent_select: string;
      let name: string;
      let username: string;
      let email: string;
      let username_or_email: string;
      let current_password: string;
      let new_password: string;
      let confirm_new_password: string;
      let password_strength: string;
      let password_suggestions: string;
      namespace password_suggestion {
        let add_lowercase_letters_a_z: string;
        let add_uppercase_letters_a_z: string;
        let add_numbers_0_9: string;
        let add_special_characters: string;
        let make_it_at_least_8_characters_long: string;
        let make_it_at_least_14_characters_long_for_maximum_strength: string;
      }
      let password_too_weak: string;
      let password_mismatch: string;
      let required_field: string;
      let required_field_description: string;
      let password_description: string;
    }
    namespace helper {
      let login_1: string;
      export { login_1 as login };
      let signup_1: string;
      export { signup_1 as signup };
      let reset_password_1: string;
      export { reset_password_1 as reset_password };
      let set_new_password_1: string;
      export { set_new_password_1 as set_new_password };
    }
    namespace message {
      let resource_show_forbidden: string;
      let resource_edit_forbidden: string;
      let resource_delete_forbidden: string;
      let resource_control_forbidden: string;
      let container_create_forbidden: string;
      let container_list_forbidden: string;
      let unable_to_fetch_user_data: string;
      let no_token_returned: string;
      let no_associated_oidc_issuer: string;
      let invalid_token_returned: string;
      let signup_error: string;
      let user_not_allowed_to_login: string;
      let user_email_not_found: string;
      let user_email_exist: string;
      let username_exist: string;
      let username_invalid: string;
      let new_user_created: string;
      let user_connected: string;
      let user_disconnected: string;
      let bad_request: string;
      let account_settings_updated: string;
      let login_to_continue: string;
      let choose_pod_provider: string;
      let unreachable_auth_server: string;
    }
    namespace notification {
      let reset_password_submitted: string;
      let reset_password_error: string;
      let password_changed: string;
      let new_password_error: string;
      let invalid_password: string;
      let get_settings_error: string;
      let update_settings_error: string;
    }
    namespace required {
      let email_1: string;
      export { email_1 as email };
      export let password: string;
      export let identifier: string;
      export let newPassword: string;
      export let newPasswordAgain: string;
    }
  }
}
declare namespace frenchMessages {
  namespace auth {
    namespace dialog {
      let container_permissions: string;
      let resource_permissions: string;
      let login_required: string;
    }
    namespace action {
      let submit: string;
      let permissions: string;
      let signup: string;
      let reset_password: string;
      let set_new_password: string;
      let logout: string;
      let login: string;
      let view_my_profile: string;
      let edit_my_profile: string;
      let show_password: string;
      let hide_password: string;
    }
    namespace right {
      namespace resource {
        let read: string;
        let append: string;
        let write: string;
        let control: string;
      }
      namespace container {
        let read_1: string;
        export { read_1 as read };
        let append_1: string;
        export { append_1 as append };
        let write_1: string;
        export { write_1 as write };
        let control_1: string;
        export { control_1 as control };
      }
    }
    namespace agent {
      let anonymous: string;
      let authenticated: string;
    }
    namespace input {
      let agent_select: string;
      let name: string;
      let username: string;
      let email: string;
      let username_or_email: string;
      let current_password: string;
      let new_password: string;
      let confirm_new_password: string;
      let password_strength: string;
      let password_suggestions: string;
      namespace password_suggestion {
        let add_lowercase_letters_a_z: string;
        let add_uppercase_letters_a_z: string;
        let add_numbers_0_9: string;
        let add_special_characters: string;
        let make_it_at_least_8_characters_long: string;
        let make_it_at_least_14_characters_long_for_maximum_strength: string;
      }
      let password_too_weak: string;
      let password_mismatch: string;
      let required_field: string;
      let required_field_description: string;
      let password_description: string;
    }
    namespace helper {
      let login_1: string;
      export { login_1 as login };
      let signup_1: string;
      export { signup_1 as signup };
      let reset_password_1: string;
      export { reset_password_1 as reset_password };
      let set_new_password_1: string;
      export { set_new_password_1 as set_new_password };
    }
    namespace message {
      let resource_show_forbidden: string;
      let resource_edit_forbidden: string;
      let resource_delete_forbidden: string;
      let resource_control_forbidden: string;
      let container_create_forbidden: string;
      let container_list_forbidden: string;
      let unable_to_fetch_user_data: string;
      let no_token_returned: string;
      let no_associated_oidc_issuer: string;
      let invalid_token_returned: string;
      let signup_error: string;
      let user_not_allowed_to_login: string;
      let user_email_not_found: string;
      let user_email_exist: string;
      let username_exist: string;
      let username_invalid: string;
      let new_user_created: string;
      let user_connected: string;
      let user_disconnected: string;
      let bad_request: string;
      let account_settings_updated: string;
      let login_to_continue: string;
      let choose_pod_provider: string;
      let unreachable_auth_server: string;
    }
    namespace notification {
      let reset_password_submitted: string;
      let reset_password_error: string;
      let password_changed: string;
      let new_password_error: string;
      let invalid_password: string;
      let get_settings_error: string;
      let update_settings_error: string;
    }
    namespace required {
      let email_1: string;
      export { email_1 as email };
      export let password: string;
      export let identifier: string;
      export let newPassword: string;
      export let newPasswordAgain: string;
    }
  }
}

//# sourceMappingURL=index.d.ts.map

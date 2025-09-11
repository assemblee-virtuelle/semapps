import React, { PropsWithChildren } from "react";
import { CreateProps, EditProps, ToolbarProps, ListActionsProps, ListProps, ShowProps, UserIdentity } from "react-admin";
import { JSX } from "react/jsx-runtime";
export const authProvider: ({ dataProvider, authType, allowAnonymous, checkUser, checkPermissions, clientId }: any) => {
    login: (params: any) => Promise<void>;
    handleCallback: () => Promise<void>;
    signup: (params: any) => Promise<any>;
    logout: (params: any) => Promise<any>;
    checkAuth: () => Promise<void>;
    checkUser: (userData: any) => any;
    checkError: (error: any) => Promise<void>;
    getPermissions: ({ uri }: any) => Promise<any>;
    addPermission: (uri: any, agentId: any, predicate: any, mode: any) => Promise<void>;
    removePermission: (uri: any, agentId: any, predicate: any, mode: any) => Promise<void>;
    getIdentity: () => Promise<{
        id: any;
        fullName: any;
        avatar: any;
        profileData: {};
        webIdData: any;
    } | undefined>;
    resetPassword: (params: any) => Promise<void>;
    setNewPassword: (params: any) => Promise<void>;
    getAccountSettings: (params: any) => Promise<any>;
    updateAccountSettings: (params: any) => Promise<void>;
};
export type AclMode = 'acl:Read' | 'acl:Append' | 'acl:Write' | 'acl:Control';
/** foaf:Agent = anonymous, acl:AuthenticatedAgent = logged */
export type AclClass = 'foaf:Agent' | 'acl:AuthenticatedAgent';
export interface PasswordAnalysis {
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
}
type BasePermission = {
    /** '#Control' | '#Read' | '#Write' | custom string */
    '@id': string;
    '@type': 'acl:Authorization';
    'acl:mode': AclMode;
} & ({
    /** Related resource URI */
    'acl:accessTo'?: string;
} | {
    /** Parent resource URI */
    'acl:default': string;
});
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
export type Permissions = Permission[];
export type CustomTokenPayload = {
    webId: string;
    iat: number;
};
export type IdTokenPayload = {
    azp: string;
    sub: string;
    webid: string;
    at_hash: string;
    aud: string;
    exp: number;
    iat: number;
    iss: string;
};
declare const rights: {
    show: AclMode[];
    list: AclMode[];
    create: AclMode[];
    edit: AclMode[];
    delete: AclMode[];
    control: AclMode[];
};
export const useCheckPermissions: (uri: string | undefined, mode: keyof typeof rights, redirectUrl?: string) => Permissions | undefined;
export const CreateWithPermissions: ({ actions, children, ...rest }: PropsWithChildren<CreateProps>) => JSX.Element;
export const useAgents: (uri: any) => {
    agents: {};
    addPermission: (agentId: any, predicate: any, mode: any) => void;
    removePermission: (agentId: any, predicate: any, mode: any) => void;
};
export const PermissionsButton: ({ isContainer }: {
    isContainer?: boolean | undefined;
}) => JSX.Element;
export const EditActionsWithPermissions: () => JSX.Element;
export const EditWithPermissions: ({ actions, children, ...rest }: PropsWithChildren<EditProps>) => JSX.Element;
export const DeleteButtonWithPermissions: (props: any) => JSX.Element | null;
export const EditToolbarWithPermissions: React.FunctionComponent<ToolbarProps>;
export const EditButtonWithPermissions: (props: any) => JSX.Element | null;
export const ListActionsWithPermissions: ({ sort, displayedFilters, exporter, filters, filterValues, showFilter, total }: ListActionsProps) => JSX.Element;
export const ListWithPermissions: ({ actions, ...rest }: ListProps) => JSX.Element;
export const ShowActionsWithPermissions: () => JSX.Element;
export const ShowWithPermissions: ({ actions, ...rest }: ShowProps) => JSX.Element;
export const AuthDialog: ({ open, onClose, title, message, redirect, ...rest }: any) => JSX.Element;
export const LoginPage: ({ children, backgroundImage, buttons, userResource, propertiesExist, text, ...rest }: any) => JSX.Element | null;
export const useSignup: () => (params?: {}) => any;
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
export const defaultPasswordScorerOptions: {
    isVeryLongLength: number;
    isLongLength: number;
    isLongScore: number;
    isVeryLongScore: number;
    uppercaseScore: number;
    lowercaseScore: number;
    numbersScore: number;
    nonAlphanumericsScore: number;
};
/**
 * Creates a password scorer with custom configuration
 * @param {PasswordStrengthOptions} options - Custom scoring configuration (optional)
 * @param {number} minRequiredScore - Minimum score required for password acceptance (default: 5)
 * @returns {{
 *   scoreFn: (password: string) => number,
 *   analyzeFn: (password: string) => {
 *     score: number,
 *     suggestions: string[],
 *     missingCriteria: {
 *       lowercase: boolean,
 *       uppercase: boolean,
 *       numbers: boolean,
 *       special: boolean,
 *       length: boolean,
 *       veryLong: boolean
 *     }
 *   },
 *   minRequiredScore: number,
 *   maxScore: number
 * }} Scorer object containing:
 *   - scoreFn: Function to calculate password score
 *   - analyzeFn: Function to analyze password and return suggestions for improvement
 *   - minRequiredScore: Minimum required score
 *   - maxScore: Maximum possible score (8)
 */
export const createPasswordScorer: (options?: {
    isVeryLongLength: number;
    isLongLength: number;
    isLongScore: number;
    isVeryLongScore: number;
    uppercaseScore: number;
    lowercaseScore: number;
    numbersScore: number;
    nonAlphanumericsScore: number;
}, minRequiredScore?: number) => {
    scoreFn: (password: any) => any;
    analyzeFn: (password: any) => {
        score: any;
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
export const defaultPasswordScorer: {
    scoreFn: (password: any) => any;
    analyzeFn: (password: any) => {
        score: any;
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
export const validatePasswordStrength: (scorer?: {
    scoreFn: (password: any) => any;
    analyzeFn: (password: any) => {
        score: any;
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
}) => (value: any) => "auth.input.password_too_weak" | undefined;
export function PasswordStrengthIndicator({ scorer, password, ...restProps }: any): JSX.Element;
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
export const LocalLoginPage: ({ hasSignup, allowUsername, onLogin, onSignup, additionalSignupValues, passwordScorer }: any) => JSX.Element | null;
export const ResourceWithPermissions: ({ name, create, ...rest }: any) => JSX.Element;
export const UserMenu: ({ logout, profileResource, ...otherProps }: any) => JSX.Element;
export const useCheckAuthenticated: (message: any) => {
    identity: UserIdentity | undefined;
    isLoading: boolean;
};
export const usePermissionsWithRefetch: (params?: {}) => {
    refetch: () => Promise<void>;
    permissions?: any;
};
export const englishMessages: {
    auth: {
        dialog: {
            container_permissions: string;
            resource_permissions: string;
            login_required: string;
        };
        action: {
            submit: string;
            permissions: string;
            signup: string;
            reset_password: string;
            set_new_password: string;
            logout: string;
            login: string;
            view_my_profile: string;
            edit_my_profile: string;
            show_password: string;
            hide_password: string;
        };
        right: {
            resource: {
                read: string;
                append: string;
                write: string;
                control: string;
            };
            container: {
                read: string;
                append: string;
                write: string;
                control: string;
            };
        };
        agent: {
            anonymous: string;
            authenticated: string;
        };
        input: {
            agent_select: string;
            name: string;
            username: string;
            email: string;
            username_or_email: string;
            current_password: string;
            new_password: string;
            confirm_new_password: string;
            password_strength: string;
            password_suggestions: string;
            password_suggestion: {
                add_lowercase_letters_a_z: string;
                add_uppercase_letters_a_z: string;
                add_numbers_0_9: string;
                add_special_characters: string;
                make_it_at_least_8_characters_long: string;
                make_it_at_least_14_characters_long_for_maximum_strength: string;
            };
            password_too_weak: string;
            password_mismatch: string;
            required_field: string;
            required_field_description: string;
            password_description: string;
        };
        helper: {
            login: string;
            signup: string;
            reset_password: string;
            set_new_password: string;
        };
        message: {
            resource_show_forbidden: string;
            resource_edit_forbidden: string;
            resource_delete_forbidden: string;
            resource_control_forbidden: string;
            container_create_forbidden: string;
            container_list_forbidden: string;
            unable_to_fetch_user_data: string;
            no_token_returned: string;
            no_associated_oidc_issuer: string;
            invalid_token_returned: string;
            signup_error: string;
            user_not_allowed_to_login: string;
            user_email_not_found: string;
            user_email_exist: string;
            user_email_invalid: string;
            username_exist: string;
            username_invalid: string;
            username_too_short: string;
            password_too_short: string;
            new_user_created: string;
            user_connected: string;
            user_disconnected: string;
            bad_request: string;
            account_settings_updated: string;
            login_to_continue: string;
            choose_pod_provider: string;
            unreachable_auth_server: string;
        };
        notification: {
            reset_password_submitted: string;
            reset_password_error: string;
            password_changed: string;
            new_password_error: string;
            invalid_password: string;
            get_settings_error: string;
            update_settings_error: string;
        };
        required: {
            email: string;
            password: string;
            identifier: string;
            newPassword: string;
            newPasswordAgain: string;
        };
    };
};
export const frenchMessages: {
    auth: {
        dialog: {
            container_permissions: string;
            resource_permissions: string;
            login_required: string;
        };
        action: {
            submit: string;
            permissions: string;
            signup: string;
            reset_password: string;
            set_new_password: string;
            logout: string;
            login: string;
            view_my_profile: string;
            edit_my_profile: string;
            show_password: string;
            hide_password: string;
        };
        right: {
            resource: {
                read: string;
                append: string;
                write: string;
                control: string;
            };
            container: {
                read: string;
                append: string;
                write: string;
                control: string;
            };
        };
        agent: {
            anonymous: string;
            authenticated: string;
        };
        input: {
            agent_select: string;
            name: string;
            username: string;
            email: string;
            username_or_email: string;
            current_password: string;
            new_password: string;
            confirm_new_password: string;
            password_strength: string;
            password_suggestions: string;
            password_suggestion: {
                add_lowercase_letters_a_z: string;
                add_uppercase_letters_a_z: string;
                add_numbers_0_9: string;
                add_special_characters: string;
                make_it_at_least_8_characters_long: string;
                make_it_at_least_14_characters_long_for_maximum_strength: string;
            };
            password_too_weak: string;
            password_mismatch: string;
            required_field: string;
            required_field_description: string;
            password_description: string;
        };
        helper: {
            login: string;
            signup: string;
            reset_password: string;
            set_new_password: string;
        };
        message: {
            resource_show_forbidden: string;
            resource_edit_forbidden: string;
            resource_delete_forbidden: string;
            resource_control_forbidden: string;
            container_create_forbidden: string;
            container_list_forbidden: string;
            unable_to_fetch_user_data: string;
            no_token_returned: string;
            no_associated_oidc_issuer: string;
            invalid_token_returned: string;
            signup_error: string;
            user_not_allowed_to_login: string;
            user_email_not_found: string;
            user_email_exist: string;
            user_email_invalid: string;
            username_exist: string;
            username_invalid: string;
            username_too_short: string;
            password_too_short: string;
            new_user_created: string;
            user_connected: string;
            user_disconnected: string;
            bad_request: string;
            account_settings_updated: string;
            login_to_continue: string;
            choose_pod_provider: string;
            unreachable_auth_server: string;
        };
        notification: {
            reset_password_submitted: string;
            reset_password_error: string;
            password_changed: string;
            new_password_error: string;
            invalid_password: string;
            get_settings_error: string;
            update_settings_error: string;
        };
        required: {
            email: string;
            password: string;
            identifier: string;
            newPassword: string;
            newPasswordAgain: string;
        };
    };
};

//# sourceMappingURL=index.d.ts.map

export { default as authProvider } from './authProvider';

// Create
export { default as CreateWithPermissions } from './crud/create/CreateWithPermissions';

// Edit
export { default as EditWithPermissions } from './crud/edit/EditWithPermissions';
export { default as EditActionsWithPermissions } from './crud/edit/EditActionsWithPermissions';
export { default as EditToolbarWithPermissions } from './crud/edit/EditToolbarWithPermissions';
export { default as EditButtonWithPermissions } from './crud/edit/EditButtonWithPermissions';
export { default as DeleteButtonWithPermissions } from './crud/edit/DeleteButtonWithPermissions';

// List
export { default as ListWithPermissions } from './crud/list/ListWithPermissions';
export { default as ListActionsWithPermissions } from './crud/list/ListActionsWithPermissions';

// Show
export { default as ShowWithPermissions } from './crud/show/ShowWithPermissions';
export { default as ShowActionsWithPermissions } from './crud/show/ShowActionsWithPermissions';

export { default as PermissionsButton } from './components/PermissionsButton/PermissionsButton';
export { default as AuthDialog } from './components/AuthDialog';
export { default as SsoLoginPage, default as LoginPage } from './components/SsoLoginPage';
export { default as LocalLoginPage } from './components/LocalLoginPage/LocalLoginPage';
export { default as ResourceWithPermissions } from './components/ResourceWithPermissions';
export { default as UserMenu } from './components/UserMenu';

export { default as useAgents } from './hooks/useAgents';
export { default as useCheckAuthenticated } from './hooks/useCheckAuthenticated';
export { default as useCheckPermissions } from './hooks/useCheckPermissions';
export { default as usePermissionsWithRefetch } from './hooks/usePermissionsWithRefetch';
export { default as useSignup } from './hooks/useSignup';

// Password scoring
export { default as PasswordStrengthIndicator } from './components/LocalLoginPage/PasswordStrengthIndicator';
export { default as validatePasswordStrength } from './components/LocalLoginPage/validatePasswordStrength';
export {
  defaultScorer as defaultPasswordScorer,
  defaultOptions as defaultPasswordScorerOptions,
  createPasswordScorer
} from './passwordScorer';

export { default as englishMessages } from './messages/english';
export { default as frenchMessages } from './messages/french';

export * from './types';

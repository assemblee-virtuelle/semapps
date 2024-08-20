---
title: Auth Provider
---

React-Admin use [auth providers](https://marmelab.com/react-admin/doc/3.19/Authentication.html) to authenticate users on
your application. We have developped an Auth Provider which is specifically designed to connect to a SemApps-based
server. It works with [OIDC](../middleware/auth#oidc), [Cas](../middleware/auth#cas) or [local](../middleware/auth#local-accounts) authentication.

## Installation

```bash
npm install @semapps/auth-provider
```

## Basic configuration

```jsx
import { Admin } from 'react-admin';
import { authProvider, SsoLoginPage } from '@semapps/auth-provider';
import dataProvider from './dataProvider.js';

const App = () => (
  <Admin
    authProvider={authProvider({
      dataProvider,
      authType: 'sso' // or "local" or "pod"
    })}
    loginPage={SsoLoginPage} // Or you can use the LocalLoginPage
  >
    <Resource name="Project" ... />
    <Resource name="Organization" ... />
  </Admin>
);
```

See the [official React-Admin about authentication](https://marmelab.com/react-admin/Authentication.html) for more details.

You will also need to include the package-specific translations messages in React-Admin's `i18nProvider`:

```jsx
import polyglotI18nProvider from 'ra-i18n-polyglot';
import frenchMessages from 'ra-language-french';
import { frenchMessages as authFrenchMessages } from '@semapps/auth-provider';

export const i18nProvider = polyglotI18nProvider(
  lang => ({
    ...frenchMessages,
    ...authFrenchMessages
  }),
  'fr'
);
```

## Advanced configuration

### `allowAnonymous`

By default your app will be accessible to anonymous users.

If you wish to force all users to login, you can pass a `allowAnonymous: false` param to the auth provider.

### `checkPermissions`

If you want to check permissions based on WebACL, you need to set `checkPermissions: true`.

Additionally, you should use the [page components](#pages-components) below instead of React-Admin's default `Create`, `Edit`, `List` and `Show` components.

### `checkUser`

If you only want certain types of users to access your app, you can pass a `checkUser` function to the authProvider.

This function receives user data and must return true or false, depending on whether the user is granted access or not.

> This `checkUser` function is also available to any of your components using the React-Admin's `useAuthProvider` hook.

## Pages components

### CreateWithPermissions

Same as React-Admin [Create](https://marmelab.com/react-admin/doc/3.19/CreateEdit.html) component, except:

- It ensures the logged-in user has the right to create a new resource.

### EditWithPermissions

Same as React-Admin [Edit](https://marmelab.com/react-admin/doc/3.19/CreateEdit.html) component, except:

- It ensures the logged-in user has the right to edit the resource.
- It displays the Permissions button (through an `EditActionsWithPermissions` component which can be imported independently) if the logged-in user has `acl:Control` right.
- It does not show the delete button if user doesn't have a `acl:write` right (through an `EditToolbarWithPermissions` component which can be imported independently).

### ListWithPermissions

Same as React-Admin [List](https://marmelab.com/react-admin/doc/3.19/List.html#the-list-component) component, except:

- It displays the Permissions button (through a `ListActionsWithPermissions` component which can be imported independently) if the logged-in user has `acl:Control` right.

### ShowWithPermissions

Same as React-Admin [Show](https://marmelab.com/react-admin/doc/3.19/Show.html#the-show-component) component, except:

- It ensures the logged-in user has the right to view the resource
- It displays the Permissions button (through a `ShowActionsWithPermissions` component which can be imported independently) if the logged-in user has `acl:Control` right.

## Other components

### AuthDialog

```js
const MyPage = () => {
  const [openAuth, setOpenAuth] = useState(false);
  return (
    <>
      <Button onClick={() => setOpenAuth(true)}>Protected action</Button>
      <AuthDialog open={openAuth} onClose={() => setOpenAuth(false)} />
    </>
  );
};
```

| Property   | Type       | Default                    | Description                        |
| ---------- | ---------- | -------------------------- | ---------------------------------- |
| `open`     | `Boolean`  | **required**               | True if the dialog is open         |
| `onClose`  | `Function` | **required**               | Function to close the dialog       |
| `redirect` | `String`   | Current path               | Path where to redirect after login |
| `title`    | `String`   | "Login required"           | Title of the dialog                |
| `message`  | `String`   | "Please login to continue" | Content of the dialog              |

All other props are passed to the underlying Material-UI [Dialog](https://v4.mui.com/api/dialog/) component.

### LocalLoginPage

Login/signup page to use with a [local authentication](../middleware/auth#local-accounts). Include reset password feature.

| Property                 | Type       | Default         | Description                                                                 |
| ------------------------ | ---------- | --------------- | --------------------------------------------------------------------------- |
| `hasSignup`              | `String`   | `true`          | Set to false if you don't want the user to be able to signup                |
| `allowUsername`          | `Boolean`  | `false`         | Indicates if login is allowed with username (instead of email).             |
| `onLogin`                | `Function` |                 | Function called at the end of the login process. Should redirect.           |
| `onSignup`               | `Function` |                 | Function called at the end of the signup process. Should redirect.          |
| `additionalSignupValues` | `Object`   |                 | Additional values to send to the signup endpoint                            |
| `passwordScorer`         | `Function` | `defaultScorer` | Scorer to evaluate and indicate password strength. Set to false to disable. |

### SsoLoginPage

Login page to use with a [SSO authentication](../middleware/auth#oidc) (OIDC/Cas).

| Property          | Type      | Default  | Description                                         |
| ----------------- | --------- | -------- | --------------------------------------------------- |
| `userResource`    | `String`  | "Person" | True if the dialog is open                          |
| `text`            | `Element` |          | Text to show above the SSO button                   |
| `propertiesExist` | `Array`   |          | Properties to check after the user has been created |

## Hooks

### useAgents

Return a list of WAC agents (users, groups or classes) based on the URI of a resource or a container.

```js
const { agents, addPermission, removePermission } = useAgents(uri);
```

#### Parameters

| Property | Type     | Default      | Description                      |
| -------- | -------- | ------------ | -------------------------------- |
| `uri`    | `String` | **required** | URI of the resource or container |

#### Return values

| Property           | Type       | Description                                               |
| ------------------ | ---------- | --------------------------------------------------------- |
| `agents`           | `Array`    | Array of objects with `id`, `predicate` and `permissions` |
| `addPermission`    | `Function` | Function to add a new permission                          |
| `removePermission` | `Function` | Function to remove an existing permission                 |

### useCheckAuthenticated

Return the identity of the logged-in user. If user is not logged, redirect to the login page.

```js
const { identity, loading } = useCheckAuthenticated();
```

#### Return values

| Property   | Type      | Description                                                 |
| ---------- | --------- | ----------------------------------------------------------- |
| `identity` | `Object`  | Object returned by the auth provider's `getIdentity` method |
| `loading`  | `Boolean` | True if the user data is loading                            |

### useCheckPermissions

Check if the logged-in user has the right to access the resource or container with a given mode.

```js
const { permissions } = useCheckPermissions(uri, mode, redirectUrl);
```

#### Parameters

| Property      | Type     | Default      | Description                                                           |
| ------------- | -------- | ------------ | --------------------------------------------------------------------- |
| `uri`         | `String` | **required** | URI of the resource or container                                      |
| `mode`        | `String` | **required** | "list", "edit", "create" or "show"                                    |
| `redirectUrl` | `String` | "/"          | Path to redirect to if the user doesn't have the required permissions |

#### Return value

| Property      | Type     | Description                                        |
| ------------- | -------- | -------------------------------------------------- |
| `permissions` | `Object` | Permissions of the logged-in user for the resource |

### useSignup

Return the `signup` method of the auth provider. Used by the [LocalLoginPage](#localloginpage).

```js
const signup = useSignup();
```

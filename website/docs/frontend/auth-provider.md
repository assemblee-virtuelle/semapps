---
title: Auth Provider
---

## Installation

```bash
npm install @semapps/auth-provider
```

## Basic configuration

Import the `authProvider` from the package and use it as-is with React-Admin

```jsx
import { Admin } from 'react-admin';
import { authProvider } from '@semapps/auth-provider';

const App = () => (
  <Admin
    authProvider={authProvider({ middlewareUri: 'http://localhost:3000/' })}
    ...
  >
    <Resource name="Project" ... />
    <Resource name="Organization" ... />
  </Admin>
);
```

See the [official React-Docs about authentication](https://marmelab.com/react-admin/Authentication.html) for more details.

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

## Adding user authentication to Archipelago layout

```jsx
import { Admin } from 'react-admin';
import { authProvider, LoginPage, LogoutButton, UserMenu } from '@semapps/auth-provider';
import { Layout, AppBar, theme } from '@semapps/archipelago-layout';

const AppBarWithUserMenu = props => <AppBar userMenu={<UserMenu />} {...props} />;
const LayoutWithUserMenu = props => <Layout {...props} appBar={AppBarWithUserMenu} />;

const App = () => (
  <Admin
    authProvider={authProvider({ middlewareUri: 'http://localhost:3000/' })}
    layout={LayoutWithUserMenu}
    loginPage={LoginPage}
    logoutButton={LogoutButton}
  >
    <Resource name="Project" ... />
    <Resource name="Organization" ... />
  </Admin>
);
```

## Forcing user to login

By default your app will be accessible to anonymous users.

If you wish to force all users to login, you can pass a `allowAnonymous: false` param to the auth provider.

## Checking allowed users

If you only want certain types of users to access your app, you can pass a `checkUser` function to the authProvider.

This function receives user data and must return true or false, depending on whether the user is granted access or not.

> This `checkUser` function is also available to any of your components using the React-Admin's `useAuthProvider` hook.

## Checking permissions

If you want to check permissions based on WebACL, you need to provide additional parameters to the authProvider.

```jsx
import { Admin, Resource } from 'react-admin';
import { authProvider } from '@semapps/auth-provider';
import { httpClient } from '@semapps/semantic-data-provider';

const App = () => (
  <Admin
    authProvider={authProvider({
      middlewareUri: 'http://localhost:3000/',
      checkPermissions: true,
      httpClient,
      resources: {
        Project: {
          containerUri: 'http://localhost:3000/projects'
        },
        Organization: {
          containerUri: 'http://localhost:3000/organizations'
        }
      }
    })}
  >
    <Resource name="Project" />
    <Resource name="Organization" />
  </Admin>
);
```

Additionally, you should use the `<ListWithPermissions />`, `<ShowWithPermissions />` and `<EditWithPermissions />` components instead of React-Admin's default `<List />`, `<Show />` and `<Edit />` components.

This will hide the Create, Edit and Delete buttons to users who are not allowed to do these actions, and show a Permissions button to users who have `acl:Control` over a resource or a container.

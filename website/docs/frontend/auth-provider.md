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


## Checking permissions

If you want to check permissions based on WebACL, you need to provide additional parameters to the authProvider and you need to use the `<ResourceWithPermissions />` component instead of React-Admin's default `<Resource />` component.
The result will be that resources will only be shown if the user has the right to see its container. Additionally the Create, Edit and Delete buttons will be hidden to users who are not allowed to do these actions.

```jsx
import { Admin } from 'react-admin';
import { authProvider, ResourceWithPermissions } from '@semapps/auth-provider';
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
    <ResourceWithPermissions name="Project" />
    <ResourceWithPermissions name="Organization" />
  </Admin>
);
```

Additionally, you should use the components `<ShowWithPermissions />`, `<ListWithPermissions />` and `<EditWithPermissions />` instead of React-Admin's default `<Show />`, `<List />` and `<Edit />` components.

### With a custom List component

If you use a custom List component but still want to show the Permissions button, you only need to add the `<PermissionsButton />` to the list of `bulkActions`. The button will be displayed if the user has the right to control the container.

```jsx
import { ListActions } from 'react-admin';
import { PermissionsButton } from '@semapps/auth-provider';

export const PostList = props => (
  <MyListComponent
    actions={<ListActions bulkActions={<PermissionsButton />}
    {...props}
  >
);
```

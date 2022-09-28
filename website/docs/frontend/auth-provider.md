---
title: Auth Provider
---

React-Admin use [Auth Providers](https://marmelab.com/react-admin/doc/3.19/Authentication.html) to authenticate users on
your application. We have developped an Auth Provider which is specifically designed to connect to a SemApps-based
server. It works with OIDC, Cas or local authentication.

## Installation

```bash
npm install @semapps/auth-provider
```

## Basic configuration

```jsx
import { Admin } from 'react-admin';
import { authProvider, SsoLoginPage, LoginPage } from '@semapps/auth-provider';
import { httpClient } from '@semapps/semantic-data-provider';

const App = () => (
  <Admin
    authProvider={authProvider({ 
      middlewareUri: 'http://localhost:3000/',
      httpClient,
      localAccounts: false // Set to true if you use the LocalLoginPage
    })}
    loginPage={SsoLoginPage} // Or you can use the LocalLoginPage
    logoutButton={LogoutButton}
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

Additionally, you should use the `<ListWithPermissions />`, `<ShowWithPermissions />` and `<EditWithPermissions />` components instead of React-Admin's default `<List />`, `<Show />` and `<Edit />` components.

This will hide the Create, Edit and Delete buttons to users who are not allowed to do these actions, and show a Permissions button to users who have `acl:Control` over a resource or a container.

### `checkUser`

If you only want certain types of users to access your app, you can pass a `checkUser` function to the authProvider.

This function receives user data and must return true or false, depending on whether the user is granted access or not.

> This `checkUser` function is also available to any of your components using the React-Admin's `useAuthProvider` hook.

### `localAccounts`

If you use the `LocalLoginPage` instead of the `SsoLoginPage`, you must set `localAccounts: true`.

## Components

### LocalLoginPage

Login/signup page to use with a local authentication.

| Property          | Type      | Default                    | Description                                                                                           |
|-------------------|-----------|----------------------------|-------------------------------------------------------------------------------------------------------|
| `userResource`    | `String`  | "Person"                   | True if the dialog is open                                                                            |
| `text`            | `Element` |                            | Text to show above the SSO button                                                                     |
| `propertiesExist` | `Array`   |                            | Properties to check after the user has been created. Useful when collections are added asynchronously |


### SsoLoginPage

Login page to use with a SSO authentication.

| Property          | Type      | Default                    | Description                                                                                           |
|-------------------|-----------|----------------------------|-------------------------------------------------------------------------------------------------------|
| `userResource`    | `String`  | "Person"                   | True if the dialog is open                                                                            |
| `text`            | `Element` |                            | Text to show above the SSO button                                                                     |
| `propertiesExist` | `Array`   |                            | Properties to check after the user has been created. Useful when collections are added asynchronously |


### AuthDialog

```js
const MyPage = () => {
  const [openAuth, setOpenAuth] = useState(false);
  return(
    <>
      <Button onClick={() => setOpenAuth(true)}>
        Protected action
      </Button>
      <AuthDialog open={openAuth} onClose={() => setOpenAuth(false)} />
    </>
  );
};
```

| Property   | Type       | Default                    | Description                        |
|------------|------------|----------------------------|------------------------------------|
| `open`     | `Boolean`  | **required**               | True if the dialog is open         |
| `onClose`  | `Function` | **required**               | Function to close the dialog       |
| `redirect` | `String`   | Current path               | Path where to redirect after login |
| `title`    | `String`   | "Login required"           | Title of the dialog                |
| `message`  | `String`   | "Please login to continue" | Content of the dialog              |

All other props are passed to the underlying Material-UI [Dialog](https://v4.mui.com/api/dialog/) component.

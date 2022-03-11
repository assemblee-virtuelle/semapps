---
title: Interop Components
---

React-Admin components to handle interoperability between SemApps instances.

## Installation

```bash
npm install @semapps/interop-components --save
```

## Components

### CreateOrImportForm

Replace React-Admin's [SimpleForm](https://marmelab.com/react-admin/CreateEdit.html#the-simpleform-component) with a form giving two options: either create a new resource from scratch, or import it from another server.

When importing, you can either fork the remote data or you can keep the local data in sync with the remote one.

```jsx
import { Create, TextInput } from 'react-admin';
import { CreateOrImportForm } from '@semapps/interop-components';

export const PostCreate = (props) => (
  <Create {...props}>
    <CreateOrImportForm>
      <TextInput source="title" />
    </CreateOrImportForm>
  </Create>
);
```

> Note: if you want to allow users to search for remote data, you should have configured (in the `dataServer` config of the semantic data provider) other servers which have the same class of resources.
> 
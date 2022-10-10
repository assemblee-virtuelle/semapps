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

| Property          | Type    | Default | Description                                           |
|-------------------|---------| ------- |-------------------------------------------------------|
| `stripProperties` | `Array` |  | Properties you don't want to copy locally (fork mode) |


### LexiconImportForm

Form to import data from a lexicon-type database (currently Wikidata or ESCO)

```js
import { Create } from 'react-admin';
import { LexiconImportForm, fetchWikidata } from "@semapps/interop-components";

const ThemeCreate = (props) => (
  <Create {...props}>
    <LexiconImportForm
      fetchLexicon={fetchWikidata} // or fetchESCO
      selectData={data => ({
        'pair:label': data.label,
        'pair:comment': data.summary,
        'http://www.w3.org/ns/prov#wasDerivedFrom': data.uri,
      })}
      redirect="show"
    />
  </Create>
);
```


### LexiconCreateDialog

Dialog to be used with the `create` props of React-Admin [AutocompleteArrayInput](https://marmelab.com/react-admin/doc/3.19/Inputs.html#creating-new-choices-2)

```js
import { AutocompleteArrayInput } from 'react-admin';
import { ReferenceArrayInput } from '@semapps/semantic-data-provider';
import { LexiconCreateDialog, fetchWikidata } from "@semapps/interop-components";

export const ThemesInput = (props) => (
  <ReferenceArrayInput reference="Theme" {...props}>
    <AutocompleteArrayInput
      optionText="pair:label"
      create={
        <LexiconCreateDialog
          fetchLexicon={fetchWikidata}  // or fetchESCO
          selectData={data => ({
            'pair:label': data.label,
            'pair:comment': data.summary,
            'http://www.w3.org/ns/prov#wasDerivedFrom': data.uri,
          })}
        />
      }
    />
  </ReferenceArrayInput>
);
```

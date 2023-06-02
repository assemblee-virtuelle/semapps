---
title: Input Components
---

New [React-Admin inputs](https://marmelab.com/react-admin/doc/3.19/Inputs.html) to be used in SemApps projects.


## Installation

```bash
npm install @semapps/input-components --save
```


## Components

### ImageInput

To be used instead of React-Admin [ImageInput](https://marmelab.com/react-admin/ImageInput.html) because this
component expects an object while uploads handled through SemApps return only an URL.


### MultiLinesInput

A multi-lines [TextInput](https://marmelab.com/react-admin/doc/3.19/Inputs.html#textinput), which returns an array with
each line as an element. Can be used with [MultiUrlField](field-components).


### MultiServerAutocompleteInput

Same as React-Admin [AutocompleteInput](https://marmelab.com/react-admin/doc/3.19/Inputs.html#autocompleteinput) but displays the name of the data server where the resource is coming from.

```jsx
import { ReferenceInput } from 'react-admin';
import { MultiServerAutocompleteInput } from '@semapps/input-components';

export const TopicInput = props => (
  <ReferenceInput reference="Topic" fullWidth>
    <MultiServerAutocompleteInput optionText="label" resettable />
  </ReferenceInput>
);
```

### MultiServerAutocompleteArrayInput

Same as React-Admin [AutocompleteArrayInput](https://marmelab.com/react-admin/doc/3.19/Inputs.html#autocompletearrayinput) 
but displays the name of the data server (in grey and italic).

```jsx
import { ReferenceArrayInput } from 'react-admin';
import { MultiServerAutocompleteArrayInput } from '@semapps/input-components';

export const TopicsInput = props => (
  <ReferenceArrayInput reference="Topic" {...props}>
    <MultiServerAutocompleteArrayInput optionText="label" />
  </ReferenceArrayInput>
);
```

To prevent the name of the server to be displayed inside the chip, you can add this to your Material-UI theme:

```
overrides: {
  RaAutocompleteArrayInput: {
    chipContainerFilled: {
      '& .serverName': {
        display: 'none'
      }
    }
  }
}
```


### ReferenceArrayInput

Same as React-Admin [ReferenceArrayInput](https://marmelab.com/react-admin/doc/3.19/Inputs.html#referencearrayinput) but, 
if there is a single value, transform the string into an array. Also, if the value is dereferenced, only keep it's `@id`.


### ReferenceInput

Same as React-Admin [ReferenceInput](https://marmelab.com/react-admin/doc/3.19/Inputs.html#referenceinput) but, if the
value is dereferenced, only keep it's `@id`.

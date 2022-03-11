---
title: Input Components
---

New [React-Admin inputs](https://marmelab.com/react-admin/Inputs.html) to be used in SemApps projects.

## Installation

```bash
npm install @semapps/input-components --save
```

## Components

### MultiServerAutocompleteInput

Same as React-Admin [AutocompleteInput](https://marmelab.com/react-admin/Inputs.html#autocompleteinput) but displays the name of the data server where the resource is coming from.

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

Same as React-Admin [AutocompleteArrayInput](https://marmelab.com/react-admin/Inputs.html#autocompletearrayinput) but displays the name of the data server (in grey and italic).

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
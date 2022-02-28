---
title: Input Components
---

New [React-Admin inputs](https://marmelab.com/react-admin/Inputs.html) to be used in SemApps projects.

## Installation

```bash
npm install @semapps/input-components --save
```

## Components

### MultiServerAutocompleteArrayInput

Same as React-Admin [AutocompleteArrayInput](https://marmelab.com/react-admin/Inputs.html#autocompletearrayinput) but displays the name of the data server (in grey and italic).

```jsx
import { Show, SimpleShowLayout } from 'react-admin';
import { CalendarList } from '@semapps/date-components';

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
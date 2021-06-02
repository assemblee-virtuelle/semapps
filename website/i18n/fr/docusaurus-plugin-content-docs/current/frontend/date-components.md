---
title: Date Components
---

## Installation

```bash
npm install @semapps/date-components --save
```

## Usage

```jsx
import React from 'react';
import { Edit, SimpleForm } from 'react-admin'
import { DateInput, TimeInput, DateTimeInput } from '@semapps/date-components';

export const MyEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <DateInput source="startDate" label="Start date" options={{ format: 'dd/MM/yyyy' }} />
      <TimeInput source="startTime" label="Start time" options={{ format: 'HH:mm:ss' }} />
      <DateTimeInput source="endDate" label="End time" options={{ format: 'dd/MM/yyyy, HH:mm:ss', ampm: false, clearable: true }} />
    </SimpleForm>
  </Edit>
);

```

### Props

### `options`

The `options` prop is passed down to the pickers.

Documentation for these options can be found in the [material-ui-pickers documentation](https://material-ui-pickers.dev/) for the component you're trying to use.

### `providerOptions`

If you want to use a date adapter library other than `date-fns` or you want a locale other than english, you can pass the `providerOptions` prop:

```jsx
import DateFnsUtils from '@date-io/date-fns';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import frLocale from "date-fns/locale/fr";
import moment from "moment";

<DateInput source="date" label="Date using moment" providerOptions={{ utils: MomentUtils }} />
<DateInput source="date" label="Date in French!" providerOptions={{ utils: DateFnsUtils, locale: frLocale }} />
```

---
title: Date Components
---

## Installation

```bash
npm install @semapps/date-components --save
```

If you wish to use the CalendarList or DaysList components, you must also include the following CSS file:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fullcalendar@5.7.2/main.min.css" />
```

## Components

### CalendarList

Display a list of resources in a calendar view, using the [FullCalendar](https://fullcalendar.io) package.

```jsx
import { List } from 'react-admin';
import { CalendarList } from '@semapps/date-components';

const MyList = props => (
  <List pagination={false} perPage={1000} {...props}>
    <CalendarList
      label={record => record.label}
      startDate={record => record.startDate}
      endDate={record => record.endDate}
    />
  </List>
);
```

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `label` | `Function` | **required** | A function which takes a record and returns a label |
| `latitude` | `Function` | **required** | A function which takes a record and returns a latitude |
| `longitude` | `Function` | **required** | A function which takes a record and returns a longitude |
| `locale` | `Object` | (English) | The [locale](https://fullcalendar.io/docs/locale) to be used by FullCalendar |
| `linkType` | `String` | "edit" | What kind of link to use. Available options: "show" or "edit" |

### DaysList

Same as `CalendarList`, except the resources are displayed in a [list view](https://fullcalendar.io/docs/list-view).

### Date/Time inputs

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

#### Props

##### `options`

The `options` prop is passed down to the pickers.

Documentation for these options can be found in the [material-ui-pickers documentation](https://material-ui-pickers.dev/) for the component you're trying to use.

##### `providerOptions`

If you want to use a date adapter library other than `date-fns` or you want a locale other than english, you can pass the `providerOptions` prop:

```jsx
import DateFnsUtils from '@date-io/date-fns';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import frLocale from "date-fns/locale/fr";
import moment from "moment";

<DateInput source="date" label="Date using moment" providerOptions={{ utils: MomentUtils }} />
<DateInput source="date" label="Date in French!" providerOptions={{ utils: DateFnsUtils, locale: frLocale }} />
```

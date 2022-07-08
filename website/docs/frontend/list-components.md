---
title: List Components
---

## Installation

```bash
npm install @semapps/list-components --save
```

## Components

### ChipList

Display the data in Material-UI [Chip](https://v4.mui.com/components/chips/) components.

```jsx
import { Show, SimpleShowLayout, ReferenceArrayField } from 'react-admin';
import { ChipList } from '@semapps/list-components';

const PersonShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
        <ReferenceArrayField reference="Topic" source="interestedBy">
          <ChipList primaryText="label" linkType="show" />
        </ReferenceArrayField>
    </SimpleShowLayout>
  </Show>
);
```

| Property        | Type                    | Default      | Description                                                                                                                                         |
|-----------------|-------------------------|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| `primaryText`   | `Function` or `String`  | **required** | A function which takes a record and returns a label, or the property to use                                                                         |
| `linkType`      | `String`                | "edit"       | What kind of link to use. Available options: "show" or "edit"                                                                                       |
| `appendLink`    | `Function`              |              | If passed, will display a + icon if the user has a `acl:Append` right on the resource. Used by [QuickAppendReferenceArrayField](field-components.md) |
| `externalLinks` | `Boolean` or `Function` | false        | If true (or if the function, which receives the record, returns true or an URL), will use an external link with a corresponding icon                |


### GridList

Display the data in a Material-UI [Grid](https://v4.mui.com/components/grid/).

```jsx
import { Show, SimpleShowLayout, ReferenceArrayField } from 'react-admin';
import { GridList } from '@semapps/list-components';
import { AvatarWithLabelField } from '@semapps/field-components';

const PersonShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
        <ReferenceArrayField reference="Person" source="friendOf">
          <GridList xs={6} sm={4} md={2} linkType="show">
            <AvatarWithLabelField image="image" label="label" />
          </GridList>
        </ReferenceArrayField>
    </SimpleShowLayout>
  </Show>
);
```

| Property        | Type                    | Default | Description                                                                                                                                                 |
|-----------------|-------------------------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `linkType`      | `String`                | "edit"  | What kind of link to use. Available options: "show" or "edit"                                                                                               |
| `externalLinks` | `Boolean` or `Function` | false   | If true (or if the function, which receives the record, returns true or an URL), will use an external link and pass the `externalLink` prop to its children |
| `xs`            | `Number`                | 6       | Passed to the grid items                                                                                                                                    |
| `sm`            | `Number`                |         | Passed to the grid items                                                                                                                                    |
| `md`            | `Number`                |         | Passed to the grid items                                                                                                                                    |
| `lg`            | `Number`                |         | Passed to the grid items                                                                                                                                    |
| `xl`            | `Number`                |         | Passed to the grid items                                                                                                                                    |
| `spacing`       | `Number`                | 3       | Passed to the grid container                                                                                                                                |

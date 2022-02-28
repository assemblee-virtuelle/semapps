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

| Property      | Type                   | Default | Description                                                                                                                                          |
|---------------|------------------------| ------ |------------------------------------------------------------------------------------------------------------------------------------------------------|
| `primaryText` | `Function` or `String` | **required** | A function which takes a record and returns a label, or the property to use                                                                          |
| `linkType`    | `String`               | "edit" | What kind of link to use. Available options: "show" or "edit"                                                                                        |
| `appendLink`  | `Function`             |  | If passed, will display a + icon if the user has a `acl:Append` right on the resource. Used by [QuickAppendReferenceArrayField](field-components.md) |

---
title: Field Components
---

New [React-Admin fields](https://marmelab.com/react-admin/Fields.html) to be used in SemApps projects.

## Installation

```bash
npm install @semapps/field-components --save
```

## Components

### AvatarWithLabelField

Same as React-Admin [ReferenceArrayField](https://marmelab.com/react-admin/Fields.html#referencearrayfield) but, if the user has a `acl:Append` right on the resource, he will have the possibility to add a new relationship through a modal.

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

| Property       | Type                   | Default      | Description                                                                          |
|----------------|------------------------|--------------|--------------------------------------------------------------------------------------|
| `label`        | `Function` or `String` | **required** | A function which takes a record and returns a label, or the property to use          |
| `image`        | `Function` or `String` | **required** | A function which takes a record and returns an image, or the property to use         |
| `defaultLabel` | `String`               |              | Default label used if label is empty                                                 |
| `fallback`     | `Function` or `String` |              | A function which takes a record and returns a fallback image, or the property to use |
| `externalLink` | `Boolean`              | false        | If true, will display an icon next to the label showing this is an external link     |


### ImageField

To be used with React-Admin [ImageInput](https://marmelab.com/react-admin/doc/3.19/Inputs.html#imageinput) because the
official React-Admin [ImageField](https://marmelab.com/react-admin/doc/3.19/Fields.html#imagefield) expects an object 
while uploads handled through SemApps return only an URL.

```jsx
<ImageInput source="image" accept="image/*">
  <ImageField source="src" />
</ImageInput>
```


### QuickAppendReferenceArrayField

Same as React-Admin [ReferenceArrayField](https://marmelab.com/react-admin/Fields.html#referencearrayfield) but, if the user has a `acl:Append` right on the resource, he will have the possibility to add a new relationship through a modal.

```jsx
import { Show, SimpleShowLayout } from 'react-admin';
import { QuickAppendReferenceArrayField } from '@semapps/field-components';
import { ChipList } from '@semapps/list-components';

const PersonShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
        <QuickAppendReferenceArrayField reference="Topic" source="interestedBy">
          <ChipList primaryText="label" linkType="show" />
        </QuickAppendReferenceArrayField>
    </SimpleShowLayout>
  </Show>
);
```

> Note: If the user has a `acl:Append` right, this component pass a `appendLink` to its child. The child is responsible for displaying the link. Currently only the [ChipList](list-components.md) component display such a link (through a + icon), but you can create your own list component.


### ReferenceArrayField

Same as React-Admin [ReferenceArrayField](https://marmelab.com/react-admin/Fields.html#referencearrayfield) but, if there
is a single value, transform the string into an array. Also, if the value is dereferenced, only keep it's `@id`.


### ReferenceField

Same as React-Admin [ReferenceArrayField](https://marmelab.com/react-admin/Fields.html#referencearrayfield) but, if the 
value is dereferenced, only keep it's `@id`.


### SeparatedListField

Displays a list of resources separated by a comma or another string of choice.

```jsx
<ReferenceArrayField reference="Project" source="hasTopic">
  <SeparatedListField>
    <TextField source="label" />
  </SeparatedListField>
</ReferenceArrayField>
```

| Property       | Type                  | Default | Description                                         |
|----------------|-----------------------|---------|-----------------------------------------------------|
| `separator`    | `String`              | ", "    | The string used to separate the resources           |
| `link`         | `String` or `Boolean` | "edit"  | "edit" or "show" to show a link, `false` otherwise. |

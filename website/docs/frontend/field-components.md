---
title: Field Components
---

New [React-Admin fields](https://marmelab.com/react-admin/Fields.html) to be used in SemApps projects.

## Installation

```bash
npm install @semapps/field-components --save
```

## Components

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

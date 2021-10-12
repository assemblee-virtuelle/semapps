---
title: Markdown Components
---

## Installation

```bash
npm install @semapps/markdown-components
```

You will also need to add this CSS file:

```html
<link rel="stylesheet" href="https://unpkg.com/react-mde@11.5.0/lib/styles/css/react-mde-all.css" />
```

## Components

### MarkdownInput

This component allows you to enter Markdown content and preview it, using the [React-mde](https://github.com/andrerpena/react-mde) editor.

```jsx
import { Create, SimpleForm, TextInput } from 'react-admin';
import { MarkdownInput } from '@semapps/markdown-components';

export const MyCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="title" fullWidth />
      <MarkdownInput source="description" fullWidth />
    </SimpleForm>
  </Create>
);
```

Please see [React-mde documentation](https://github.com/andrerpena/react-mde#react-mde-props) to know what other props can be passed.

### MarkdownField

This component allows you to display Markdown content in HTML. It uses the [markdown-to-jsx](https://github.com/probablyup/markdown-to-jsx) package.

```jsx
import { Show, SimpleShowLayout, TextField } from 'react-admin';
import { MarkdownField } from '@semapps/markdown-components';

export const MyShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="title" />
      <MapField source="description" />
    </SimpleShowLayout>
  </Show>
);
```

Any other props are passed down to markdown-to-jsx [options](https://github.com/probablyup/markdown-to-jsx#parsing-options).

#### Rendering React components

By default, all top-level titles (`#`) are converted to `<LargeLabel>`.

You can change this by passing an [overrides](https://github.com/probablyup/markdown-to-jsx#optionsoverrides---override-any-html-tags-representation) props.

You can also [render arbitrary React components](https://github.com/probablyup/markdown-to-jsx#optionsoverrides---rendering-arbitrary-react-components) this way. All you need to do is pass the component definition.

```jsx
import { Show, SimpleShowLayout, TextField } from 'react-admin';
import { MarkdownField } from '@semapps/markdown-components';

const SayHello = ({ who }) => ( <b>Hello {who} !</b> );

export const MyShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="title" />
      <MapField source="description" overrides={{ SayHello }} />
    </SimpleShowLayout>
  </Show>
);
```

Now if, in your Markdown document, you enter `<SayHello who="World" >`, it will render as `<b>Hello World !</b>`.

## Hooks

### useLoadLinks

This hook allows you to easily use [React-mde suggestions](https://github.com/andrerpena/react-mde) to search for links to add to other resources.

```jsx
import { Create, SimpleForm, TextInput } from 'react-admin';
import { MarkdownInput } from '@semapps/markdown-components';

export const MyCreate = (props) => {
  const loadLinks = useLoadLinks('Page', 'title');
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput source="title" fullWidth />
        <MarkdownInput source="description" loadSuggestions={loadLinks} suggestionTriggerCharacters="[" />
      </SimpleForm>
    </Create>
  );
}
```

It takes 2 parameters:
- The type of resource to search (using React-Admin data provider)
- The field to use to display the title of the resource

> At the moment it is only possible to search for a single type of resource.

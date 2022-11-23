---
title: ActivityPub Components
---

## Installation

```bash
npm install @semapps/activitypub-components
```

## Components

### CollectionList

Load an [ActivityStreams Collection](https://www.w3.org/TR/activitystreams-core/#collections) from its URL and display it in a list of type `Datagrid`, `SimpleList`, etc.

```jsx
import { Show, SimpleList } from 'react-admin';
import { CollectionList } from '@semapps/activitypub-components';

export const MyPage = (props) => (
  <div>
    <CollectionList collectionUrl="http://localhost:3000/alice/followers" resource="Actor">
      <SimpleList primaryText="name" />
    </CollectionList>
  </div>
);
```

### CommentsField

Display a form to attach comments to the current resource, as well as the list of existing comments (located in the `replies` collection). A comment is an ActivityPub `Note` and it is linked to the original resource with the `inReplyOf` property.

```jsx
import { Show, SimpleShowLayout } from 'react-admin';
import { CommentsField } from '@semapps/activitypub-components';

const DocumentShow = props => {
  const mentions = useMentions('Person');
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <CommentsField
          userResource="Person"
          mentions={mentions}
        />
      </SimpleShowLayout>
    </Show>
  );
}
```

| Property       | Type     | Default        | Description                                                                                                        |
|----------------|----------|----------------|--------------------------------------------------------------------------------------------------------------------|
| `userResource` | `String` | **required**   | React-Admin resource ID for users                                                                                  |
| `label`        | `String` | "Commentaires" | The label to use for the field                                                                                     |
| `mentions`     | `Object` |                | A tiptap [suggestion](https://tiptap.dev/api/utilities/suggestion) object. If present, it allows to mention users. |

> To display the users' avatars, the `fieldsMapping.image` property must be defined in the data model of the user resource.

### ReferenceCollectionField

This component can be used like React-Admin [ReferenceField](https://marmelab.com/react-admin/Fields.html#referencefield). It fetches the collection associated with a resource, and display it in a list. Internally, it uses the CollectionList component.

```jsx
import { Show, SimpleList } from 'react-admin';
import { ReferenceCollectionField } from '@semapps/activitypub-components';

export const ActorShow = (props) => (
  <Show {...props}>
    <SimpleForm>
      <ReferenceCollectionField reference="Actor" source="followers">
        <SimpleList primaryText="name" />
      </ReferenceCollectionField>
    </SimpleForm>
  </Show>
);
```

## Hooks

### useCollection

This hook allows you to load data from an [ActivityStreams Collection](https://www.w3.org/TR/activitystreams-core/#collections).

It takes as a parameter a full URL or a predicate. In the latter case, it will look for the properties of the logged-in actor. Typically, you could use `useCollection("followers")` to get the list of followers of the logged-in actor.

```jsx
const {
  items, // an array listing the items of the collection
  loaded, // boolean that is false until the data is available
  loading, // boolean that is true on mount, and false once the data was fetched
  error, // error message if there was an error loading the collection
  refetch, // a callback to refresh the data
  url, // url of the loaded collection (useful if only a predicate was passed)
} = useCollection("http://localhost:3000/alice/followers");
```

### useInbox

This hook allows you to fetch activities from the logged-in user's inbox.

```jsx
import { useEffect } from 'react';
import { useInbox } from '@semapps/activitypub-components';

export const MyPage = (props) => {
  const inbox = useInbox();
  useEffect(() => {
    inbox.fetch().then(activities => console.log(activities))
  }, [inbox]);
  return null;
};
```

### useOutbox

This hook allows you to fetch activities from the logged-in user's outbox, and also to post new activities.

```jsx
import { useEffect, useCallback } from 'react';
import { useOutbox, ACTIVITY_TYPES } from '@semapps/activitypub-components';

export const MyPage = (props) => {
  const outbox = useOutbox();
  
  useEffect(() => {
    outbox.fetch().then(activities => console.log(activities))
  }, [outbox]);
  
  const follow = useCallback(actorUrl => {
    outbox.post({
      type: ACTIVITY_TYPES.FOLLOW,
      actor: outbox.owner,
      object: actorUrl,
      to: actorUrl,
    });
  }, [outbox]);
  
  return (
    <button onClick={() => follow("http://localhost:3000/alice")}>
      Follow Alice
    </button>
  );
};
```

### useWebfinger

This hook allows you to get an actor URL from its Webfinger account

```jsx
import { useCallback } from 'react';
import { useWebfinger } from '@semapps/activitypub-components';

export const MyPage = (props) => {
  const webfinger = useWebfinger();

  const showActorUrl = useCallback(actorAccount => {
    webfinger.fetch(actorAccount).then(actorUrl => alert(actorUrl));
  }, [webfinger]);

  return (
    <button onClick={() => showActorUrl("@alice@localhost:3000")}>
      Show Alice URL
    </button>
  );
};
```

### useMentions

Returns a tiptap [suggestion](https://tiptap.dev/api/utilities/suggestion) object, allowing to mention users.

See the `CommentsField` component above for an example.

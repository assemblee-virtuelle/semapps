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

export const MyPage = props => (
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
        <CommentsField userResource="Person" mentions={mentions} />
      </SimpleShowLayout>
    </Show>
  );
};
```

| Property       | Type     | Default                                  | Description                                                                                                        |
| -------------- | -------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `userResource` | `String` | **required**                             | React-Admin resource ID for users                                                                                  |
| `label`        | `String` | "Commentaires"                           | The label to use for the field                                                                                     |
| `placeholder`  | `String` | "Commencez à taper votre commentaire..." | A placeholder to show before the user starts typing text.                                                          |
| `mentions`     | `Object` |                                          | A tiptap [suggestion](https://tiptap.dev/api/utilities/suggestion) object. If present, it allows to mention users. |

> To display the users' avatars, the `fieldsMapping.image` property must be defined in the data model of the user resource.

### ReferenceCollectionField

This component can be used like React-Admin [ReferenceField](https://marmelab.com/react-admin/Fields.html#referencefield). It fetches the collection associated with a resource, and display it in a list. Internally, it uses the CollectionList component.

```jsx
import { Show, SimpleList } from 'react-admin';
import { ReferenceCollectionField } from '@semapps/activitypub-components';

export const ActorShow = props => (
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

As first parameter, it takes a full URL or a predicate. In the latter case, it will look for the properties of the logged-in actor. Typically, you could use `useCollection("followers")` to get the list of followers of the logged-in actor. The second parameter is an options object. See below for the supported options.

```jsx
const {
  items, // An array listing the items of the collection.
  totalItems, // The total number of items in the collection.
  refetch, // A callback to refresh the data
  url, // url of the loaded collection (useful if only a predicate was passed)
  error, // List of all errors that occurred while fetching the collection and its items or undefined.
  fetchNextPage, // Callback to fetch the next items in the collection.
  hasNextPage, // Boolean indicating, if the items list is complete or if there are more items retrievable.
  isLoading, // True, if items or a page is loading.
  isFetching, // True, if items or a page is being fetched.
  isFetchingNextPage, // True, if the next page is being fetched.
  url: collectionUrl, // The URL of the collection
  hasLiveUpdates, // Object with the status of the WebSocket connection ('connected', 'closed', 'error') and eventually the error
  webSocketRef, // A React reference to the WebSocket object. It may not be initialized yet.
  awaitWebSocketConnection // Async function that waits for the WebSocket connection to be established. Returns the WebSocket ref.
} = useCollection('http://localhost:3000/alice/followers', { dereferenceItems: false, liveUpdates: true });
```

#### `options` parameter

- `dereferenceItems: boolean` Set to true, to force dereferencing of collection items. Note that items may be returned as object, if the server dereferences the items itself.
- `liveUpdates: boolean` Set to true, to ask the server to notify the client of updates to the collection using a Solid Notifications WebSocket Channel. The hook will automatically trigger in those cases. No updates will be provided, if the server does not support the protocol.

### useInbox

Use the `useCollection` hook and return the same data. Also return a `awaitActivity` method, that can be used to wait for a certain activity to be received in the inbox.

```jsx
import { useEffect } from 'react';
import { useInbox } from '@semapps/activitypub-components';

export const FollowDetectionPage = props => {
  const inbox = useInbox();

  const onClick = useCallback(async () => {
    const followActivity = await inbox.awaitActivity(a => a.type === 'Follow');
    console.log(`Follow activity received from ${followActivity.actor} !`);
  }, [inbox]);

  return <button onClick={onClick}>Wait for follow</button>;
};
```

### useOutbox

Works the same way as the `useInbox` hook, but for the logged user's outbox. It adds a `post` method that can be used to post a new activity in the user's outbox.

```jsx
import { useEffect, useCallback } from 'react';
import { useOutbox, ACTIVITY_TYPES } from '@semapps/activitypub-components';

export const FollowDetectionPage = props => {
  const outbox = useOutbox();

  useEffect(() => {
    outbox
      .awaitActivity(a => a.type === 'Follow')
      .then(followActivity => {
        console.log(`Follow activity sent to ${followActivity.to} !`);
      });
  }, [outbox]);

  const follow = useCallback(
    actorUrl => {
      outbox.post({
        type: ACTIVITY_TYPES.FOLLOW,
        actor: outbox.owner,
        object: actorUrl,
        to: actorUrl
      });
    },
    [outbox]
  );

  return <button onClick={() => follow('http://localhost:3000/alice')}>Follow Alice</button>;
};
```

### useNodeinfo

This hook allows you to get the [nodeinfo](https://nodeinfo.diaspora.software) schema of an instance.

```jsx
import { useNodeinfo } from '@semapps/activitypub-components';

export const MyComponent = () => {
  const nodeinfo = useNodeinfo('mastodon.social');
  console.log('Nodeinfo schema: ', nodeinfo);
  return null;
};
```

> You can pass as a second argument the `rel` you want to fetch. By default, it is `http://nodeinfo.diaspora.software/ns/schema/2.1`.

### useWebfinger

This hook allows you to get an actor URL from its [Webfinger](https://en.wikipedia.org/wiki/WebFinger) account

```jsx
import { useCallback } from 'react';
import { useWebfinger } from '@semapps/activitypub-components';

export const MyPage = props => {
  const webfinger = useWebfinger();

  const showActorUrl = useCallback(
    actorAccount => {
      webfinger.fetch(actorAccount).then(actorUrl => alert(actorUrl));
    },
    [webfinger]
  );

  return <button onClick={() => showActorUrl('@alice@localhost:3000')}>Show Alice URL</button>;
};
```

### useMentions

Returns a tiptap [suggestion](https://tiptap.dev/api/utilities/suggestion) object, allowing to mention users.

See the `CommentsField` component above for an example.

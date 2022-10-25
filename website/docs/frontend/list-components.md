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


### MasonryList

Display the data in a masonry-type list, using [react-masonry-css](https://github.com/paulcollett/react-masonry-css).

```js
import { List } from 'react-admin';
import { MasonryList } from '@semapps/list-components';

const ProjectsList = props => (
  <List {...props}>
    <MasonryList
      image={record => record.image}
      content={record => (
        <>
          <Typography variant="subtitle1">{record.title}</Typography>
          <Typography variant="body2" color="textSecondary" component="p">{record.description}</Typography>
        </>
      )}
      linkType="show"
    />
  </List>
);
```

| Property   | Type                    | Default | Description                                                                                                                                 |
|------------|-------------------------|---------|---------------------------------------------------------------------------------------------------------------------------------------------|
| `image`    | `Function` or `String`  | **required** | A function which takes a record and returns an URL, or the property to use                                                             |
| `content`  | `Function` or `String`  | **required** | A function which takes a record and returns a text, or the property to use. You can also use React elements like in the example above. |
| `linkType` | `String`                | "edit"  | What kind of link to use. Available options: "show" or "edit"                                                                               |


### MultiViewsList

Allow to switch between various views of the same data.

```js
import { SimpleList } from 'react-admin';
import { MultiViewsList } from '@semapps/archipelago-layout';
import { MapList } from '@semapps/geo-components';
import MapIcon from '@material-ui/icons/Map';
import ListIcon from '@material-ui/icons/List';

const PersonList = props => (
  <MultiViewsList
    views={{
      list: {
        label: 'List',
        icon: ListIcon,
        sort: { field: 'label', order: 'ASC' },
        perPage: 25,
        list: (
          <SimpleList
            primaryText="label"
            secondaryText="description"
          />
        )
      },
      map: {
        label: 'Map',
        icon: MapIcon,
        perPage: 500,
        pagination: false,
        list: (
          <MapList
            latitude="latitude"
            longitude="longitude"
            label="label"
            description="description"
          />
        )
      }
    }}
    {...props}
  />
);
```

| Property        | Type        | Default                    | Description                                                                         |
|-----------------|-------------|----------------------------|-------------------------------------------------------------------------------------|
| `views`         | `Object`    | **required**               | List of views. See above for the expected format.                                   |
| `ListComponent` | `Element`   | `List`                     | The top-level List component to use. Default to React-Admin default List component. |
| `actions`       | `Component` | `<ListActionsWithViews />` | Actions to show in addition to the buttons to switch between views.                 |

> Note: if you wish to include the buttons to switch views in another `actions` component, use the `ViewsButtons` component also exported from this package. 

### ReferenceFilter

List resources linked to the list, and allow to filter them. To be used inside a [aside component](https://marmelab.com/react-admin/doc/3.19/List.html#aside-aside-component)

```js
const FilterAside = () => (
  <Card>
    <CardContent>
      <FilterLiveSearch source="label" />
      <ReferenceFilter reference="Topic" source="hasTopic" inverseSource="topicOf" />
    </CardContent>
  </Card>
);
```

| Property        | Type      | Default           | Description                                                                                                                           |
|-----------------|-----------|-------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| `reference`     | `String`  | **required**      | ID of the resource being referenced                                                                                                   |
| `source`        | `String`  | **required**      | Predicate on the main list which match this reference.                                                                                |
| `inverseSource` | `String`  |                   | Inverse predicate. Allow to display only elements with matching resources.                                                            |
| `sort`          | `String`  |                   | Sort results. Same format as lists [sort](https://marmelab.com/react-admin/doc/3.19/List.html#sort-default-sort-field--order) option. |
| `filter`        | `String`  |                   | Filter results. Same format as lists [filter](https://marmelab.com/react-admin/doc/3.19/List.html#filter-permanent-filter) option.    |
| `limit`         | `Number`  | 25                | Limit the number of results.                                                                                                          |
| `label`         | `String`  | Reference's label | Label to show at the top of the list.                                                                                                 |
| `icon`          | `Element` | Reference's icon  | Icon to show next to the label.                                                                                                       |
| `showCounters`  | `Boolean` | true              | If true, will display a counter next to each result.                                                                                  |

---
title: Geo Components
---

## Installation

In addition to this component, you need to install `leaflet`, `leaflet-defaulticon-compatibility` and `leaflet.markercluster`

```bash
npm install @semapps/geo-components leaflet@^1.8.0 leaflet-defaulticon-compatibility@0.1.1 leaflet.markercluster@^1.5.3
```

You must also include the following CSS files:

```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css" crossorigin="" />
<link rel="stylesheet" href="https://unpkg.com/leaflet-defaulticon-compatibility@0.1.1/dist/leaflet-defaulticon-compatibility.css" />
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css" />
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css" />
```

## Components

### MapList

This component displays a map with a number of geolocalized ressources. It works just like React-Admin official [list components](https://marmelab.com/react-admin/List.html).

```jsx
import { List } from 'react-admin';
import { MapList } from '@semapps/geo-components';

const MyList = props => (
  <List pagination={false} perPage={1000} {...props}>
    <MapList
      latitude={record => record.latitude}
      longitude={record => record.longitude}
      label={record => record.label}
      description={record => record.description}
    />
  </List>
);
```

> Note: For a map display, you will usually disable the pagination and display all the available data.

If you prefer to use a custom popup, you can use the `popupContent` prop (and ignore the `label` and `description` properties):

```jsx
import { List, ShowButton } from 'react-admin';
import { MapList } from '@semapps/geo-components';

const MyList = props => (
  <List pagination={false} perPage={1000} {...props}>
    <MapList
      latitude={record => record.latitude}
      longitude={record => record.longitude}
      popupContent={({ record, basePath }) => (
        <>
          <h1>{record.title}</h1>
          <ShowButton basePath={basePath} record={record} />
        </>
      )}
    />
  </List>
);
```

| Property         | Type              | Default      | Description                                                                                                                             |
|------------------|-------------------|--------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| `latitude`       | `Function`        | **required** | A function which takes a record and returns a latitude                                                                                  |
| `longitude`      | `Function`        | **required** | A function which takes a record and returns a longitude                                                                                 |
| `label`          | `Function`        |              | A function which takes a record and returns a label to be displayed in the popup. This is not used if `popupContent` is provided.       |
| `description`    | `Function`        |              | A function which takes a record and returns a description to be displayed in the popup. This is not used if `popupContent` is provided. |
| `popupContent`   | `React Component` |              | A React component to customize the content of the popup (see above)                                                                     |
| `height`         | `Number`          | 700          | The height in pixel of the map                                                                                                          |
| `groupClusters`  | `Boolean`         | true         | If true, markers which are close will be grouped in a cluster.                                                                          |
| `boundToMarkers` | `Boolean`         | false        | If true, center the map around the markers.                                                                                             |
| `connectMarkers` | `Boolean`         | false        | If true, trace lines between the markers. The order depends on the list parameters                                                      |

You can also provide all the options of [LeafletJS Map](https://leafletjs.com/reference-1.7.1.html#map) (`center`, `zoom`, `scrollWheelZoom`...).


### MapField

This component allows you to display the location of a resource in a map. You just need to pass its latitude and longitude.

```jsx
import { Show, SimpleShowLayout, TextField, DateField, RichTextField } from 'react-admin';
import { MapField } from '@semapps/geo-components';

export const MyShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="title" />
      <MapField
        latitude={record => record.latitude}
        longitude={record => record.longitude}
      />
    </SimpleShowLayout>
  </Show>
);
```

| Property          | Type       | Default      | Description                                                                        |
|-------------------|------------|--------------|------------------------------------------------------------------------------------|
| `latitude`        | `Function` | **required** | A function which takes a record and returns a latitude                             |
| `longitude`       | `Function` | **required** | A function which takes a record and returns a longitude                            |
| `address`         | `Function` | **required** | A function which takes a record and returns a text to display above the map        |
| `typographyProps` | `Object`   |              | Props passed down to the Typography element used to display the text above the map |
| `height`          | `Number`   | 400          | The height in pixel of the map                                                     |

You can also provide all the options of [LeafletJS Map](https://leafletjs.com/reference-1.7.1.html#map) (`center`, `zoom`, `scrollWheelZoom`...).

### LocationInput

This component allows you to search for a geolocalized address. It uses the MapBox API to provide search results. When an address is selected, the `parse` function is called, and you can format the results as you wish.

```jsx
import { Create, SimpleForm } from 'react-admin';
import { LocationInput, extractContext } from '@semapps/geo-components';

export const MyCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <LocationInput
        source="address"
        mapboxConfig={{
          access_token: 'YOUR_MABPOX_TOKEN',
          types: ['place', 'address'],
          country: ['fr', 'be', 'ch']
          // ... any other MapBox configuration
        }}
        parse={value => ({
          label: value.place_name,
          longitude: value.center[0],
          latitude: value.center[1],
          street: value.place_type[0] === 'address' ? [value.address, value.text].join(' ') : undefined,
          zip: extractContext(value.context, 'postcode'),
          city: value.place_type[0] === 'place' ? value.text : extractContext(value.context, 'place'),
          country: extractContext(value.context, 'country')
        })}
        optionText={resource => resource.label}
      />
    </SimpleForm>
  </Create>
);
```

> The `extractContext` utility function allows you to more easily select amongst MapBox data.

| Property       | Type                   | Default      | Description                                                                                                                                                                   |
|----------------|------------------------|--------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `source`       | `String`               | **required** | Standard React-Admin prop to identify the field to be created or modified.                                                                                                    |
| `mapboxConfig` | `Object`               | **required** | Parameters to pass to the [MapBox forward geocoding API](https://docs.mapbox.com/api/search/geocoding/#forward-geocoding). The `access_token` property is required.           |
| `parse`        | `Function`             |              | A function to format a MapBox `Feature` according to your needs. You can find its properties [here](https://docs.mapbox.com/api/search/geocoding/#geocoding-response-object). |
| `optionText`   | `String` or `Function` | **required** | What property to display in the input when a resource is loaded. You can also pass a function, which takes the full record as an input and returns the label.                 |

Any other prop will be passed down to the `TextField` base component.

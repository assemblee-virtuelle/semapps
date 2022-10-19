---
title: ImageProcessorMixin
---

Process images as soon as they are uploaded, or process them all together.
Currently JPEG, PNG and WebP files are supported. They can be resized or their quality can be reduced.
Since we use the [sharp](https://sharp.pixelplumbing.com) library, many more options could be added.


## Usage

```js
const { ControlledContainerMixin, ImageProcessorMixin } = require("@semapps/ldp");

module.exports = {
  name: 'file',
  mixins: [ImageProcessorMixin, ControlledContainerMixin], // In that order
  settings: {
    path: '/files',
    acceptedTypes: ['semapps:File'],
    imageProcessor: {
      maxWidth: 1900,
      maxHeight: 1000,
      jpeg: {},
      png: {},
      webp: {}
    }
  }
}
```


### Settings

All settings relative to this mixin should be set in a `imageProcessor` key.

| Property    | Type      | Default                 | Description                                                                             |
|-------------|-----------|-------------------------|-----------------------------------------------------------------------------------------|
| `maxWidth`  | `Integer` | 1900                    | Reduce all images whose width is larger than this number                                |
| `maxHeight` | `Integer` | 1000                    | Reduce all images whose height is larger than this number                               |
| `jpeg`      | `Object`  | { quality: 85 }         | See sharp [jpeg](https://sharp.pixelplumbing.com/api-output#jpeg) for available options |
| `png`       | `Object`  | { compressionLevel: 8 } | See sharp [png](https://sharp.pixelplumbing.com/api-output#png) for available options   |
| `webp`      | `Object`  | { quality: 85 }         | See sharp [webp](https://sharp.pixelplumbing.com/api-output#webp) for available options |


### Actions

#### `processImage`

Process the given image using the settings above.

##### Parameters
| Property      | Type     | Default             | Description                                                                                 |
|---------------|----------|---------------------|---------------------------------------------------------------------------------------------|
| `resourceUri` | `Object` | **required**        | URI of the resource (must be of type `semapps:File`)                                        |


#### `processAllImages`

Process all images in the container using the settings above.

##### Parameters
| Property | Type     | Default | Description                                                        |
|----------|----------|---------|--------------------------------------------------------------------|
| `webId`  | `String` |         | In a POD provider config, this allows to define the POD to process |

# gl-shape

[![NPM version][npm-image]][npm-url]
![experimental][experimental-image]
[![js-standard-style][standard-image]][standard-url]

Create 3d shapes for use with [`stack.gl`](http://stack.gl). 

This module provides a constructor that wraps [`gl-geometry`](http://github.com/stackgl/gl-geometry) and [`gl-mat4`](http://github.com/stackgl/gl-mat4), making it simpler to create a geometry from a simplicial complex and update its transforms.

## install

```
npm install gl-shape
```

## example

Define data for your shape

```javascript
var data = {
  complex: require('bunny'),
  position: [0, 10, 20],
  scale: [1, 2, 1]
}
```

Then create it

```javascript
var shape = require('gl-shape')(data)
```

You can bind its geometry to a shader

```javascript
shape.attributes.geometry.bind(shader)
```

Use its matrices to set uniforms

```javascript
shader.uniforms.model = shape.attributes.model
```

And update its position (which updates its underlying model matrix)

```javascript
shape.position([0, 10, 0])
```

See [example.js](example.js) for a complete example of a rendered 3d shape, and call `npm start` to run it.

## usage

#### `shape = require('gl-shape')(gl, data)`

Create a shape by providing a `gl` context and shape `data`.

The following properties on `data` are required
- `complex` the simplicial complex, must have `positions` and `faces`, may also have `uvs` and `normals`. If normals are not provided, vertex normals will be computed using [`normals`](https://github.com/mikolalysenko/normals).

And the following are optional
- `position` an 3 vector with a position
- `scale` an 3 vector with a scale in each dimension or a scalar
- `rotation` an object with rotation angle `theta` and 3 vector `axis`
- `model` a 4x4 matrix for directly specifying the model matrix
- `flatten` a boolean flag that if true will convert indexed meshes to triangles for non-interpolated geometries

If `position`, `scale`, or `rotation` are specified they will be used to set the `model` matrix.

#### `shape.attributes`

All derived attributes are stored on `shape.attributes`, and include
- `geometry` the renderable geometry
- `model` the 4x4 model matrix
- `modelNormal` the normal vector for the model

#### `shape.position(vector)`

Update the position.

#### `shape.scale(vector)`

Update the scale along each dimension. Can also pass a single value.

#### `shape.rotation(angle, axis)`

Update the rotation.

[npm-image]: https://img.shields.io/badge/npm-v1.0.0-lightgray.svg?style=flat-square
[npm-url]: https://npmjs.org/package/gl-shape
[standard-image]: https://img.shields.io/badge/code%20style-standard-lightgray.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
[experimental-image]: https://img.shields.io/badge/stability-experimental-lightgray.svg?style=flat-square

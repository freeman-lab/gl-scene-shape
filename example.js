// setup a webgl context
var canvas = document.body.appendChild(document.createElement('canvas'))
var gl = require('gl-context')(canvas)
require('canvas-fit')(canvas)
gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

// create a shape
var Shape = require('./index.js')
var bunny = require('bunny')
var shape = Shape(gl, {complex: bunny, position: [0, 0, 5], flatten: true})

// create a material
var Material = require('gl-material')
var normal = require('gl-normal-material')
var material = Material(gl, normal)

// set matrices
var mat4 = require('gl-mat4')
var projection = mat4.create()
var view = mat4.lookAt(mat4.create(), [0, 15, 20], [0, 0, 0], [0, 1, 0])
mat4.perspective(projection, Math.PI / 4, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.01, 10000)

// set flags and bind shaders
gl.enable(gl.DEPTH_TEST)
shape.attributes.geometry.bind(material.shader)
material.shader.uniforms.style = {saturation: 0.75, absolute: true}
material.shader.uniforms.projection = projection
material.shader.uniforms.view = view
material.shader.uniforms.model = shape.attributes.model
material.shader.uniforms.modelNormal = shape.attributes.modelNormal
shape.attributes.geometry.draw(gl.TRIANGLES)
shape.attributes.geometry.unbind()

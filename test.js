var context = require('gl-context')
var test = require('tape')
var allclose = require('test-allclose')
var shape = require('./index.js')
var bunny = require('bunny')
var _ = require('lodash')

var canvas = document.body.appendChild(document.createElement('canvas'))
var gl = context(canvas)

test('construction', function (t) {
  var result = shape(gl, {complex: bunny, position: [0, 0, 0]})
  t.ok(result.attributes.geometry, 'geometry defined')
  t.deepEquals(result.attributes.model, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  t.deepEquals(result.attributes.modelNormal, [1, 0, 0, 0, 1, 0, 0, 0, 1])
  t.end()
})

test('position', function (t) {
  var result = shape(gl, {complex: bunny, position: [1, 2, 3]})
  allclose(t)(result.attributes.model, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 2, 3, 1])
  t.end()
})

test('scale', function (t) {
  var result = shape(gl, {complex: bunny, scale: [1, 2, 3]})
  allclose(t)(result.attributes.model, [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1])
  t.end()
})

test('rotation', function (t) {
  var result = shape(gl, {complex: bunny, rotation: {theta: Math.PI, axis: [0, 0, 1]}})
  allclose(t)(result.attributes.model, [-1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  t.end()
})

test('all', function (t) {
  var result = shape(gl, {complex: bunny, position: [1, 2, 3], scale: [1, 2, 3], rotation: {theta: Math.PI, axis: [0, 0, 1]}})
  allclose(t)(result.attributes.model, [-1, 0, 0, 0, 0, -2, 0, 0, 0, 0, 3, 0, 1, 2, 3, 1])
  t.end()
})

test('update position', function (t) {
  var result = shape(gl, {complex: bunny, position: [0, 0, 0]})
  allclose(t)(result.attributes.model, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  result.position([1, 2, 3])
  allclose(t)(result.attributes.model, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 2, 3, 1])
  t.end()
})

test('update scale', function (t) {
  var result = shape(gl, {complex: bunny, position: [0, 0, 0]})
  allclose(t)(result.attributes.model, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  result.scale([1, 2, 3])
  allclose(t)(result.attributes.model, [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1])
  t.end()
})

test('update rotation', function (t) {
  var result = shape(gl, {complex: bunny, position: [0, 0, 0]})
  allclose(t)(result.attributes.model, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  result.rotation(Math.PI, [0, 0, 1])
  allclose(t)(result.attributes.model, [-1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  t.end()
})

test('update all', function (t) {
  var result = shape(gl, {complex: bunny, position: [0, 0, 0]})
  allclose(t)(result.attributes.model, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  result.position([1, 2, 3])
  result.scale([1, 2, 3])
  result.rotation(Math.PI, [0, 0, 1])
  allclose(t)(result.attributes.model, [-1, 0, 0, 0, 0, -2, 0, 0, 0, 0, 3, 0, 1, 2, 3, 1])
  t.end()
})
var Geometry = require('gl-geometry')
var mat4 = require('gl-mat4')
var mat3 = require('gl-mat3')
var vec3 = require('gl-vec3')
var normals = require('normals')
var reindex = require('mesh-reindex')
var unindex = require('unindex-mesh')
var isnumeric = require('fast-isnumeric')
var isfunction = function(value) {return typeof value === 'function'}

module.exports = function Shape (gl, data) {
  if (!(this instanceof Shape)) return new Shape(gl, data)
  if (!gl) throw Error ("Must provide a weblgl context")
  if (!data.complex) throw Error ("Must provide a simplicial complex")
  if (typeof data.flatten === 'undefined') data.flatten = true
  var self = this

  var build = function (gl, complex) {
    var geometry = Geometry(gl)
    var flattened = data.flatten ? reindex(unindex(complex.positions, complex.cells)) : complex
    geometry.attr('position', flattened.positions)
    geometry.attr('normal', data.normals || normals.vertexNormals(flattened.cells, flattened.positions))
    geometry.faces(flattened.cells)
    if (complex.uvs) geometry.attr('uvs', complex.uvs)
    return geometry
  }

  var updateNormal = function () {
    mat3.normalFromMat4(self.attributes.modelNormal, self.attributes.model)
  }

  self.position = function (value) {
    var m = self.attributes.model
    if (isfunction(value)) value = value([m[12], m[13], m[14]])
    m[12] = value[0]
    m[13] = value[1]
    m[14] = value[2]
    updateNormal()
  }

  self.scale = function (value) {
    var m = self.attributes.model
    var x = vec3.length([m[0], m[1], m[2]])
    var y = vec3.length([m[4], m[5], m[6]])
    var z = vec3.length([m[8], m[9], m[10]])
    if (isfunction(value)) value = value([x, y, z])
    if (isnumeric(value)) value = [value, value, value]
    m[0] = (m[0] / x) * value[0]
    m[1] = (m[1] / x) * value[0]
    m[2] = (m[2] / x) * value[0]
    m[4] = (m[4] / y) * value[1]
    m[5] = (m[5] / y) * value[1]
    m[6] = (m[6] / y) * value[1]
    m[8] = (m[8] / z) * value[2]
    m[9] = (m[9] / z) * value[2]
    m[10] = (m[10] / z) * value[2]
    updateNormal()
  }

  self.rotation = function (value, axis) {
    if (!axis) axis = [0, 0, 1]
    var m = self.attributes.model
    if (isfunction(value)) value = value([m[0], m[1], m[2], m[4], m[5], m[6], m[8], m[9], m[10]])
    var x = vec3.length([m[0], m[1], m[2]])
    var y = vec3.length([m[4], m[5], m[6]])
    var z = vec3.length([m[8], m[9], m[10]])
    mat4.translate(self.attributes.model, mat4.create(), [m[12], m[13], m[14]])
    mat4.rotate(self.attributes.model, self.attributes.model, value, axis)
    mat4.scale(self.attributes.model, self.attributes.model, [x, y, z])
    updateNormal()
  }

  self.attributes = {
    geometry: build(gl, data.complex),
    model: data.model || mat4.create(),
    modelNormal: mat3.create()
  }

  if (data.position) self.position(data.position)
  if (data.scale) self.scale(data.scale)
  if (data.rotation) self.rotation(data.rotation.theta, data.rotation.axis)
}
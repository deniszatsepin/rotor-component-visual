var Component       = require('rotor-component');
var createGeometry  = require('gl-geometry');
var createTexture   = require('gl-texture2d');
var glMatrix        = require('gl-matrix');
var vec3            = glMatrix.vec3;
var mat4            = glMatrix.mat4;

var Visual = function(param) {
	Component.call(this);
  this.componentType = 'Visual';
  this.geometry = param.geometry;
  this.material = param.material;

  this.__super = Component.prototype;
};

Visual.prototype = Object.create(Component.prototype, {
  constructor: {
    configurable: true,
    enumerable: true,
    value: Visual,
    writable: true
  }
});

var proto = Visual.prototype;

proto.realize = function() {
  this._entity._scene.visual = this;
  this._graphics = this._entity._game.getServiceByType('Graphics');
  var materialInfo = this.material.materialInfo;
  this.ambientColor = vec3.fromValues.apply(vec3, materialInfo.ambient);
  this.diffuseColor = vec3.fromValues.apply(vec3, materialInfo.diffuse);
  this.specularColor = vec3.fromValues.apply(vec3, materialInfo.specular);
  var game = this._entity._game;
  var light = game.lights[0];
  this.lightAmbientColor = vec3.fromValues.apply(vec3, game.ambientColor);
  this.lightDiffuseColor = vec3.fromValues.apply(vec3, light.diffuse);
  this.lightSpecularColor = vec3.fromValues.apply(vec3, light.specular);
  this.lightPosition = vec3.fromValues.apply(vec3, light.position);

  this.texture = createTexture(this._graphics._gl, materialInfo.imageElement);

  this.__super.realize.call(this);
};

proto.isRealized = function() {
	return this._realized;
};

proto.update = function() {
  if (!this.isRealized()) return;

  this.__super.update.call(this);
};

proto.draw = function() {
  if (!this.isRealized()) return;
  var transform = this._entity._scene.transform;
  var game = this._entity._game;

  var mvMatrix = mat4.create();
  mat4.multiply(mvMatrix, game.camera.view(), transform.modelMatrix);
  var invertMatrix = mat4.create();
  mat4.invert(invertMatrix, mvMatrix);
  var nMatrix = mat4.create();
  mat4.transpose(nMatrix, invertMatrix);

  this.geometry.bind(this.material);
  this.material.attributes.aVertexPosition.location = 0;
  //shader.attributes.normal.location = 1;
  this.material.attributes.aVertexNormal.location = 1;
  this.material.attributes.aUV.location = 2;

  this.material.uniforms.uMVMatrix = mvMatrix;
  this.material.uniforms.uNMatrix = nMatrix;
  this.material.uniforms.uPMatrix = this._graphics.projectionMatrix;

  this.material.uniforms.uAmbientColor = this.lightAmbientColor;
  this.material.uniforms.uDirectionalColor = this.lightDiffuseColor;
  this.material.uniforms.uSpecularColor = this.lightSpecularColor;
  this.material.uniforms.uLightingPosition = this.lightPosition;

  this.material.uniforms.uMaterialAmbientColor = this.ambientColor;
  this.material.uniforms.uMaterialDiffuseColor = this.diffuseColor;
  this.material.uniforms.uMaterialSpecularColor = this.specularColor;

  this.material.uniforms.uTexture = this.texture.bind();
  
  this.geometry.draw();
  this.geometry.unbind();
};

module.exports = Visual;
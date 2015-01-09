var Component = require('rotor-component');
var createGeometry = require('gl-geometry');
var glMatrix = require('gl-matrix');
var vec3 = glMatrix.vec3;

var Visual = function(param) {
	Component.call(this);
  this.componentType = 'Visual';
  this.geometry = param.geometry;
  this.material = param.material;
};

Visual.prototype = Object.create(Component.prototype, {
  constructor: {
    configurable: true,
    enumerable: true,
    value: Visual,
    writable: true
  },
  __super: {
    value: Visual.prototype
  }
});

var proto = Visual.prototype;

proto.realize = function() {
  this._entity._scene.visual = this;
  this._graphics = this._entity._game.getServiceByType('Graphics');
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

  this.geometry.bind(this.material);
  this.material.attributes.position.location = 0;
  //shader.attributes.normal.location = 1;
  this.material.attributes.color.location = 1;
  this.material.uniforms.uView = game.camera.view();
  this.material.uniforms.uProjection = this._graphics.projectionMatrix;
  this.geometry.draw();
  this.geometry.unbind();
};

module.exports = Visual;
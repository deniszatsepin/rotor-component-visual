var Component = requre('rotor-component');
var createGeometry = requre('gl-geometry');
var glMatrix = requre('gl-matrix');
var vec3 = glMatrix.vec3;

var Visual = function() {
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
  this.__super.realize.call(this);
};

proto.isRealized = function() {
	return this._realized;
};

proto.update = function() {
  if (!this.isRealized()) return;

  this.__super.update.call(this);
};

module.exports = Visual;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var scene = /*#__PURE__*/function () {
  function scene(engine) {
    var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, scene);

    this.engine = engine;
    this.canvas = this.engine.canvas;
    this.gameObjects = [];
    this.layerOrder = [];
    this.layers = {};
    this.intervals = [];
    this.gameState = {};
    this.setup(args); // this.update = this.update.bind(this);
    // this.draw = this.draw.bind(this);
  }

  _createClass(scene, [{
    key: "setup",
    value: function setup(args) {// instantiate game objects here and connect their object references
      // this method is meant to be overridden, it's literally the only thing that needs to change besides like name
    }
  }, {
    key: "switchScene",
    value: function switchScene(scene, args) {
      for (var i = 0; i < this.intervals.length; i++) {
        clearInterval(this.intervals[i]);
      }

      this.engine.switchScene(scene, args);
    }
  }, {
    key: "update",
    value: function update(delta) {
      for (var i = 0; i < this.gameObjects.length; i++) {
        this.gameObjects[i].update(delta);
      }
    }
  }, {
    key: "draw",
    value: function draw(interpolationPercentage) {
      var curLayer;

      for (var i = 0; i < this.layerOrder.length; i++) {
        curLayer = this.layers[this.layerOrder[i]];

        for (var j = 0; j < curLayer.length; j++) {
          curLayer[j].draw(interpolationPercentage);
        }
      }
    }
  }, {
    key: "updateSocket",
    value: function updateSocket() {// overwrite with socket messaging processing here
    }
  }, {
    key: "connectPlayer",
    value: function connectPlayer(socket, username) {// overwrite with connect player logic here
    }
  }]);

  return scene;
}();

var _default = scene; // try {
// 	module.exports = scene;
// } catch (err) {
// 	console.log('scene export failed');
// }

exports["default"] = _default;
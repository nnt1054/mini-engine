"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var gameObject = /*#__PURE__*/function () {
  function gameObject(scene) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, gameObject);

    this.scene = scene; // need this for object hiearchy

    if (parent) {
      this.parent = parent;
    } else {
      this.parent = scene;
    }

    this.update = this.update.bind(this);
    this.draw = this.draw.bind(this);
    this._isClicked = false;
  }

  _createClass(gameObject, [{
    key: "update",
    value: function update(delta) {
      console.log('update should be overridden');
    }
  }, {
    key: "draw",
    value: function draw(interpolationPercentage) {
      console.log('update should be overridden');
    }
  }, {
    key: "createAABB",
    value: function createAABB(width, height) {
      var x = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var y = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var parent = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      return new AABB(width, height, x, y, parent);
    }
  }, {
    key: "allowClickDetection",
    value: function allowClickDetection(aabb) {
      this._isClicked = false;
      this._isClickTarget = this.scene.clickTarget === this;

      if ('mousedown' in this.scene.engine.mouseEvents) {
        if (this.pointInAABB(this.scene.engine.mouseEvents['mousedown'], aabb)) {
          this.scene.clickTarget = this;
          this.clickOffsetLeft = this.getMousePos().x - this.clickAABB.min.x;
          this.clickOffsetTop = this.getMousePos().y - this.clickAABB.min.y;
        }
      }

      if ('mouseup' in this.scene.engine.mouseEvents) {
        if (this.scene.clickTarget === this) {
          if (this.pointInAABB(this.scene.engine.mouseEvents['mouseup'], aabb)) {
            this._isClicked = true;
          }

          this.scene.clickTarget = null;
        }
      }
    }
  }, {
    key: "isClicked",
    value: function isClicked() {
      return this._isClicked;
    }
  }, {
    key: "isClickTarget",
    value: function isClickTarget() {
      return this._isClickTarget;
    }
  }, {
    key: "getMousePos",
    value: function getMousePos() {
      return this.scene.engine.mousePos;
    }
  }, {
    key: "pointInAABB",
    value: function pointInAABB(point, aabb) {
      return point.x > aabb.min.x && point.x < aabb.max.x && point.y > aabb.min.y && point.y < aabb.max.y;
    }
  }]);

  return gameObject;
}();

var AABB = /*#__PURE__*/function () {
  function AABB(width, height) {
    var x = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var y = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var parent = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

    _classCallCheck(this, AABB);

    this.parent = parent;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.lastPos = {
      'x': x,
      'y': y
    };
    this.anchor = null;
    this.anchorPos = {
      'x': 0,
      'y': 0
    };
    this.anchorees = [];
    this.foundCollisions = [];
  }

  _createClass(AABB, [{
    key: "setPos",
    value: function setPos() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (x) {
        this.lastPos.x = this.x;
        this.x = x;
      }

      if (y) {
        this.lastPos.y = this.y;
        this.y = y;
      }

      this.updateAnchorees();
    } // Called once at the beginning;

  }, {
    key: "setAnchor",
    value: function setAnchor(aabb) {
      this.anchor = aabb;
      this.anchorPos = aabb.canvasPos;
      aabb.anchorees.push(this);
    }
  }, {
    key: "setAnchorPos",
    value: function setAnchorPos(pos) {
      this.anchorPos = pos;
      this.updateAnchorees();
    }
  }, {
    key: "updateAnchorees",
    value: function updateAnchorees() {
      // if anchor position changed, update positions of anchorees
      for (var i = 0; i < this.anchorees.length; i++) {
        this.anchorees[i].setAnchorPos(this.canvasPos);
      }
    }
  }, {
    key: "checkCollision",
    value: function checkCollision(aabb) {
      if (this.max.x <= aabb.min.x || this.min.x >= aabb.max.x) {
        return false;
      } else if (this.max.y <= aabb.min.y || this.min.y >= aabb.max.y) {
        return false;
      } else {
        return true;
      }
    }
  }, {
    key: "checkCollisions",
    value: function checkCollisions(aabbList) {
      var collisions = [];

      for (var i = 0; i < aabbList.length; i++) {
        if (aabbList[i] == this) {
          continue;
        }

        if (this.checkCollision(aabbList[i])) {
          collisions.push(aabbList[i]);
        }
      }

      return collisions;
    } // Following Functions Assume Collision Exists with AABB

  }, {
    key: "ifLeftCollision",
    value: function ifLeftCollision(aabb) {
      return this.max.x > aabb.max.x;
    }
  }, {
    key: "ifLeftCollisionOnly",
    value: function ifLeftCollisionOnly(aabb) {
      return this.max.x > aabb.max.x && this.min.x > aabb.min.x;
    }
  }, {
    key: "ifRightCollision",
    value: function ifRightCollision(aabb) {
      return this.min.x < aabb.min.x;
    }
  }, {
    key: "ifRightCollisionOnly",
    value: function ifRightCollisionOnly(aabb) {
      return this.min.x < aabb.min.x && this.max.x < aabb.max.x;
    }
  }, {
    key: "ifTopCollision",
    value: function ifTopCollision(aabb) {
      return this.max.y > aabb.max.y;
    }
  }, {
    key: "ifTopCollisionOnly",
    value: function ifTopCollisionOnly(aabb) {
      return this.max.y > aabb.max.y && this.min.y > aabb.min.y;
    }
  }, {
    key: "ifBottomCollision",
    value: function ifBottomCollision(aabb) {
      return this.min.y < aabb.min.y;
    }
  }, {
    key: "ifBottomCollisionOnly",
    value: function ifBottomCollisionOnly(aabb) {
      return this.max.y < aabb.max.y && this.min.y < aabb.min.y;
    }
  }, {
    key: "min",
    get: function get() {
      return {
        'x': this.x,
        'y': this.y
      };
    }
  }, {
    key: "max",
    get: function get() {
      return {
        'x': this.x + this.width,
        'y': this.y + this.height
      };
    }
  }, {
    key: "canvasPos",
    get: function get() {
      return {
        'x': this.x + this.anchorPos.x,
        'y': this.y + this.anchorPos.y
      };
    }
  }]);

  return AABB;
}();

var _default = gameObject; // try {
//   	module.exports = gameObject;
// } catch (err) {
// 	  console.log('gameObject export failed');
// }

exports["default"] = _default;
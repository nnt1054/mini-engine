"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MainLoop = require('mainloop.js');

var engine = /*#__PURE__*/function () {
  function engine(sceneList, initScene) {
    var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.MODE_CLIENT;
    var config = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _classCallCheck(this, engine);

    this.sceneList = sceneList;
    this.currentScene = new this.sceneList[initScene](this, config.sceneConfig);
    this.nextScene = null;
    this.locals = {};
    this.mode = mode;

    if (this.mode == engine.MODE_CLIENT) {
      window.engine = this; //might want to change this later

      this.createCanvas();
    }

    this.update = this.update.bind(this);
    this.draw = this.draw.bind(this);
    this.begin = this.begin.bind(this);
    this.end = this.end.bind(this);
  }

  _createClass(engine, [{
    key: "createCanvas",
    value: function createCanvas() {
      // create Canvas and Initial Game Objects 
      this.canvas = document.getElementById('canvas'), this.context = this.canvas.getContext('2d'), this.fpsCounter = document.getElementById('fpscounter'), this.fpsValue = document.getElementById('fpsvalue'); // this.canvas.width = window.innerWidth;
      // this.canvas.height = window.innerHeight;

      this.canvas.width = 800;
      this.canvas.height = 400; // MOUSE INPUT PROCESSOR

      this.mouseEvents = {};
      this.canvas.addEventListener('click', function (event) {
        window.engine.mouseEvents['click'] = {
          'x': event.x - event.target.offsetLeft,
          'y': event.y - event.target.offsetTop
        };
      }, false);
      this.canvas.addEventListener('dblclick', function (event) {
        window.engine.mouseEvents['dblclick'] = {
          'x': event.x - event.target.offsetLeft,
          'y': event.y - event.target.offsetTop
        };
      }, false);
      this.canvas.addEventListener('mousemove', function (event) {
        window.engine.mouseEvents['mousemove'] = {
          'x': event.x - event.target.offsetLeft,
          'y': event.y - event.target.offsetTop
        };
        window.engine.mousePos = window.engine.mouseEvents['mousemove'];
      }, false);
      this.canvas.addEventListener('mousedown', function (event) {
        window.engine.mouseEvents['mousedown'] = {
          'x': event.x - event.target.offsetLeft,
          'y': event.y - event.target.offsetTop
        };
      }, false);
      this.canvas.addEventListener("contextmenu", function (event) {
        event.preventDefault();
      }, false);
      document.addEventListener('mouseup', function (event) {
        window.engine.mouseEvents['mouseup'] = {
          'x': event.x - event.target.offsetLeft,
          'y': event.y - event.target.offsetTop
        };
      }, false); // KEYBOARD INPUT PROCESSOR

      this.keyState = {};
      this.keyPress = {};
      document.addEventListener("keydown", function (event) {
        if (!(event.keyCode in window.engine.keyState)) {
          window.engine.keyState[event.keyCode] = 0;
        }
      });
      document.addEventListener("keyup", function (event) {
        window.engine.keyPress[event.keyCode] = window.engine.keyState[event.keyCode];
        delete window.engine.keyState[event.keyCode];
      });
      document.addEventListener("blur", function (event) {
        window.engine.keyState = {};
        window.engine.keyPress = {};
      });
    }
  }, {
    key: "switchScene",
    value: function switchScene(scene, args) {
      this.nextScene = new this.sceneList[scene](this, args);
    } // To Do: change this later

  }, {
    key: "forceSwitchScene",
    value: function forceSwitchScene(scene, args) {
      this.currentScene = new this.sceneList[scene](this, args);
    }
  }, {
    key: "update",
    value: function update(delta) {
      // 1. Update Game Objects
      if (this.currentScene) {
        this.currentScene.update(delta);
      } // 2. Reset mouseEvent and keyPress Dictionaries (if client)


      this.mouseEvents = {};
      this.keyPress = {};
    }
  }, {
    key: "draw",
    value: function draw(interpolationPercentage) {
      if (this.currentScene) {
        this.context.clearRect(0, 0, canvas.width, canvas.height);
        this.currentScene.draw(interpolationPercentage);
      }
    }
  }, {
    key: "begin",
    value: function begin() {// check and process input
    }
  }, {
    key: "end",
    value: function end(fps, panic) {
      // check for scene transition
      if (this.nextScene) {
        this.currentScene = this.nextScene;
        this.nextScene = null;
      } // calculate fps
      // this.fpsCounter.textContent = Math.round(fps) + ' FPS';
      // if (panic) {
      //     var discardedTime = Math.round(MainLoop.resetFrameDelta());
      //     console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
      // }

    }
  }, {
    key: "start",
    value: function start() {
      if (this.mode == engine.MODE_CLIENT) {
        MainLoop.setUpdate(this.update).setDraw(this.draw).setBegin(this.begin).setEnd(this.end).start();
      } else if (this.mode == engine.MODE_SERVER) {
        MainLoop.setUpdate(this.update).setBegin(this.begin).setEnd(this.end).start();
      } else {
        throw new Error('mini5-engine supplied incorrect input for engine mode.');
      }
    }
  }]);

  return engine;
}();

_defineProperty(engine, "MODE_CLIENT", 'client');

_defineProperty(engine, "MODE_SERVER", 'server');

var _default = engine;
exports["default"] = _default;
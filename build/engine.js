"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MainLoop = require('mainloop.js');

var MODE_LOCAL = 'local';
var MODE_SERVER = 'server';
var MODE_CLIENT = 'client';

var engine = /*#__PURE__*/function () {
  function engine() {
    var sceneList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var initScene = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var io = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var mode = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'local';

    _classCallCheck(this, engine);

    this.sceneList = sceneList;
    this.currentScene = new this.sceneList[initScene](this, args);
    this.nextScene = null;
    this.global = {};
    this.mode = mode;
    console.log('this is the mode! ' + this.mode);

    if (this.mode == MODE_LOCAL || this.mode == MODE_CLIENT) {
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
      this.keyUpdateCounter = 0;
      document.addEventListener("keydown", function (event) {
        if (!(event.keyCode in window.engine.keyState)) {
          window.engine.keyState[event.keyCode] = 0;
        }

        window.engine.keyUpdateCounter = 0;
      });
      document.addEventListener("keyup", function (event) {
        window.engine.keyPress[event.keyCode] = window.engine.keyState[event.keyCode]; // console.log(event.keyCode + ': ' + Math.round(window.engine.keyPress[event.keyCode]));

        delete window.engine.keyState[event.keyCode];
      });
    }
  }, {
    key: "switchScene",
    value: function switchScene(scene, args) {
      this.nextScene = new this.sceneList[scene](this, args);
    } // to do: change this later

  }, {
    key: "forceSwitchScene",
    value: function forceSwitchScene(scene, args) {
      this.currentScene = new this.sceneList[scene](this, args);
    }
  }, {
    key: "update",
    value: function update(delta) {
      // 1. initialize gameStateUpdate
      // this.gameStateUpdate = {};
      // 2. Update Game Objects
      if (this.currentScene) {
        this.currentScene.update(delta);
      } // 3. Check Physics Collisions
      // 4. Reset mouseEvent and keyPress Dictionaries (if client)


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
      if (this.mode == MODE_SERVER) {
        MainLoop.setUpdate(this.update).setBegin(this.begin).setEnd(this.end).start();
      } else {
        MainLoop.setUpdate(this.update).setDraw(this.draw).setBegin(this.begin).setEnd(this.end).start();
      }
    }
  }]);

  return engine;
}();

var _default = engine;
exports["default"] = _default;
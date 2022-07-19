"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInstance = createInstance;
exports.getInstance = getInstance;

var _dotenv = require("dotenv");

var _tokel = _interopRequireDefault(require("./rpc/tokel"));

(0, _dotenv.config)();
var instance;

function createInstance() {
  return new _tokel["default"]("http://".concat(process.env.RPC_USER, ":").concat(process.env.RPC_PASS, "@localhost:").concat(process.env.RPC_PORT));
}

function getInstance() {
  if (!instance) {
    instance = createInstance();
  }

  return instance;
}
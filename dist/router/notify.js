"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notifyRouter = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _walletNotify = _interopRequireDefault(require("../helpers/blockchain/tokel/walletNotify"));

var _syncTokel = require("../services/syncTokel");

var _embeds = require("../embeds");

function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }

function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, "return": function _return(value) { var ret = this.s["return"]; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, "throw": function _throw(value) { var thr = this.s["return"]; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }

// import { incomingDepositMessageHandler } from '../helpers/messageHandlers';
var localhostOnly = function localhostOnly(req, res, next) {
  var hostmachine = req.headers.host.split(':')[0];

  if (hostmachine !== 'localhost' && hostmachine !== '127.0.0.1') {
    return res.sendStatus(401);
  }

  next();
};

var notifyRouter = function notifyRouter(app, discordClient, io, queue) {
  app.post('/api/rpc/blocknotify', localhostOnly, function (req, res) {
    (0, _syncTokel.startTokelSync)(discordClient, io, queue);
    res.sendStatus(200);
  });
  app.post('/api/rpc/walletnotify', localhostOnly, /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (req.body.ticker === 'TKL') {
                (0, _walletNotify["default"])(req, res, next);
              }

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }(), /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
      var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, detail, myClient;

      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!res.locals.error) {
                _context2.next = 4;
                break;
              }

              console.log(res.locals.error);
              _context2.next = 33;
              break;

            case 4:
              if (!(!res.locals.error && res.locals.detail && res.locals.detail.length > 0)) {
                _context2.next = 33;
                break;
              }

              _iteratorAbruptCompletion = false;
              _didIteratorError = false;
              _context2.prev = 7;
              _iterator = _asyncIterator(res.locals.detail);

            case 9:
              _context2.next = 11;
              return _iterator.next();

            case 11:
              if (!(_iteratorAbruptCompletion = !(_step = _context2.sent).done)) {
                _context2.next = 17;
                break;
              }

              detail = _step.value;

              if (detail.amount) {// await incomingDepositMessageHandler(
                //   discordClient,
                //   detail,
                // );
              }

            case 14:
              _iteratorAbruptCompletion = false;
              _context2.next = 9;
              break;

            case 17:
              _context2.next = 23;
              break;

            case 19:
              _context2.prev = 19;
              _context2.t0 = _context2["catch"](7);
              _didIteratorError = true;
              _iteratorError = _context2.t0;

            case 23:
              _context2.prev = 23;
              _context2.prev = 24;

              if (!(_iteratorAbruptCompletion && _iterator["return"] != null)) {
                _context2.next = 28;
                break;
              }

              _context2.next = 28;
              return _iterator["return"]();

            case 28:
              _context2.prev = 28;

              if (!_didIteratorError) {
                _context2.next = 31;
                break;
              }

              throw _iteratorError;

            case 31:
              return _context2.finish(28);

            case 32:
              return _context2.finish(23);

            case 33:
              if (!(res.locals.verifyAddress && Object.keys(res.locals.verifyAddress).length > 0)) {
                _context2.next = 39;
                break;
              }

              _context2.next = 36;
              return discordClient.users.fetch(res.locals.verifyAddress.discordId, false);

            case 36:
              myClient = _context2.sent;
              _context2.next = 39;
              return myClient.send({
                embeds: [(0, _embeds.linkedAddressVerified)(res.locals.verifyAddress.discordId, res.locals.verifyAddress.linkedAddress)]
              });

            case 39:
              if (res.locals.activity) {
                try {
                  io.to('admin').emit('updateActivity', {
                    activity: res.locals.activity
                  });
                } catch (e) {
                  console.log(e);
                }
              }

              res.sendStatus(200);

            case 41:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[7, 19, 23, 33], [24,, 28, 32]]);
    }));

    return function (_x4, _x5) {
      return _ref2.apply(this, arguments);
    };
  }());
};

exports.notifyRouter = notifyRouter;
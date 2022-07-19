"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.myRateLimiter = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var RateLimiterFlexible = _interopRequireWildcard(require("rate-limiter-flexible"));

var _messages = require("../messages");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var errorConsumer = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 2,
  duration: 15
});
var rateLimiterHalving = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 2,
  duration: 30
});
var rateLimiterMining = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 2,
  duration: 30
});
var rateLimiterHelp = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 2,
  duration: 30
});
var rateLimiterLink = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 2,
  duration: 30
});
var rateLimiterUnlink = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 2,
  duration: 30
});
var rateLimiterAccount = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 2,
  duration: 30
});
var rateLimiterMyrank = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 2,
  duration: 30
});
var rateLimiterRanks = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 2,
  duration: 30
});
var rateLimiterDeposit = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 2,
  duration: 30
});
var rateLimiterBalance = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 2,
  duration: 30
});
var rateLimiterWithdraw = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 2,
  duration: 30
});
var rateLimiterLeaderboard = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 2,
  duration: 30
});
var rateLimiterMostActive = new RateLimiterFlexible["default"].RateLimiterMemory({
  points: 2,
  duration: 30
});

var myRateLimiter = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(client, message, title) {
    var userId, discordChannelId, notError, discordChannel;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (message.user) {
              userId = message.user.id;
            } else if (message.author) {
              userId = message.author.id;
            }

            if (message.channelId) {
              discordChannelId = message.channelId;
            }

            if (userId) {
              _context.next = 5;
              break;
            }

            return _context.abrupt("return", true);

          case 5:
            _context.prev = 5;

            if (!(title.toLowerCase() === 'help')) {
              _context.next = 11;
              break;
            }

            _context.next = 9;
            return rateLimiterHelp.consume(userId, 1);

          case 9:
            console.log('return false');
            return _context.abrupt("return", false);

          case 11:
            if (!(title.toLowerCase() === 'account')) {
              _context.next = 15;
              break;
            }

            _context.next = 14;
            return rateLimiterAccount.consume(userId, 1);

          case 14:
            return _context.abrupt("return", false);

          case 15:
            if (!(title.toLowerCase() === 'link')) {
              _context.next = 19;
              break;
            }

            _context.next = 18;
            return rateLimiterLink.consume(userId, 1);

          case 18:
            return _context.abrupt("return", false);

          case 19:
            if (!(title.toLowerCase() === 'unlink')) {
              _context.next = 23;
              break;
            }

            _context.next = 22;
            return rateLimiterUnlink.consume(userId, 1);

          case 22:
            return _context.abrupt("return", false);

          case 23:
            if (!(title.toLowerCase() === 'ranks')) {
              _context.next = 27;
              break;
            }

            _context.next = 26;
            return rateLimiterRanks.consume(userId, 1);

          case 26:
            return _context.abrupt("return", false);

          case 27:
            if (!(title.toLowerCase() === 'myrank')) {
              _context.next = 31;
              break;
            }

            _context.next = 30;
            return rateLimiterMyrank.consume(userId, 1);

          case 30:
            return _context.abrupt("return", false);

          case 31:
            if (!(title.toLowerCase() === 'mostactive')) {
              _context.next = 35;
              break;
            }

            _context.next = 34;
            return rateLimiterMostActive.consume(userId, 1);

          case 34:
            return _context.abrupt("return", false);

          case 35:
            if (!(title.toLowerCase() === 'leaderboard')) {
              _context.next = 39;
              break;
            }

            _context.next = 38;
            return rateLimiterLeaderboard.consume(userId, 1);

          case 38:
            return _context.abrupt("return", false);

          case 39:
            if (!(title.toLowerCase() === 'deposit')) {
              _context.next = 43;
              break;
            }

            _context.next = 42;
            return rateLimiterDeposit.consume(userId, 1);

          case 42:
            return _context.abrupt("return", false);

          case 43:
            if (!(title.toLowerCase() === 'withdraw')) {
              _context.next = 47;
              break;
            }

            _context.next = 46;
            return rateLimiterWithdraw.consume(userId, 1);

          case 46:
            return _context.abrupt("return", false);

          case 47:
            if (!(title.toLowerCase() === 'balance')) {
              _context.next = 51;
              break;
            }

            _context.next = 50;
            return rateLimiterBalance.consume(userId, 1);

          case 50:
            return _context.abrupt("return", false);

          case 51:
            throw new Error("no Rate limiter could be reached");

          case 54:
            _context.prev = 54;
            _context.t0 = _context["catch"](5);
            console.log(_context.t0);
            _context.prev = 57;
            _context.next = 60;
            return errorConsumer.consume(userId, 1);

          case 60:
            notError = _context.sent;

            if (!(notError.remainingPoints > 0)) {
              _context.next = 68;
              break;
            }

            _context.next = 64;
            return client.channels.fetch(discordChannelId)["catch"](function (e) {
              console.log(e);
            });

          case 64:
            discordChannel = _context.sent;

            if (!discordChannel) {
              _context.next = 68;
              break;
            }

            _context.next = 68;
            return discordChannel.send({
              embeds: [(0, _messages.discordLimitSpamMessage)(userId, title)]
            })["catch"](function (e) {
              console.log(e);
            });

          case 68:
            return _context.abrupt("return", true);

          case 71:
            _context.prev = 71;
            _context.t1 = _context["catch"](57);
            console.log(_context.t1);
            return _context.abrupt("return", true);

          case 75:
            _context.next = 81;
            break;

          case 77:
            _context.prev = 77;
            _context.t2 = _context["catch"](0);
            console.log(_context.t2);
            return _context.abrupt("return", true);

          case 81:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 77], [5, 54], [57, 71]]);
  }));

  return function myRateLimiter(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.myRateLimiter = myRateLimiter;
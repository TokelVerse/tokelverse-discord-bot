"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordTopggVote = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _embeds = require("../embeds");

var _models = _interopRequireDefault(require("../models"));

var _logger = _interopRequireDefault(require("../helpers/logger"));

var _userWalletExist = require("../helpers/client/userWalletExist");

var _experience = require("../helpers/client/experience");

/* eslint-disable import/prefer-default-export */
var discordTopggVote = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(discordClient, message, io) {
    var activity;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            activity = [];
            _context3.next = 3;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var _yield$userWalletExis, _yield$userWalletExis2, user, userActivity, topggVoteRecord, setting, findGroupToPost, discordChannel, newTopggRecord, newExp, preActivity, finalActivity;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        console.log('1');
                        _context.next = 3;
                        return (0, _userWalletExist.userWalletExist)(message, 'topggvote', t);

                      case 3:
                        _yield$userWalletExis = _context.sent;
                        _yield$userWalletExis2 = (0, _slicedToArray2["default"])(_yield$userWalletExis, 2);
                        user = _yield$userWalletExis2[0];
                        userActivity = _yield$userWalletExis2[1];
                        console.log('2');

                        if (userActivity) {
                          activity.unshift(userActivity);
                        }

                        if (user) {
                          _context.next = 11;
                          break;
                        }

                        return _context.abrupt("return");

                      case 11:
                        _context.next = 13;
                        return _models["default"].topggVote.findOne({
                          where: {
                            userId: user.id,
                            createdAt: (0, _defineProperty2["default"])({}, _sequelize.Op.gt, new Date(Date.now() - 12 * 60 * 60 * 1000))
                          },
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 13:
                        topggVoteRecord = _context.sent;
                        console.log('3');

                        if (!topggVoteRecord) {
                          _context.next = 28;
                          break;
                        }

                        _context.next = 18;
                        return _models["default"].setting.findOne();

                      case 18:
                        setting = _context.sent;
                        _context.next = 21;
                        return _models["default"].group.findOne({
                          where: {
                            groupId: setting.discordHomeServerGuildId
                          }
                        });

                      case 21:
                        findGroupToPost = _context.sent;
                        _context.next = 24;
                        return discordClient.channels.cache.get(findGroupToPost.expRewardChannelId);

                      case 24:
                        discordChannel = _context.sent;
                        _context.next = 27;
                        return discordChannel.send({
                          content: "<@".concat(user.user_id, ">"),
                          embeds: [(0, _embeds.alreadyVotedTopGG)(user.user_id)]
                        });

                      case 27:
                        return _context.abrupt("return");

                      case 28:
                        console.log('4');
                        _context.next = 31;
                        return _models["default"].topggVote.create({
                          userId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 31:
                        newTopggRecord = _context.sent;
                        console.log('5');
                        _context.next = 35;
                        return (0, _experience.gainExp)(discordClient, message.user, 16, 'topggVote', t);

                      case 35:
                        newExp = _context.sent;
                        console.log('5');
                        _context.next = 39;
                        return _models["default"].activity.create({
                          type: 'topggvote_s',
                          earnerId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 39:
                        preActivity = _context.sent;
                        _context.next = 42;
                        return _models["default"].activity.findOne({
                          where: {
                            id: preActivity.id
                          },
                          include: [{
                            model: _models["default"].user,
                            as: 'earner'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 42:
                        finalActivity = _context.sent;
                        activity.unshift(finalActivity);

                      case 44:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x4) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"]( /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(err) {
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        console.log(err);
                        _context2.prev = 1;
                        _context2.next = 4;
                        return _models["default"].error.create({
                          type: 'topggvote',
                          error: "".concat(err)
                        });

                      case 4:
                        _context2.next = 9;
                        break;

                      case 6:
                        _context2.prev = 6;
                        _context2.t0 = _context2["catch"](1);

                        _logger["default"].error("Error Discord: ".concat(_context2.t0));

                      case 9:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[1, 6]]);
              }));

              return function (_x5) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 3:
            if (activity.length > 0) {
              io.to('admin').emit('updateActivity', {
                activity: activity
              });
            }

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function discordTopggVote(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordTopggVote = discordTopggVote;
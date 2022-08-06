"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordHelp = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _discord = require("discord.js");

var _embeds = require("../embeds");

var _models = _interopRequireDefault(require("../models"));

var _logger = _interopRequireDefault(require("../helpers/logger"));

var _userWalletExist = require("../helpers/client/userWalletExist");

var _fetchDiscordChannel = require("../helpers/client/fetchDiscordChannel");

var _fetchDiscordUserIdFromMessageOrInteraction = require("../helpers/client/fetchDiscordUserIdFromMessageOrInteraction");

/* eslint-disable import/prefer-default-export */
var discordHelp = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(discordClient, message, io) {
    var activity, _yield$fetchDiscordCh, _yield$fetchDiscordCh2, discordChannel, discordUserDMChannel;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            activity = [];
            _context3.next = 3;
            return (0, _fetchDiscordChannel.fetchDiscordChannel)(discordClient, message);

          case 3:
            _yield$fetchDiscordCh = _context3.sent;
            _yield$fetchDiscordCh2 = (0, _slicedToArray2["default"])(_yield$fetchDiscordCh, 2);
            discordChannel = _yield$fetchDiscordCh2[0];
            discordUserDMChannel = _yield$fetchDiscordCh2[1];
            _context3.next = 9;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var _yield$userWalletExis, _yield$userWalletExis2, user, userActivity, discordUserId, preActivity, finalActivity;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return (0, _userWalletExist.userWalletExist)(message, 'help', t);

                      case 2:
                        _yield$userWalletExis = _context.sent;
                        _yield$userWalletExis2 = (0, _slicedToArray2["default"])(_yield$userWalletExis, 2);
                        user = _yield$userWalletExis2[0];
                        userActivity = _yield$userWalletExis2[1];

                        if (userActivity) {
                          activity.unshift(userActivity);
                        }

                        if (user) {
                          _context.next = 9;
                          break;
                        }

                        return _context.abrupt("return");

                      case 9:
                        discordUserId = user.user_id.replace('discord-', '');

                        if (!(message.channel.type === _discord.ChannelType.DM)) {
                          _context.next = 13;
                          break;
                        }

                        _context.next = 13;
                        return discordUserDMChannel.send({
                          embeds: [(0, _embeds.helpMessage)()]
                        });

                      case 13:
                        if (!(message.channel.type === _discord.ChannelType.GuildText)) {
                          _context.next = 18;
                          break;
                        }

                        _context.next = 16;
                        return discordUserDMChannel.send({
                          embeds: [(0, _embeds.helpMessage)()]
                        });

                      case 16:
                        _context.next = 18;
                        return discordChannel.send({
                          embeds: [(0, _embeds.warnDirectMessage)(discordUserId, 'Help')]
                        });

                      case 18:
                        _context.next = 20;
                        return _models["default"].activity.create({
                          type: 'help_s',
                          earnerId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 20:
                        preActivity = _context.sent;
                        _context.next = 23;
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

                      case 23:
                        finalActivity = _context.sent;
                        activity.unshift(finalActivity);

                      case 25:
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
                var userId;
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return (0, _fetchDiscordUserIdFromMessageOrInteraction.fetchDiscordUserIdFromMessageOrInteraction)(message);

                      case 2:
                        userId = _context2.sent;
                        _context2.prev = 3;
                        _context2.next = 6;
                        return _models["default"].error.create({
                          type: 'help',
                          error: "".concat(err)
                        });

                      case 6:
                        _context2.next = 11;
                        break;

                      case 8:
                        _context2.prev = 8;
                        _context2.t0 = _context2["catch"](3);

                        _logger["default"].error("Error Discord: ".concat(_context2.t0));

                      case 11:
                        if (!(err.code && err.code === 50007)) {
                          _context2.next = 16;
                          break;
                        }

                        _context2.next = 14;
                        return discordChannel.send({
                          embeds: [(0, _embeds.cannotSendMessageUser)("Help", userId)]
                        })["catch"](function (e) {
                          console.log(e);
                        });

                      case 14:
                        _context2.next = 18;
                        break;

                      case 16:
                        _context2.next = 18;
                        return discordChannel.send({
                          embeds: [(0, _embeds.discordErrorMessage)("Help")]
                        })["catch"](function (e) {
                          console.log(e);
                        });

                      case 18:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[3, 8]]);
              }));

              return function (_x5) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 9:
            if (activity.length > 0) {
              io.to('admin').emit('updateActivity', {
                activity: activity
              });
            }

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function discordHelp(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordHelp = discordHelp;
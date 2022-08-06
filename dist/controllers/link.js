"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordLinkAddress = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _discord = require("discord.js");

var _embeds = require("../embeds");

var _models = _interopRequireDefault(require("../models"));

var _logger = _interopRequireDefault(require("../helpers/logger"));

var _userWalletExist = require("../helpers/client/userWalletExist");

var _rclient = require("../services/rclient");

var _fetchDiscordChannel = require("../helpers/client/fetchDiscordChannel");

var _fetchDiscordUserIdFromMessageOrInteraction = require("../helpers/client/fetchDiscordUserIdFromMessageOrInteraction");

/* eslint-disable import/prefer-default-export */
var discordLinkAddress = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(discordClient, message, io) {
    var activity, _yield$fetchDiscordCh, _yield$fetchDiscordCh2, discordChannel, discordUserDMChannel;

    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            activity = [];
            _context5.next = 3;
            return (0, _fetchDiscordChannel.fetchDiscordChannel)(discordClient, message);

          case 3:
            _yield$fetchDiscordCh = _context5.sent;
            _yield$fetchDiscordCh2 = (0, _slicedToArray2["default"])(_yield$fetchDiscordCh, 2);
            discordChannel = _yield$fetchDiscordCh2[0];
            discordUserDMChannel = _yield$fetchDiscordCh2[1];
            _context5.next = 9;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(t) {
                var _yield$userWalletExis, _yield$userWalletExis2, user, userActivity, discordUserId, userAlreadyLinkedAnAddress, msgFilter, preActivity, finalActivity;

                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return (0, _userWalletExist.userWalletExist)(message, 'link', t);

                      case 2:
                        _yield$userWalletExis = _context3.sent;
                        _yield$userWalletExis2 = (0, _slicedToArray2["default"])(_yield$userWalletExis, 2);
                        user = _yield$userWalletExis2[0];
                        userActivity = _yield$userWalletExis2[1];

                        if (userActivity) {
                          activity.unshift(userActivity);
                        }

                        if (user) {
                          _context3.next = 9;
                          break;
                        }

                        return _context3.abrupt("return");

                      case 9:
                        discordUserId = user.user_id.replace('discord-', '');

                        if (!(message.channel.type === _discord.ChannelType.GuildText)) {
                          _context3.next = 14;
                          break;
                        }

                        console.log('before warn direct message');
                        _context3.next = 14;
                        return discordChannel.send({
                          embeds: [(0, _embeds.warnDirectMessage)(discordUserId, 'Link Tokel Address')]
                        });

                      case 14:
                        _context3.next = 16;
                        return _models["default"].linkedAddress.findOne({
                          where: {
                            userId: user.id,
                            enabled: true
                          },
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 16:
                        userAlreadyLinkedAnAddress = _context3.sent;

                        if (!userAlreadyLinkedAnAddress) {
                          _context3.next = 21;
                          break;
                        }

                        _context3.next = 20;
                        return discordUserDMChannel.send({
                          embeds: [(0, _embeds.userAlreadyLinkedAnAddressMessage)(user, userAlreadyLinkedAnAddress.address)]
                        });

                      case 20:
                        return _context3.abrupt("return");

                      case 21:
                        _context3.next = 23;
                        return discordUserDMChannel.send({
                          embeds: [(0, _embeds.enterAddressToLinkMessage)()]
                        });

                      case 23:
                        msgFilter = function msgFilter(m) {
                          var filtered = m.author.id === discordUserId;
                          return filtered;
                        };

                        _context3.next = 26;
                        return discordUserDMChannel.awaitMessages({
                          filter: msgFilter,
                          max: 1,
                          time: 60000,
                          errors: ['time']
                        }).then( /*#__PURE__*/function () {
                          var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(collected) {
                            var collectedMessage, isValidAddress, isAlreadyOccupied, linkedAddressDB, createLinkedAddress;
                            return _regenerator["default"].wrap(function _callee$(_context) {
                              while (1) {
                                switch (_context.prev = _context.next) {
                                  case 0:
                                    collectedMessage = collected.first();
                                    console.log(collectedMessage.content);
                                    console.log('collectedMessage.content');
                                    _context.prev = 3;
                                    _context.next = 6;
                                    return (0, _rclient.getInstance)().validateAddress(collectedMessage.content);

                                  case 6:
                                    isValidAddress = _context.sent;
                                    _context.next = 13;
                                    break;

                                  case 9:
                                    _context.prev = 9;
                                    _context.t0 = _context["catch"](3);
                                    console.log(_context.t0);
                                    isValidAddress = false;

                                  case 13:
                                    console.log(isValidAddress);

                                    if (!(isValidAddress && isValidAddress.isvalid)) {
                                      _context.next = 55;
                                      break;
                                    }

                                    _context.next = 17;
                                    return _models["default"].linkedAddress.findOne({
                                      where: {
                                        address: collectedMessage.content,
                                        verified: true,
                                        enabled: true
                                      },
                                      lock: t.LOCK.UPDATE,
                                      transaction: t
                                    });

                                  case 17:
                                    isAlreadyOccupied = _context.sent;

                                    if (!isAlreadyOccupied) {
                                      _context.next = 23;
                                      break;
                                    }

                                    _context.next = 21;
                                    return discordUserDMChannel.send({
                                      embeds: [(0, _embeds.tokelLinkAddressAlreadyOccupied)(message, collectedMessage.content)]
                                    });

                                  case 21:
                                    _context.next = 53;
                                    break;

                                  case 23:
                                    _context.next = 25;
                                    return _models["default"].linkedAddress.findOne({
                                      where: {
                                        userId: user.id,
                                        address: collectedMessage.content
                                      },
                                      lock: t.LOCK.UPDATE,
                                      transaction: t
                                    });

                                  case 25:
                                    linkedAddressDB = _context.sent;

                                    if (!(linkedAddressDB && linkedAddressDB.verified && linkedAddressDB.enabled)) {
                                      _context.next = 31;
                                      break;
                                    }

                                    _context.next = 29;
                                    return discordUserDMChannel.send({
                                      embeds: [(0, _embeds.tokelLinkAddressAlreadyVerified)(message, collectedMessage.content)]
                                    });

                                  case 29:
                                    _context.next = 53;
                                    break;

                                  case 31:
                                    if (!(linkedAddressDB && linkedAddressDB.enabled && !linkedAddressDB.verified)) {
                                      _context.next = 37;
                                      break;
                                    }

                                    console.log('4');
                                    _context.next = 35;
                                    return discordUserDMChannel.send({
                                      embeds: [(0, _embeds.tokelLinkAddressAlreadyBusyVerifying)(message, linkedAddressDB.address)]
                                    });

                                  case 35:
                                    _context.next = 53;
                                    break;

                                  case 37:
                                    if (!(linkedAddressDB && !linkedAddressDB.enabled)) {
                                      _context.next = 44;
                                      break;
                                    }

                                    console.log('5');
                                    _context.next = 41;
                                    return linkedAddressDB.update({
                                      enabled: true,
                                      verified: false
                                    }, {
                                      lock: t.LOCK.UPDATE,
                                      transaction: t
                                    });

                                  case 41:
                                    console.log('6');
                                    _context.next = 47;
                                    break;

                                  case 44:
                                    _context.next = 46;
                                    return _models["default"].linkedAddress.create({
                                      address: collectedMessage.content,
                                      userId: user.id,
                                      verified: false,
                                      enabled: true
                                    }, {
                                      lock: t.LOCK.UPDATE,
                                      transaction: t
                                    });

                                  case 46:
                                    createLinkedAddress = _context.sent;

                                  case 47:
                                    console.log('before addedTokenLink');
                                    console.log(user);
                                    console.log(user.wallet);
                                    console.log(user.wallet.address);
                                    _context.next = 53;
                                    return discordUserDMChannel.send({
                                      embeds: [(0, _embeds.addedNewTokelLinkAddress)(message, collectedMessage.content, user.wallet.address.address)]
                                    });

                                  case 53:
                                    _context.next = 57;
                                    break;

                                  case 55:
                                    _context.next = 57;
                                    return discordUserDMChannel.send({
                                      embeds: [(0, _embeds.invalidTokelLinkAddress)(message)]
                                    });

                                  case 57:
                                  case "end":
                                    return _context.stop();
                                }
                              }
                            }, _callee, null, [[3, 9]]);
                          }));

                          return function (_x5) {
                            return _ref3.apply(this, arguments);
                          };
                        }())["catch"]( /*#__PURE__*/function () {
                          var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(collected) {
                            return _regenerator["default"].wrap(function _callee2$(_context2) {
                              while (1) {
                                switch (_context2.prev = _context2.next) {
                                  case 0:
                                    console.log(collected);
                                    _context2.next = 3;
                                    return discordUserDMChannel.send({
                                      embeds: [(0, _embeds.timeOutTokelLinkAddressMessage)(message)]
                                    });

                                  case 3:
                                  case "end":
                                    return _context2.stop();
                                }
                              }
                            }, _callee2);
                          }));

                          return function (_x6) {
                            return _ref4.apply(this, arguments);
                          };
                        }());

                      case 26:
                        _context3.next = 28;
                        return _models["default"].activity.create({
                          type: 'link_s',
                          earnerId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 28:
                        preActivity = _context3.sent;
                        _context3.next = 31;
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

                      case 31:
                        finalActivity = _context3.sent;
                        activity.unshift(finalActivity);

                      case 33:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));

              return function (_x4) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"]( /*#__PURE__*/function () {
              var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(err) {
                var userId;
                return _regenerator["default"].wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.prev = 0;
                        _context4.next = 3;
                        return _models["default"].error.create({
                          type: 'link',
                          error: "".concat(err)
                        });

                      case 3:
                        _context4.next = 8;
                        break;

                      case 5:
                        _context4.prev = 5;
                        _context4.t0 = _context4["catch"](0);

                        _logger["default"].error("Error Discord: ".concat(_context4.t0));

                      case 8:
                        _context4.next = 10;
                        return (0, _fetchDiscordUserIdFromMessageOrInteraction.fetchDiscordUserIdFromMessageOrInteraction)(message);

                      case 10:
                        userId = _context4.sent;

                        if (!(err.code && err.code === 50007)) {
                          _context4.next = 16;
                          break;
                        }

                        _context4.next = 14;
                        return discordChannel.send({
                          embeds: [(0, _embeds.cannotSendMessageUser)("Link", message)]
                        })["catch"](function (e) {
                          console.log(e);
                        });

                      case 14:
                        _context4.next = 18;
                        break;

                      case 16:
                        _context4.next = 18;
                        return discordChannel.send({
                          embeds: [(0, _embeds.discordErrorMessage)("Link")]
                        })["catch"](function (e) {
                          console.log(e);
                        });

                      case 18:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4, null, [[0, 5]]);
              }));

              return function (_x7) {
                return _ref5.apply(this, arguments);
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
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function discordLinkAddress(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordLinkAddress = discordLinkAddress;
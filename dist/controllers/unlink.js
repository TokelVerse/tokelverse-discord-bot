"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordUnlinkAddress = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _discord = require("discord.js");

var _embeds = require("../embeds");

var _models = _interopRequireDefault(require("../models"));

var _logger = _interopRequireDefault(require("../helpers/logger"));

var _userWalletExist = require("../helpers/client/userWalletExist");

var _buttons = require("../buttons");

/* eslint-disable import/prefer-default-export */
var discordUnlinkAddress = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(message, io) {
    var activity;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            activity = [];
            _context7.next = 3;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(t) {
                var _yield$userWalletExis, _yield$userWalletExis2, user, userActivity, hasAddressToUnlink, embedMessage, collector, preActivity, finalActivity;

                return _regenerator["default"].wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.next = 2;
                        return (0, _userWalletExist.userWalletExist)(message, 'unlink', t);

                      case 2:
                        _yield$userWalletExis = _context5.sent;
                        _yield$userWalletExis2 = (0, _slicedToArray2["default"])(_yield$userWalletExis, 2);
                        user = _yield$userWalletExis2[0];
                        userActivity = _yield$userWalletExis2[1];

                        if (userActivity) {
                          activity.unshift(userActivity);
                        }

                        if (user) {
                          _context5.next = 9;
                          break;
                        }

                        return _context5.abrupt("return");

                      case 9:
                        console.log(1);

                        if (!(message.channel.type === _discord.ChannelType.GuildText)) {
                          _context5.next = 13;
                          break;
                        }

                        _context5.next = 13;
                        return message.channel.send({
                          embeds: [(0, _embeds.warnDirectMessage)(message.author.id, 'Unlink Tokel Address')]
                        });

                      case 13:
                        console.log(2);
                        _context5.next = 16;
                        return _models["default"].linkedAddress.findOne({
                          where: {
                            enabled: true,
                            userId: user.id
                          },
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 16:
                        hasAddressToUnlink = _context5.sent;
                        console.log(3);

                        if (hasAddressToUnlink) {
                          _context5.next = 21;
                          break;
                        }

                        _context5.next = 21;
                        return message.author.send({
                          embeds: [(0, _embeds.noAddressToUnlink)(message)]
                        });

                      case 21:
                        console.log(4);
                        console.log(hasAddressToUnlink);

                        if (!hasAddressToUnlink) {
                          _context5.next = 46;
                          break;
                        }

                        _context5.t0 = message.author;
                        _context5.t1 = [(0, _embeds.confirmUnlinkAddress)(message, hasAddressToUnlink.address)];
                        _context5.t2 = _discord.ActionRowBuilder;
                        _context5.next = 29;
                        return (0, _buttons.generateYesButton)();

                      case 29:
                        _context5.t3 = _context5.sent;
                        _context5.next = 32;
                        return (0, _buttons.generateNoButton)();

                      case 32:
                        _context5.t4 = _context5.sent;
                        _context5.t5 = [_context5.t3, _context5.t4];
                        _context5.t6 = {
                          components: _context5.t5
                        };
                        _context5.t7 = new _context5.t2(_context5.t6);
                        _context5.t8 = [_context5.t7];
                        _context5.t9 = {
                          embeds: _context5.t1,
                          components: _context5.t8
                        };
                        _context5.next = 40;
                        return _context5.t0.send.call(_context5.t0, _context5.t9);

                      case 40:
                        embedMessage = _context5.sent;
                        console.log(6);
                        collector = embedMessage.createMessageComponentCollector({
                          filter: function filter(_ref3) {
                            var discordUser = _ref3.user;
                            return discordUser.id === user.user_id;
                          },
                          // componentType: 'BUTTON',
                          max: 1,
                          time: 60000,
                          errors: ['time']
                        });
                        console.log(7);
                        collector.on('collect', /*#__PURE__*/function () {
                          var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(interaction) {
                            return _regenerator["default"].wrap(function _callee3$(_context3) {
                              while (1) {
                                switch (_context3.prev = _context3.next) {
                                  case 0:
                                    if (!(interaction.customId === 'yes')) {
                                      _context3.next = 4;
                                      break;
                                    }

                                    console.log('received yes');
                                    _context3.next = 4;
                                    return _models["default"].sequelize.transaction({
                                      isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
                                    }, /*#__PURE__*/function () {
                                      var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                                        var unlinkedAddress;
                                        return _regenerator["default"].wrap(function _callee$(_context) {
                                          while (1) {
                                            switch (_context.prev = _context.next) {
                                              case 0:
                                                _context.next = 2;
                                                return hasAddressToUnlink.update({
                                                  enabled: false
                                                }, {
                                                  lock: t.LOCK.UPDATE,
                                                  transaction: t
                                                });

                                              case 2:
                                                unlinkedAddress = _context.sent;
                                                _context.next = 5;
                                                return interaction.update({
                                                  embeds: [(0, _embeds.successUnlinkAddress)(message, unlinkedAddress.address)],
                                                  components: []
                                                });

                                              case 5:
                                              case "end":
                                                return _context.stop();
                                            }
                                          }
                                        }, _callee);
                                      }));

                                      return function (_x5) {
                                        return _ref5.apply(this, arguments);
                                      };
                                    }())["catch"]( /*#__PURE__*/function () {
                                      var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(err) {
                                        return _regenerator["default"].wrap(function _callee2$(_context2) {
                                          while (1) {
                                            switch (_context2.prev = _context2.next) {
                                              case 0:
                                                _context2.prev = 0;
                                                _context2.next = 3;
                                                return _models["default"].error.create({
                                                  type: 'unlink',
                                                  error: "".concat(err)
                                                });

                                              case 3:
                                                _context2.next = 8;
                                                break;

                                              case 5:
                                                _context2.prev = 5;
                                                _context2.t0 = _context2["catch"](0);

                                                _logger["default"].error("Error Discord: ".concat(_context2.t0));

                                              case 8:
                                              case "end":
                                                return _context2.stop();
                                            }
                                          }
                                        }, _callee2, null, [[0, 5]]);
                                      }));

                                      return function (_x6) {
                                        return _ref6.apply(this, arguments);
                                      };
                                    }());

                                  case 4:
                                    if (!(interaction.customId === 'no')) {
                                      _context3.next = 7;
                                      break;
                                    }

                                    _context3.next = 7;
                                    return interaction.update({
                                      embeds: [(0, _embeds.cancelUnlinkAddress)(message)],
                                      components: []
                                    });

                                  case 7:
                                  case "end":
                                    return _context3.stop();
                                }
                              }
                            }, _callee3);
                          }));

                          return function (_x4) {
                            return _ref4.apply(this, arguments);
                          };
                        }());
                        collector.on('end', /*#__PURE__*/function () {
                          var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(collected) {
                            return _regenerator["default"].wrap(function _callee4$(_context4) {
                              while (1) {
                                switch (_context4.prev = _context4.next) {
                                  case 0:
                                    console.log(collected.size);

                                    if (!(collected.size === 0)) {
                                      _context4.next = 4;
                                      break;
                                    }

                                    _context4.next = 4;
                                    return embedMessage.edit({
                                      embeds: [(0, _embeds.timeOutUnlinkAddressMessage)(message)],
                                      components: []
                                    });

                                  case 4:
                                  case "end":
                                    return _context4.stop();
                                }
                              }
                            }, _callee4);
                          }));

                          return function (_x7) {
                            return _ref7.apply(this, arguments);
                          };
                        }());

                      case 46:
                        _context5.next = 48;
                        return _models["default"].activity.create({
                          type: 'unlink_s',
                          earnerId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 48:
                        preActivity = _context5.sent;
                        _context5.next = 51;
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

                      case 51:
                        finalActivity = _context5.sent;
                        activity.unshift(finalActivity);

                      case 53:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              }));

              return function (_x3) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"]( /*#__PURE__*/function () {
              var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(err) {
                return _regenerator["default"].wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.prev = 0;
                        _context6.next = 3;
                        return _models["default"].error.create({
                          type: 'unlink',
                          error: "".concat(err)
                        });

                      case 3:
                        _context6.next = 8;
                        break;

                      case 5:
                        _context6.prev = 5;
                        _context6.t0 = _context6["catch"](0);

                        _logger["default"].error("Error Discord: ".concat(_context6.t0));

                      case 8:
                        _logger["default"].error("Error Discord Link Requested by: ".concat(message.author.id, "-").concat(message.author.username, "#").concat(message.author.discriminator, " - ").concat(err));

                        if (!(err.code && err.code === 50007)) {
                          _context6.next = 14;
                          break;
                        }

                        _context6.next = 12;
                        return message.channel.send({
                          embeds: [(0, _embeds.cannotSendMessageUser)("Unlink", message)]
                        })["catch"](function (e) {
                          console.log(e);
                        });

                      case 12:
                        _context6.next = 16;
                        break;

                      case 14:
                        _context6.next = 16;
                        return message.channel.send({
                          embeds: [(0, _embeds.discordErrorMessage)("Unlink")]
                        })["catch"](function (e) {
                          console.log(e);
                        });

                      case 16:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6, null, [[0, 5]]);
              }));

              return function (_x8) {
                return _ref8.apply(this, arguments);
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
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function discordUnlinkAddress(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordUnlinkAddress = discordUnlinkAddress;
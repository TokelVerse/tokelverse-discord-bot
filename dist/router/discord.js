"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordRouter = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _dotenv = require("dotenv");

var _channel = require("../controllers/channel");

var _group = require("../controllers/group");

var _help = require("../controllers/help");

var _link = require("../controllers/link");

var _unlink = require("../controllers/unlink");

var _activeTalker = require("../controllers/activeTalker");

var _userJoined = require("../controllers/userJoined");

var _leaderboard = require("../controllers/leaderboard");

var _mostActive = require("../controllers/mostActive");

var _myrank = require("../controllers/myrank");

var _ranks = require("../controllers/ranks");

var _models = _interopRequireDefault(require("../models"));

var _account = require("../controllers/account");

var _user = require("../controllers/user");

var _rateLimit = require("../helpers/rateLimit");

var _isMaintenanceOrDisabled = require("../helpers/isMaintenanceOrDisabled");

var _settings = _interopRequireDefault(require("../config/settings"));

var _messages = require("../messages");

(0, _dotenv.config)();

var discordRouter = function discordRouter(discordClient, queue, io) {
  var userInvites = {};
  discordClient.on('ready', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var setting;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _models["default"].setting.findOne();

          case 2:
            setting = _context.sent;
            discordClient.guilds.cache.each(function (guild) {
              if (guild.id === setting.discordHomeServerGuildId) {
                guild.invites.fetch().then(function (guildInvites) {
                  guildInvites.each(function (guildInvite) {
                    userInvites[guildInvite.code] = guildInvite.uses;
                  });
                });
              }
            });

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  discordClient.on('inviteCreate', function (invite) {
    userInvites[invite.code] = invite.uses;
  });
  discordClient.on('guildMemberAdd', /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(member) {
      var setting, newUser;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return _models["default"].setting.findOne();

            case 2:
              setting = _context4.sent;

              if (!(member.guild.id === setting.discordHomeServerGuildId)) {
                _context4.next = 9;
                break;
              }

              console.log(member.user);
              _context4.next = 7;
              return (0, _user.createUpdateDiscordUser)(discordClient, member.user, queue);

            case 7:
              newUser = _context4.sent;
              member.guild.invites.fetch().then(function (guildInvites) {
                // get all guild invites
                guildInvites.each( /*#__PURE__*/function () {
                  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(invite) {
                    return _regenerator["default"].wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            if (!(invite.uses !== userInvites[invite.code])) {
                              _context3.next = 3;
                              break;
                            }

                            _context3.next = 3;
                            return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
                              var findUserJoinedRecord, inviter, newUserJoinedRecord;
                              return _regenerator["default"].wrap(function _callee2$(_context2) {
                                while (1) {
                                  switch (_context2.prev = _context2.next) {
                                    case 0:
                                      _context2.next = 2;
                                      return _models["default"].userJoined.findOne({
                                        where: {
                                          userJoinedId: newUser.id
                                        }
                                      });

                                    case 2:
                                      findUserJoinedRecord = _context2.sent;

                                      if (findUserJoinedRecord) {
                                        _context2.next = 11;
                                        break;
                                      }

                                      _context2.next = 6;
                                      return _models["default"].user.findOne({
                                        where: {
                                          user_id: invite.inviter.id
                                        }
                                      });

                                    case 6:
                                      inviter = _context2.sent;

                                      if (!inviter) {
                                        _context2.next = 11;
                                        break;
                                      }

                                      _context2.next = 10;
                                      return _models["default"].userJoined.create({
                                        userJoinedId: newUser.id,
                                        userInvitedById: inviter.id
                                      });

                                    case 10:
                                      newUserJoinedRecord = _context2.sent;

                                    case 11:
                                    case "end":
                                      return _context2.stop();
                                  }
                                }
                              }, _callee2);
                            })));

                          case 3:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  }));

                  return function (_x2) {
                    return _ref3.apply(this, arguments);
                  };
                }());
              });

            case 9:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }());
  discordClient.on('guildMemberUpdate', /*#__PURE__*/function () {
    var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(oldMember, newMember) {
      var setting, newHas;
      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return _models["default"].setting.findOne();

            case 2:
              setting = _context6.sent;
              newHas = newMember.roles.cache.has(setting.joinedRoleId);

              if (!newHas) {
                _context6.next = 7;
                break;
              }

              _context6.next = 7;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
                var task;
                return _regenerator["default"].wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.next = 2;
                        return (0, _userJoined.discordUserJoined)(discordClient, newMember, io);

                      case 2:
                        task = _context5.sent;

                      case 3:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              })));

            case 7:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function (_x3, _x4) {
      return _ref5.apply(this, arguments);
    };
  }());
  discordClient.on('voiceStateUpdate', /*#__PURE__*/function () {
    var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(oldMember, newMember) {
      return _regenerator["default"].wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
                var groupTask, channelTask;
                return _regenerator["default"].wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _context7.next = 2;
                        return (0, _group.updateDiscordGroup)(discordClient, newMember);

                      case 2:
                        groupTask = _context7.sent;
                        _context7.next = 5;
                        return (0, _channel.updateDiscordChannel)(newMember, groupTask);

                      case 5:
                        channelTask = _context7.sent;

                      case 6:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              })));

            case 2:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    }));

    return function (_x5, _x6) {
      return _ref7.apply(this, arguments);
    };
  }());
  discordClient.on('interactionCreate', /*#__PURE__*/function () {
    var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17(interaction) {
      var groupTask, groupTaskId, channelTask, channelTaskId, lastSeenDiscordTask, maintenance, walletExists, commandName, limited, _limited, _limited2, _limited3, _limited4, _limited5, setting, _limited6, _setting;

      return _regenerator["default"].wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              if (!(!interaction.isCommand() && !interaction.isButton())) {
                _context17.next = 2;
                break;
              }

              return _context17.abrupt("return");

            case 2:
              if (interaction.user.bot) {
                _context17.next = 119;
                break;
              }

              _context17.next = 5;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(interaction, 'discord');

            case 5:
              maintenance = _context17.sent;

              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context17.next = 8;
                break;
              }

              return _context17.abrupt("return");

            case 8:
              _context17.next = 10;
              return (0, _user.createUpdateDiscordUser)(discordClient, interaction.user, queue);

            case 10:
              walletExists = _context17.sent;
              _context17.next = 13;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
                return _regenerator["default"].wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        _context9.next = 2;
                        return (0, _group.updateDiscordGroup)(discordClient, interaction);

                      case 2:
                        groupTask = _context9.sent;
                        _context9.next = 5;
                        return (0, _channel.updateDiscordChannel)(interaction, groupTask);

                      case 5:
                        channelTask = _context9.sent;
                        _context9.next = 8;
                        return (0, _user.updateDiscordLastSeen)(interaction, interaction.user);

                      case 8:
                        lastSeenDiscordTask = _context9.sent;
                        groupTaskId = groupTask && groupTask.id;
                        channelTaskId = channelTask && channelTask.id;

                      case 11:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9);
              })));

            case 13:
              if (!interaction.isCommand()) {
                _context17.next = 119;
                break;
              }

              commandName = interaction.commandName;

              if (!(commandName === 'help')) {
                _context17.next = 29;
                break;
              }

              _context17.next = 18;
              return interaction.deferReply()["catch"](function (e) {
                console.log(e);
              });

            case 18:
              _context17.next = 20;
              return (0, _rateLimit.myRateLimiter)(discordClient, interaction, 'Help');

            case 20:
              limited = _context17.sent;

              if (!limited) {
                _context17.next = 25;
                break;
              }

              _context17.next = 24;
              return interaction.editReply('rate limited')["catch"](function (e) {
                console.log(e);
              });

            case 24:
              return _context17.abrupt("return");

            case 25:
              _context17.next = 27;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
                var task;
                return _regenerator["default"].wrap(function _callee10$(_context10) {
                  while (1) {
                    switch (_context10.prev = _context10.next) {
                      case 0:
                        console.log(interaction);
                        _context10.next = 3;
                        return (0, _help.discordHelp)(discordClient, interaction, io);

                      case 3:
                        task = _context10.sent;

                      case 4:
                      case "end":
                        return _context10.stop();
                    }
                  }
                }, _callee10);
              })));

            case 27:
              _context17.next = 29;
              return interaction.editReply("\u200B")["catch"](function (e) {
                console.log(e);
              });

            case 29:
              if (!(commandName === 'myrank')) {
                _context17.next = 43;
                break;
              }

              _context17.next = 32;
              return interaction.deferReply()["catch"](function (e) {
                console.log(e);
              });

            case 32:
              _context17.next = 34;
              return (0, _rateLimit.myRateLimiter)(discordClient, interaction, 'Myrank');

            case 34:
              _limited = _context17.sent;

              if (!_limited) {
                _context17.next = 39;
                break;
              }

              _context17.next = 38;
              return interaction.editReply('rate limited')["catch"](function (e) {
                console.log(e);
              });

            case 38:
              return _context17.abrupt("return");

            case 39:
              _context17.next = 41;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
                var task;
                return _regenerator["default"].wrap(function _callee11$(_context11) {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        _context11.next = 2;
                        return (0, _myrank.discordMyRank)(discordClient, interaction, io);

                      case 2:
                        task = _context11.sent;

                      case 3:
                      case "end":
                        return _context11.stop();
                    }
                  }
                }, _callee11);
              })));

            case 41:
              _context17.next = 43;
              return interaction.editReply("\u200B")["catch"](function (e) {
                console.log(e);
              });

            case 43:
              if (!(commandName === 'ranks')) {
                _context17.next = 57;
                break;
              }

              _context17.next = 46;
              return interaction.deferReply()["catch"](function (e) {
                console.log(e);
              });

            case 46:
              _context17.next = 48;
              return (0, _rateLimit.myRateLimiter)(discordClient, interaction, 'Ranks');

            case 48:
              _limited2 = _context17.sent;

              if (!_limited2) {
                _context17.next = 53;
                break;
              }

              _context17.next = 52;
              return interaction.editReply('rate limited')["catch"](function (e) {
                console.log(e);
              });

            case 52:
              return _context17.abrupt("return");

            case 53:
              _context17.next = 55;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
                var task;
                return _regenerator["default"].wrap(function _callee12$(_context12) {
                  while (1) {
                    switch (_context12.prev = _context12.next) {
                      case 0:
                        _context12.next = 2;
                        return (0, _ranks.discordRanks)(discordClient, interaction, io);

                      case 2:
                        task = _context12.sent;

                      case 3:
                      case "end":
                        return _context12.stop();
                    }
                  }
                }, _callee12);
              })));

            case 55:
              _context17.next = 57;
              return interaction.editReply("\u200B")["catch"](function (e) {
                console.log(e);
              });

            case 57:
              if (!(commandName === 'deposit')) {
                _context17.next = 71;
                break;
              }

              _context17.next = 60;
              return interaction.deferReply()["catch"](function (e) {
                console.log(e);
              });

            case 60:
              _context17.next = 62;
              return (0, _rateLimit.myRateLimiter)(discordClient, interaction, 'Deposit');

            case 62:
              _limited3 = _context17.sent;

              if (!_limited3) {
                _context17.next = 67;
                break;
              }

              _context17.next = 66;
              return interaction.editReply('rate limited')["catch"](function (e) {
                console.log(e);
              });

            case 66:
              return _context17.abrupt("return");

            case 67:
              _context17.next = 69;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
                var task;
                return _regenerator["default"].wrap(function _callee13$(_context13) {
                  while (1) {
                    switch (_context13.prev = _context13.next) {
                      case 0:
                        _context13.next = 2;
                        return discordDeposit(discordClient, interaction, io);

                      case 2:
                        task = _context13.sent;

                      case 3:
                      case "end":
                        return _context13.stop();
                    }
                  }
                }, _callee13);
              })));

            case 69:
              _context17.next = 71;
              return interaction.editReply("\u200B")["catch"](function (e) {
                console.log(e);
              });

            case 71:
              if (!(commandName === 'balance')) {
                _context17.next = 85;
                break;
              }

              _context17.next = 74;
              return interaction.deferReply()["catch"](function (e) {
                console.log(e);
              });

            case 74:
              _context17.next = 76;
              return (0, _rateLimit.myRateLimiter)(discordClient, interaction, 'Balance');

            case 76:
              _limited4 = _context17.sent;

              if (!_limited4) {
                _context17.next = 81;
                break;
              }

              _context17.next = 80;
              return interaction.editReply('rate limited')["catch"](function (e) {
                console.log(e);
              });

            case 80:
              return _context17.abrupt("return");

            case 81:
              _context17.next = 83;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14() {
                var task;
                return _regenerator["default"].wrap(function _callee14$(_context14) {
                  while (1) {
                    switch (_context14.prev = _context14.next) {
                      case 0:
                        _context14.next = 2;
                        return discordBalance(discordClient, interaction, io);

                      case 2:
                        task = _context14.sent;

                      case 3:
                      case "end":
                        return _context14.stop();
                    }
                  }
                }, _callee14);
              })));

            case 83:
              _context17.next = 85;
              return interaction.editReply("\u200B")["catch"](function (e) {
                console.log(e);
              });

            case 85:
              if (!(commandName === 'leaderboard')) {
                _context17.next = 102;
                break;
              }

              _context17.next = 88;
              return interaction.deferReply()["catch"](function (e) {
                console.log(e);
              });

            case 88:
              _context17.next = 90;
              return (0, _rateLimit.myRateLimiter)(discordClient, interaction, 'Leaderboard');

            case 90:
              _limited5 = _context17.sent;

              if (!_limited5) {
                _context17.next = 95;
                break;
              }

              _context17.next = 94;
              return interaction.editReply('rate limited')["catch"](function (e) {
                console.log(e);
              });

            case 94:
              return _context17.abrupt("return");

            case 95:
              _context17.next = 97;
              return _models["default"].setting.findOne();

            case 97:
              setting = _context17.sent;
              _context17.next = 100;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15() {
                var task;
                return _regenerator["default"].wrap(function _callee15$(_context15) {
                  while (1) {
                    switch (_context15.prev = _context15.next) {
                      case 0:
                        _context15.next = 2;
                        return (0, _leaderboard.discordLeaderboard)(discordClient, interaction, setting, io);

                      case 2:
                        task = _context15.sent;

                      case 3:
                      case "end":
                        return _context15.stop();
                    }
                  }
                }, _callee15);
              })));

            case 100:
              _context17.next = 102;
              return interaction.editReply("\u200B")["catch"](function (e) {
                console.log(e);
              });

            case 102:
              if (!(commandName === 'mostactive')) {
                _context17.next = 119;
                break;
              }

              _context17.next = 105;
              return interaction.deferReply()["catch"](function (e) {
                console.log(e);
              });

            case 105:
              _context17.next = 107;
              return (0, _rateLimit.myRateLimiter)(discordClient, interaction, 'MostActive');

            case 107:
              _limited6 = _context17.sent;

              if (!_limited6) {
                _context17.next = 112;
                break;
              }

              _context17.next = 111;
              return interaction.editReply('rate limited')["catch"](function (e) {
                console.log(e);
              });

            case 111:
              return _context17.abrupt("return");

            case 112:
              _context17.next = 114;
              return _models["default"].setting.findOne();

            case 114:
              _setting = _context17.sent;
              _context17.next = 117;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16() {
                var task;
                return _regenerator["default"].wrap(function _callee16$(_context16) {
                  while (1) {
                    switch (_context16.prev = _context16.next) {
                      case 0:
                        _context16.next = 2;
                        return (0, _mostActive.discordMostActive)(discordClient, interaction, _setting, io);

                      case 2:
                        task = _context16.sent;

                      case 3:
                      case "end":
                        return _context16.stop();
                    }
                  }
                }, _callee16);
              })));

            case 117:
              _context17.next = 119;
              return interaction.editReply("\u200B")["catch"](function (e) {
                console.log(e);
              });

            case 119:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17);
    }));

    return function (_x7) {
      return _ref9.apply(this, arguments);
    };
  }());
  discordClient.on("messageCreate", /*#__PURE__*/function () {
    var _ref18 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee28(message) {
      var groupTask, groupTaskId, channelTask, channelTaskId, lastSeenDiscordTask, disallow, walletExists, messageReplaceBreaksWithSpaces, preFilteredMessageDiscord, filteredMessageDiscord, setting, maintenance, limited, _limited7, _limited8, _limited9, _limited10, task, _limited11, _task, _limited12, _limited13, _limited14, _setting2, _limited15, _setting3;

      return _regenerator["default"].wrap(function _callee28$(_context28) {
        while (1) {
          switch (_context28.prev = _context28.next) {
            case 0:
              if (message.author.bot) {
                _context28.next = 8;
                break;
              }

              _context28.next = 3;
              return (0, _user.createUpdateDiscordUser)(discordClient, message.author, queue);

            case 3:
              walletExists = _context28.sent;
              _context28.next = 6;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18() {
                return _regenerator["default"].wrap(function _callee18$(_context18) {
                  while (1) {
                    switch (_context18.prev = _context18.next) {
                      case 0:
                        _context18.next = 2;
                        return (0, _group.updateDiscordGroup)(discordClient, message);

                      case 2:
                        groupTask = _context18.sent;
                        _context18.next = 5;
                        return (0, _channel.updateDiscordChannel)(message, groupTask);

                      case 5:
                        channelTask = _context18.sent;
                        _context18.next = 8;
                        return (0, _user.updateDiscordLastSeen)(message, message.author);

                      case 8:
                        lastSeenDiscordTask = _context18.sent;

                      case 9:
                      case "end":
                        return _context18.stop();
                    }
                  }
                }, _callee18);
              })));

            case 6:
              groupTaskId = groupTask && groupTask.id;
              channelTaskId = channelTask && channelTask.id;

            case 8:
              messageReplaceBreaksWithSpaces = message.content.replace(/\n/g, " ");
              preFilteredMessageDiscord = messageReplaceBreaksWithSpaces.split(' ');
              filteredMessageDiscord = preFilteredMessageDiscord.filter(function (el) {
                return el !== '';
              });

              if (message.author.bot) {
                _context28.next = 17;
                break;
              }

              _context28.next = 14;
              return _models["default"].setting.findOne();

            case 14:
              setting = _context28.sent;
              _context28.next = 17;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19() {
                var task;
                return _regenerator["default"].wrap(function _callee19$(_context19) {
                  while (1) {
                    switch (_context19.prev = _context19.next) {
                      case 0:
                        if (!(message.guildId === setting.discordHomeServerGuildId)) {
                          _context19.next = 4;
                          break;
                        }

                        _context19.next = 3;
                        return (0, _activeTalker.discordActiveTalker)(discordClient, message, filteredMessageDiscord, io);

                      case 3:
                        task = _context19.sent;

                      case 4:
                      case "end":
                        return _context19.stop();
                    }
                  }
                }, _callee19);
              })));

            case 17:
              if (!(!message.content.startsWith(_settings["default"].bot.command) || message.author.bot)) {
                _context28.next = 19;
                break;
              }

              return _context28.abrupt("return");

            case 19:
              _context28.next = 21;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(message, 'discord');

            case 21:
              maintenance = _context28.sent;

              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context28.next = 24;
                break;
              }

              return _context28.abrupt("return");

            case 24:
              if (!(groupTask && groupTask.banned)) {
                _context28.next = 28;
                break;
              }

              _context28.next = 27;
              return message.channel.send({
                embeds: [(0, _messages.discordServerBannedMessage)(groupTask)]
              })["catch"](function (e) {
                console.log(e);
              });

            case 27:
              return _context28.abrupt("return");

            case 28:
              if (!(channelTask && channelTask.banned)) {
                _context28.next = 32;
                break;
              }

              _context28.next = 31;
              return message.channel.send({
                embeds: [(0, _messages.discordChannelBannedMessage)(channelTask)]
              })["catch"](function (e) {
                console.log(e);
              });

            case 31:
              return _context28.abrupt("return");

            case 32:
              if (!(lastSeenDiscordTask && lastSeenDiscordTask.banned)) {
                _context28.next = 36;
                break;
              }

              _context28.next = 35;
              return message.channel.send({
                embeds: [(0, _messages.discordUserBannedMessage)(lastSeenDiscordTask)]
              })["catch"](function (e) {
                console.log(e);
              });

            case 35:
              return _context28.abrupt("return");

            case 36:
              if (!(filteredMessageDiscord[1] === undefined)) {
                _context28.next = 44;
                break;
              }

              _context28.next = 39;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'Help');

            case 39:
              limited = _context28.sent;

              if (!limited) {
                _context28.next = 42;
                break;
              }

              return _context28.abrupt("return");

            case 42:
              _context28.next = 44;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee20() {
                var task;
                return _regenerator["default"].wrap(function _callee20$(_context20) {
                  while (1) {
                    switch (_context20.prev = _context20.next) {
                      case 0:
                        _context20.next = 2;
                        return (0, _help.discordHelp)(message, io);

                      case 2:
                        task = _context20.sent;

                      case 3:
                      case "end":
                        return _context20.stop();
                    }
                  }
                }, _callee20);
              })));

            case 44:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'help')) {
                _context28.next = 52;
                break;
              }

              _context28.next = 47;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'Help');

            case 47:
              _limited7 = _context28.sent;

              if (!_limited7) {
                _context28.next = 50;
                break;
              }

              return _context28.abrupt("return");

            case 50:
              _context28.next = 52;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee21() {
                var task;
                return _regenerator["default"].wrap(function _callee21$(_context21) {
                  while (1) {
                    switch (_context21.prev = _context21.next) {
                      case 0:
                        _context21.next = 2;
                        return (0, _help.discordHelp)(message, io);

                      case 2:
                        task = _context21.sent;

                      case 3:
                      case "end":
                        return _context21.stop();
                    }
                  }
                }, _callee21);
              })));

            case 52:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'help')) {
                _context28.next = 60;
                break;
              }

              _context28.next = 55;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'Help');

            case 55:
              _limited8 = _context28.sent;

              if (!_limited8) {
                _context28.next = 58;
                break;
              }

              return _context28.abrupt("return");

            case 58:
              _context28.next = 60;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee22() {
                var task;
                return _regenerator["default"].wrap(function _callee22$(_context22) {
                  while (1) {
                    switch (_context22.prev = _context22.next) {
                      case 0:
                        _context22.next = 2;
                        return (0, _help.discordHelp)(message, io);

                      case 2:
                        task = _context22.sent;

                      case 3:
                      case "end":
                        return _context22.stop();
                    }
                  }
                }, _callee22);
              })));

            case 60:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'account')) {
                _context28.next = 68;
                break;
              }

              _context28.next = 63;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'Account');

            case 63:
              _limited9 = _context28.sent;

              if (!_limited9) {
                _context28.next = 66;
                break;
              }

              return _context28.abrupt("return");

            case 66:
              _context28.next = 68;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee23() {
                var task;
                return _regenerator["default"].wrap(function _callee23$(_context23) {
                  while (1) {
                    switch (_context23.prev = _context23.next) {
                      case 0:
                        _context23.next = 2;
                        return (0, _account.discordAccount)(message, io);

                      case 2:
                        task = _context23.sent;

                      case 3:
                      case "end":
                        return _context23.stop();
                    }
                  }
                }, _callee23);
              })));

            case 68:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'link')) {
                _context28.next = 77;
                break;
              }

              _context28.next = 71;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'Link');

            case 71:
              _limited10 = _context28.sent;

              if (!_limited10) {
                _context28.next = 74;
                break;
              }

              return _context28.abrupt("return");

            case 74:
              _context28.next = 76;
              return (0, _link.discordLinkAddress)(message, io);

            case 76:
              task = _context28.sent;

            case 77:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'unlink')) {
                _context28.next = 86;
                break;
              }

              _context28.next = 80;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'Unlink');

            case 80:
              _limited11 = _context28.sent;

              if (!_limited11) {
                _context28.next = 83;
                break;
              }

              return _context28.abrupt("return");

            case 83:
              _context28.next = 85;
              return (0, _unlink.discordUnlinkAddress)(message, io);

            case 85:
              _task = _context28.sent;

            case 86:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'myrank')) {
                _context28.next = 94;
                break;
              }

              _context28.next = 89;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'Myrank');

            case 89:
              _limited12 = _context28.sent;

              if (!_limited12) {
                _context28.next = 92;
                break;
              }

              return _context28.abrupt("return");

            case 92:
              _context28.next = 94;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee24() {
                var task;
                return _regenerator["default"].wrap(function _callee24$(_context24) {
                  while (1) {
                    switch (_context24.prev = _context24.next) {
                      case 0:
                        _context24.next = 2;
                        return (0, _myrank.discordMyRank)(discordClient, message, io);

                      case 2:
                        task = _context24.sent;

                      case 3:
                      case "end":
                        return _context24.stop();
                    }
                  }
                }, _callee24);
              })));

            case 94:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'ranks')) {
                _context28.next = 102;
                break;
              }

              _context28.next = 97;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'Ranks');

            case 97:
              _limited13 = _context28.sent;

              if (!_limited13) {
                _context28.next = 100;
                break;
              }

              return _context28.abrupt("return");

            case 100:
              _context28.next = 102;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee25() {
                var task;
                return _regenerator["default"].wrap(function _callee25$(_context25) {
                  while (1) {
                    switch (_context25.prev = _context25.next) {
                      case 0:
                        _context25.next = 2;
                        return (0, _ranks.discordRanks)(discordClient, message, io);

                      case 2:
                        task = _context25.sent;

                      case 3:
                      case "end":
                        return _context25.stop();
                    }
                  }
                }, _callee25);
              })));

            case 102:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'leaderboard')) {
                _context28.next = 113;
                break;
              }

              _context28.next = 105;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'Leaderboard');

            case 105:
              _limited14 = _context28.sent;

              if (!_limited14) {
                _context28.next = 108;
                break;
              }

              return _context28.abrupt("return");

            case 108:
              _context28.next = 110;
              return _models["default"].setting.findOne();

            case 110:
              _setting2 = _context28.sent;
              _context28.next = 113;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee26() {
                var task;
                return _regenerator["default"].wrap(function _callee26$(_context26) {
                  while (1) {
                    switch (_context26.prev = _context26.next) {
                      case 0:
                        _context26.next = 2;
                        return (0, _leaderboard.discordLeaderboard)(discordClient, message, _setting2, io);

                      case 2:
                        task = _context26.sent;

                      case 3:
                      case "end":
                        return _context26.stop();
                    }
                  }
                }, _callee26);
              })));

            case 113:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'mostactive')) {
                _context28.next = 124;
                break;
              }

              _context28.next = 116;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'MostActive');

            case 116:
              _limited15 = _context28.sent;

              if (!_limited15) {
                _context28.next = 119;
                break;
              }

              return _context28.abrupt("return");

            case 119:
              _context28.next = 121;
              return _models["default"].setting.findOne();

            case 121:
              _setting3 = _context28.sent;
              _context28.next = 124;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee27() {
                var task;
                return _regenerator["default"].wrap(function _callee27$(_context27) {
                  while (1) {
                    switch (_context27.prev = _context27.next) {
                      case 0:
                        _context27.next = 2;
                        return (0, _mostActive.discordMostActive)(discordClient, message, _setting3, io);

                      case 2:
                        task = _context27.sent;

                      case 3:
                      case "end":
                        return _context27.stop();
                    }
                  }
                }, _callee27);
              })));

            case 124:
            case "end":
              return _context28.stop();
          }
        }
      }, _callee28);
    }));

    return function (_x8) {
      return _ref18.apply(this, arguments);
    };
  }());
};

exports.discordRouter = discordRouter;
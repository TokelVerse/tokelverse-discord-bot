"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordRouter = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _dotenv = require("dotenv");

var _discord = require("discord.js");

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

var _embeds = require("../embeds");

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
    var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(interaction) {
      var groupTask, groupTaskId, channelTask, channelTaskId, lastSeenDiscordTask, maintenance, walletExists, commandName, limited, _limited, _limited2, _limited3, setting, _limited4, _setting, _limited5, task, _limited6, _task;

      return _regenerator["default"].wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              if (!(interaction.type !== _discord.InteractionType.ApplicationCommand && !interaction.isButton())) {
                _context15.next = 2;
                break;
              }

              return _context15.abrupt("return");

            case 2:
              if (interaction.user.bot) {
                _context15.next = 98;
                break;
              }

              _context15.next = 5;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(interaction, 'discord');

            case 5:
              maintenance = _context15.sent;

              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context15.next = 8;
                break;
              }

              return _context15.abrupt("return");

            case 8:
              _context15.next = 10;
              return (0, _user.createUpdateDiscordUser)(discordClient, interaction.user, queue);

            case 10:
              walletExists = _context15.sent;
              _context15.next = 13;
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
              if (!(interaction.type === _discord.InteractionType.ApplicationCommand)) {
                _context15.next = 98;
                break;
              }

              commandName = interaction.commandName;

              if (!(commandName === _settings["default"].bot.command.slash)) {
                _context15.next = 98;
                break;
              }

              _context15.next = 18;
              return interaction.deferReply()["catch"](function (e) {
                console.log(e);
              });

            case 18:
              if (!(interaction.options.getSubcommand() === 'help')) {
                _context15.next = 28;
                break;
              }

              _context15.next = 21;
              return (0, _rateLimit.myRateLimiter)(discordClient, interaction, 'Help');

            case 21:
              limited = _context15.sent;

              if (!limited) {
                _context15.next = 26;
                break;
              }

              _context15.next = 25;
              return interaction.editReply('rate limited')["catch"](function (e) {
                console.log(e);
              });

            case 25:
              return _context15.abrupt("return");

            case 26:
              _context15.next = 28;
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

            case 28:
              if (!(interaction.options.getSubcommand() === 'myrank')) {
                _context15.next = 38;
                break;
              }

              _context15.next = 31;
              return (0, _rateLimit.myRateLimiter)(discordClient, interaction, 'Myrank');

            case 31:
              _limited = _context15.sent;

              if (!_limited) {
                _context15.next = 36;
                break;
              }

              _context15.next = 35;
              return interaction.editReply('rate limited')["catch"](function (e) {
                console.log(e);
              });

            case 35:
              return _context15.abrupt("return");

            case 36:
              _context15.next = 38;
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

            case 38:
              if (!(interaction.options.getSubcommand() === 'ranks')) {
                _context15.next = 48;
                break;
              }

              _context15.next = 41;
              return (0, _rateLimit.myRateLimiter)(discordClient, interaction, 'Ranks');

            case 41:
              _limited2 = _context15.sent;

              if (!_limited2) {
                _context15.next = 46;
                break;
              }

              _context15.next = 45;
              return interaction.editReply('rate limited')["catch"](function (e) {
                console.log(e);
              });

            case 45:
              return _context15.abrupt("return");

            case 46:
              _context15.next = 48;
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

            case 48:
              if (!(interaction.options.getSubcommand() === 'leaderboard')) {
                _context15.next = 61;
                break;
              }

              _context15.next = 51;
              return (0, _rateLimit.myRateLimiter)(discordClient, interaction, 'Leaderboard');

            case 51:
              _limited3 = _context15.sent;

              if (!_limited3) {
                _context15.next = 56;
                break;
              }

              _context15.next = 55;
              return interaction.editReply('rate limited')["catch"](function (e) {
                console.log(e);
              });

            case 55:
              return _context15.abrupt("return");

            case 56:
              _context15.next = 58;
              return _models["default"].setting.findOne();

            case 58:
              setting = _context15.sent;
              _context15.next = 61;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
                var task;
                return _regenerator["default"].wrap(function _callee13$(_context13) {
                  while (1) {
                    switch (_context13.prev = _context13.next) {
                      case 0:
                        _context13.next = 2;
                        return (0, _leaderboard.discordLeaderboard)(discordClient, interaction, setting, io);

                      case 2:
                        task = _context13.sent;

                      case 3:
                      case "end":
                        return _context13.stop();
                    }
                  }
                }, _callee13);
              })));

            case 61:
              if (!(interaction.options.getSubcommand() === 'mostactive')) {
                _context15.next = 74;
                break;
              }

              _context15.next = 64;
              return (0, _rateLimit.myRateLimiter)(discordClient, interaction, 'MostActive');

            case 64:
              _limited4 = _context15.sent;

              if (!_limited4) {
                _context15.next = 69;
                break;
              }

              _context15.next = 68;
              return interaction.editReply('rate limited')["catch"](function (e) {
                console.log(e);
              });

            case 68:
              return _context15.abrupt("return");

            case 69:
              _context15.next = 71;
              return _models["default"].setting.findOne();

            case 71:
              _setting = _context15.sent;
              _context15.next = 74;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14() {
                var task;
                return _regenerator["default"].wrap(function _callee14$(_context14) {
                  while (1) {
                    switch (_context14.prev = _context14.next) {
                      case 0:
                        _context14.next = 2;
                        return (0, _mostActive.discordMostActive)(discordClient, interaction, _setting, io);

                      case 2:
                        task = _context14.sent;

                      case 3:
                      case "end":
                        return _context14.stop();
                    }
                  }
                }, _callee14);
              })));

            case 74:
              if (!(interaction.options.getSubcommand() === 'link')) {
                _context15.next = 85;
                break;
              }

              _context15.next = 77;
              return (0, _rateLimit.myRateLimiter)(discordClient, interaction, 'Link');

            case 77:
              _limited5 = _context15.sent;

              if (!_limited5) {
                _context15.next = 82;
                break;
              }

              _context15.next = 81;
              return interaction.editReply('rate limited')["catch"](function (e) {
                console.log(e);
              });

            case 81:
              return _context15.abrupt("return");

            case 82:
              _context15.next = 84;
              return (0, _link.discordLinkAddress)(discordClient, interaction, io);

            case 84:
              task = _context15.sent;

            case 85:
              if (!(interaction.options.getSubcommand() === 'unlink')) {
                _context15.next = 96;
                break;
              }

              _context15.next = 88;
              return (0, _rateLimit.myRateLimiter)(discordClient, interaction, 'Unlink');

            case 88:
              _limited6 = _context15.sent;

              if (!_limited6) {
                _context15.next = 93;
                break;
              }

              _context15.next = 92;
              return interaction.editReply('rate limited')["catch"](function (e) {
                console.log(e);
              });

            case 92:
              return _context15.abrupt("return");

            case 93:
              _context15.next = 95;
              return (0, _unlink.discordUnlinkAddress)(discordClient, interaction, io);

            case 95:
              _task = _context15.sent;

            case 96:
              _context15.next = 98;
              return interaction.editReply("\u200B")["catch"](function (e) {
                console.log(e);
              });

            case 98:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15);
    }));

    return function (_x7) {
      return _ref9.apply(this, arguments);
    };
  }());
  discordClient.on("messageCreate", /*#__PURE__*/function () {
    var _ref16 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee26(message) {
      var groupTask, groupTaskId, channelTask, channelTaskId, lastSeenDiscordTask, disallow, walletExists, messageReplaceBreaksWithSpaces, preFilteredMessageDiscord, filteredMessageDiscord, setting, maintenance, limited, _limited7, _limited8, _limited9, _limited10, task, _limited11, _task2, _limited12, _limited13, _limited14, _setting2, _limited15, _setting3;

      return _regenerator["default"].wrap(function _callee26$(_context26) {
        while (1) {
          switch (_context26.prev = _context26.next) {
            case 0:
              if (message.author.bot) {
                _context26.next = 8;
                break;
              }

              _context26.next = 3;
              return (0, _user.createUpdateDiscordUser)(discordClient, message.author, queue);

            case 3:
              walletExists = _context26.sent;
              _context26.next = 6;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16() {
                return _regenerator["default"].wrap(function _callee16$(_context16) {
                  while (1) {
                    switch (_context16.prev = _context16.next) {
                      case 0:
                        _context16.next = 2;
                        return (0, _group.updateDiscordGroup)(discordClient, message);

                      case 2:
                        groupTask = _context16.sent;
                        _context16.next = 5;
                        return (0, _channel.updateDiscordChannel)(message, groupTask);

                      case 5:
                        channelTask = _context16.sent;
                        _context16.next = 8;
                        return (0, _user.updateDiscordLastSeen)(message, message.author);

                      case 8:
                        lastSeenDiscordTask = _context16.sent;

                      case 9:
                      case "end":
                        return _context16.stop();
                    }
                  }
                }, _callee16);
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
                _context26.next = 17;
                break;
              }

              _context26.next = 14;
              return _models["default"].setting.findOne();

            case 14:
              setting = _context26.sent;
              _context26.next = 17;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17() {
                var task;
                return _regenerator["default"].wrap(function _callee17$(_context17) {
                  while (1) {
                    switch (_context17.prev = _context17.next) {
                      case 0:
                        if (!(message.guildId === setting.discordHomeServerGuildId)) {
                          _context17.next = 4;
                          break;
                        }

                        _context17.next = 3;
                        return (0, _activeTalker.discordActiveTalker)(discordClient, message, filteredMessageDiscord, io);

                      case 3:
                        task = _context17.sent;

                      case 4:
                      case "end":
                        return _context17.stop();
                    }
                  }
                }, _callee17);
              })));

            case 17:
              if (!(!message.content.startsWith(_settings["default"].bot.command.normal) || message.author.bot)) {
                _context26.next = 19;
                break;
              }

              return _context26.abrupt("return");

            case 19:
              _context26.next = 21;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(message, 'discord');

            case 21:
              maintenance = _context26.sent;

              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context26.next = 24;
                break;
              }

              return _context26.abrupt("return");

            case 24:
              if (!(groupTask && groupTask.banned)) {
                _context26.next = 28;
                break;
              }

              _context26.next = 27;
              return message.channel.send({
                embeds: [(0, _embeds.discordServerBannedMessage)(groupTask)]
              })["catch"](function (e) {
                console.log(e);
              });

            case 27:
              return _context26.abrupt("return");

            case 28:
              if (!(channelTask && channelTask.banned)) {
                _context26.next = 32;
                break;
              }

              _context26.next = 31;
              return message.channel.send({
                embeds: [(0, _embeds.discordChannelBannedMessage)(channelTask)]
              })["catch"](function (e) {
                console.log(e);
              });

            case 31:
              return _context26.abrupt("return");

            case 32:
              if (!(lastSeenDiscordTask && lastSeenDiscordTask.banned)) {
                _context26.next = 36;
                break;
              }

              _context26.next = 35;
              return message.channel.send({
                embeds: [(0, _embeds.discordUserBannedMessage)(lastSeenDiscordTask)]
              })["catch"](function (e) {
                console.log(e);
              });

            case 35:
              return _context26.abrupt("return");

            case 36:
              if (!(filteredMessageDiscord[1] === undefined)) {
                _context26.next = 44;
                break;
              }

              _context26.next = 39;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'Help');

            case 39:
              limited = _context26.sent;

              if (!limited) {
                _context26.next = 42;
                break;
              }

              return _context26.abrupt("return");

            case 42:
              _context26.next = 44;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18() {
                var task;
                return _regenerator["default"].wrap(function _callee18$(_context18) {
                  while (1) {
                    switch (_context18.prev = _context18.next) {
                      case 0:
                        _context18.next = 2;
                        return (0, _help.discordHelp)(discordClient, message, io);

                      case 2:
                        task = _context18.sent;

                      case 3:
                      case "end":
                        return _context18.stop();
                    }
                  }
                }, _callee18);
              })));

            case 44:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'help')) {
                _context26.next = 52;
                break;
              }

              _context26.next = 47;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'Help');

            case 47:
              _limited7 = _context26.sent;

              if (!_limited7) {
                _context26.next = 50;
                break;
              }

              return _context26.abrupt("return");

            case 50:
              _context26.next = 52;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19() {
                var task;
                return _regenerator["default"].wrap(function _callee19$(_context19) {
                  while (1) {
                    switch (_context19.prev = _context19.next) {
                      case 0:
                        _context19.next = 2;
                        return (0, _help.discordHelp)(discordClient, message, io);

                      case 2:
                        task = _context19.sent;

                      case 3:
                      case "end":
                        return _context19.stop();
                    }
                  }
                }, _callee19);
              })));

            case 52:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'help')) {
                _context26.next = 60;
                break;
              }

              _context26.next = 55;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'Help');

            case 55:
              _limited8 = _context26.sent;

              if (!_limited8) {
                _context26.next = 58;
                break;
              }

              return _context26.abrupt("return");

            case 58:
              _context26.next = 60;
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

            case 60:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'account')) {
                _context26.next = 68;
                break;
              }

              _context26.next = 63;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'Account');

            case 63:
              _limited9 = _context26.sent;

              if (!_limited9) {
                _context26.next = 66;
                break;
              }

              return _context26.abrupt("return");

            case 66:
              _context26.next = 68;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee21() {
                var task;
                return _regenerator["default"].wrap(function _callee21$(_context21) {
                  while (1) {
                    switch (_context21.prev = _context21.next) {
                      case 0:
                        _context21.next = 2;
                        return (0, _account.discordAccount)(message, io);

                      case 2:
                        task = _context21.sent;

                      case 3:
                      case "end":
                        return _context21.stop();
                    }
                  }
                }, _callee21);
              })));

            case 68:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'link')) {
                _context26.next = 77;
                break;
              }

              _context26.next = 71;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'Link');

            case 71:
              _limited10 = _context26.sent;

              if (!_limited10) {
                _context26.next = 74;
                break;
              }

              return _context26.abrupt("return");

            case 74:
              _context26.next = 76;
              return (0, _link.discordLinkAddress)(discordClient, message, io);

            case 76:
              task = _context26.sent;

            case 77:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'unlink')) {
                _context26.next = 86;
                break;
              }

              _context26.next = 80;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'Unlink');

            case 80:
              _limited11 = _context26.sent;

              if (!_limited11) {
                _context26.next = 83;
                break;
              }

              return _context26.abrupt("return");

            case 83:
              _context26.next = 85;
              return (0, _unlink.discordUnlinkAddress)(discordClient, message, io);

            case 85:
              _task2 = _context26.sent;

            case 86:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'myrank')) {
                _context26.next = 94;
                break;
              }

              _context26.next = 89;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'Myrank');

            case 89:
              _limited12 = _context26.sent;

              if (!_limited12) {
                _context26.next = 92;
                break;
              }

              return _context26.abrupt("return");

            case 92:
              _context26.next = 94;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee22() {
                var task;
                return _regenerator["default"].wrap(function _callee22$(_context22) {
                  while (1) {
                    switch (_context22.prev = _context22.next) {
                      case 0:
                        _context22.next = 2;
                        return (0, _myrank.discordMyRank)(discordClient, message, io);

                      case 2:
                        task = _context22.sent;

                      case 3:
                      case "end":
                        return _context22.stop();
                    }
                  }
                }, _callee22);
              })));

            case 94:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'ranks')) {
                _context26.next = 102;
                break;
              }

              _context26.next = 97;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'Ranks');

            case 97:
              _limited13 = _context26.sent;

              if (!_limited13) {
                _context26.next = 100;
                break;
              }

              return _context26.abrupt("return");

            case 100:
              _context26.next = 102;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee23() {
                var task;
                return _regenerator["default"].wrap(function _callee23$(_context23) {
                  while (1) {
                    switch (_context23.prev = _context23.next) {
                      case 0:
                        _context23.next = 2;
                        return (0, _ranks.discordRanks)(discordClient, message, io);

                      case 2:
                        task = _context23.sent;

                      case 3:
                      case "end":
                        return _context23.stop();
                    }
                  }
                }, _callee23);
              })));

            case 102:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'leaderboard')) {
                _context26.next = 113;
                break;
              }

              _context26.next = 105;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'Leaderboard');

            case 105:
              _limited14 = _context26.sent;

              if (!_limited14) {
                _context26.next = 108;
                break;
              }

              return _context26.abrupt("return");

            case 108:
              _context26.next = 110;
              return _models["default"].setting.findOne();

            case 110:
              _setting2 = _context26.sent;
              _context26.next = 113;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee24() {
                var task;
                return _regenerator["default"].wrap(function _callee24$(_context24) {
                  while (1) {
                    switch (_context24.prev = _context24.next) {
                      case 0:
                        _context24.next = 2;
                        return (0, _leaderboard.discordLeaderboard)(discordClient, message, _setting2, io);

                      case 2:
                        task = _context24.sent;

                      case 3:
                      case "end":
                        return _context24.stop();
                    }
                  }
                }, _callee24);
              })));

            case 113:
              if (!(filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'mostactive')) {
                _context26.next = 124;
                break;
              }

              _context26.next = 116;
              return (0, _rateLimit.myRateLimiter)(discordClient, message, 'MostActive');

            case 116:
              _limited15 = _context26.sent;

              if (!_limited15) {
                _context26.next = 119;
                break;
              }

              return _context26.abrupt("return");

            case 119:
              _context26.next = 121;
              return _models["default"].setting.findOne();

            case 121:
              _setting3 = _context26.sent;
              _context26.next = 124;
              return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee25() {
                var task;
                return _regenerator["default"].wrap(function _callee25$(_context25) {
                  while (1) {
                    switch (_context25.prev = _context25.next) {
                      case 0:
                        _context25.next = 2;
                        return (0, _mostActive.discordMostActive)(discordClient, message, _setting3, io);

                      case 2:
                        task = _context25.sent;

                      case 3:
                      case "end":
                        return _context25.stop();
                    }
                  }
                }, _callee25);
              })));

            case 124:
            case "end":
              return _context26.stop();
          }
        }
      }, _callee26);
    }));

    return function (_x8) {
      return _ref16.apply(this, arguments);
    };
  }());
};

exports.discordRouter = discordRouter;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchDiscordChannel = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _discord = require("discord.js");

var fetchDiscordChannel = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(discordClient, message) {
    var discordChannel, discordUserDMChannel;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(message.channel.type === _discord.ChannelType.DM)) {
              _context.next = 7;
              break;
            }

            _context.next = 3;
            return discordClient.channels.cache.get(message.channelId);

          case 3:
            discordChannel = _context.sent;
            _context.next = 6;
            return discordClient.channels.cache.get(message.channelId);

          case 6:
            discordUserDMChannel = _context.sent;

          case 7:
            if (!(message.channel.type === _discord.ChannelType.GuildText)) {
              _context.next = 27;
              break;
            }

            console.log(message);
            _context.next = 11;
            return discordClient.channels.cache.get(message.channelId);

          case 11:
            discordChannel = _context.sent;

            if (!(message.type && message.type === _discord.InteractionType.ApplicationCommand)) {
              _context.next = 18;
              break;
            }

            _context.next = 15;
            return discordClient.users.cache.get(message.user.id);

          case 15:
            discordUserDMChannel = _context.sent;
            _context.next = 27;
            break;

          case 18:
            if (!(message.type === _discord.MessageType.Default || message.type === _discord.MessageType.Reply)) {
              _context.next = 24;
              break;
            }

            _context.next = 21;
            return discordClient.users.cache.get(message.author.id);

          case 21:
            discordUserDMChannel = _context.sent;
            _context.next = 27;
            break;

          case 24:
            _context.next = 26;
            return discordClient.users.cache.get(message.user.id);

          case 26:
            discordUserDMChannel = _context.sent;

          case 27:
            return _context.abrupt("return", [discordChannel, discordUserDMChannel]);

          case 28:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchDiscordChannel(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchDiscordChannel = fetchDiscordChannel;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeCripttyRole = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../../../../models"));

var removeCripttyRole = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(userWithNFT, member, rolesLost, t) {
    var findCrypttiHolderRole, findUserRoleCrypttiHolder;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _models["default"].role.findOne({
              where: {
                name: 'Criptty holder'
              },
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 2:
            findCrypttiHolderRole = _context.sent;
            _context.next = 5;
            return _models["default"].UserRole.findOne({
              where: {
                userId: userWithNFT.id,
                roleId: findCrypttiHolderRole.id
              },
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 5:
            findUserRoleCrypttiHolder = _context.sent;

            if (!findUserRoleCrypttiHolder) {
              _context.next = 9;
              break;
            }

            _context.next = 9;
            return findUserRoleCrypttiHolder.destroy({
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 9:
            if (!member.roles.cache.has(findCrypttiHolderRole.discordRoleId)) {
              _context.next = 13;
              break;
            }

            _context.next = 12;
            return member.roles.remove(findCrypttiHolderRole.discordRoleId);

          case 12:
            rolesLost.push(findCrypttiHolderRole.discordRoleId);

          case 13:
            return _context.abrupt("return", [rolesLost]);

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function removeCripttyRole(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.removeCripttyRole = removeCripttyRole;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addGeneralHolderRole = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../../../../models"));

var addGeneralHolderRole = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(linkedAddress, member, rolesEarned, t) {
    var findGeneralHolderRole, findUserRoleGeneralHolder;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log(linkedAddress);
            _context.next = 3;
            return _models["default"].role.findOne({
              where: {
                name: 'General holder'
              },
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 3:
            findGeneralHolderRole = _context.sent;
            console.log(findGeneralHolderRole);
            console.log('findGeneralHolderRole');
            _context.next = 8;
            return _models["default"].UserRole.findOne({
              where: {
                userId: linkedAddress.user.id,
                roleId: findGeneralHolderRole.id
              },
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 8:
            findUserRoleGeneralHolder = _context.sent;
            console.log('4');

            if (findUserRoleGeneralHolder) {
              _context.next = 17;
              break;
            }

            _context.next = 13;
            return _models["default"].UserRole.create({
              userId: linkedAddress.user.id,
              roleId: findGeneralHolderRole.id
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 13:
            if (member.roles.cache.has(findGeneralHolderRole.discordRoleId)) {
              _context.next = 16;
              break;
            }

            _context.next = 16;
            return member.roles.add(findGeneralHolderRole.discordRoleId);

          case 16:
            rolesEarned.push(findGeneralHolderRole.discordRoleId);

          case 17:
            console.log('5');
            return _context.abrupt("return", [rolesEarned]);

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function addGeneralHolderRole(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.addGeneralHolderRole = addGeneralHolderRole;
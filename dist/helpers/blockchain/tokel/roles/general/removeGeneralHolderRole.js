"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeGeneralHolderRole = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../../../../models"));

var removeGeneralHolderRole = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(userWithNFT, member, rolesLost, t) {
    var findGeneralHolderRole, findUserRoleGeneralHolder;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _models["default"].role.findOne({
              where: {
                name: 'General holder'
              },
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 2:
            findGeneralHolderRole = _context.sent;
            console.log(findGeneralHolderRole);
            console.log('findGeneralHolderRole');
            _context.next = 7;
            return _models["default"].UserRole.findOne({
              where: {
                userId: userWithNFT.id,
                roleId: findGeneralHolderRole.id
              },
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 7:
            findUserRoleGeneralHolder = _context.sent;

            if (!findUserRoleGeneralHolder) {
              _context.next = 11;
              break;
            }

            _context.next = 11;
            return findUserRoleGeneralHolder.destroy({
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 11:
            if (!member.roles.cache.has(findGeneralHolderRole.discordRoleId)) {
              _context.next = 15;
              break;
            }

            _context.next = 14;
            return member.roles.remove(findGeneralHolderRole.discordRoleId);

          case 14:
            rolesLost.push(findGeneralHolderRole.discordRoleId);

          case 15:
            return _context.abrupt("return", [rolesLost]);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function removeGeneralHolderRole(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.removeGeneralHolderRole = removeGeneralHolderRole;
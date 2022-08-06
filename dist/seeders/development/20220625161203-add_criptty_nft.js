"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

module.exports = {
  up: function () {
    var _up = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(queryInterface, Sequelize) {
      var criptty;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return queryInterface.rawSelect('nftCollection', {
                where: {
                  name: 'criptty'
                }
              }, ['id']);

            case 2:
              criptty = _context.sent;
              _context.next = 5;
              return queryInterface.bulkInsert('nft', [{
                tokenId: '9bff65e0e0d615b9410f5f39bb6c63aea5986062f71555e9acf27c9d33945a35',
                nftCollectionId: criptty,
                createdAt: new Date(),
                updatedAt: new Date()
              }]);

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function up(_x, _x2) {
      return _up.apply(this, arguments);
    }

    return up;
  }(),
  down: function down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('nft', null, {});
  }
};
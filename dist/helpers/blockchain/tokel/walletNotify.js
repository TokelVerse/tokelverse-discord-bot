"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _rclient = require("../../../services/rclient");

var _models = _interopRequireDefault(require("../../../models"));

var _logger = _interopRequireDefault(require("../../logger"));

function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }

function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, "return": function _return(value) { var ret = this.s["return"]; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, "throw": function _throw(value) { var thr = this.s["return"]; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }

/**
 * Notify New Transaction From Tokel Node
 */
var walletNotifyTokel = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var txId, transaction, rawTransaction, userValidationAddress, userValidateLinkedAddressTransactionHash, userPubkey;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            res.locals.activity = [];
            txId = req.body.payload;
            _context2.next = 4;
            return (0, _rclient.getInstance)().getTransaction(txId);

          case 4:
            transaction = _context2.sent;
            _context2.next = 7;
            return (0, _rclient.getInstance)().getRawTransaction(txId);

          case 7:
            rawTransaction = _context2.sent;
            userValidationAddress = rawTransaction.vin[0].address;
            userValidateLinkedAddressTransactionHash = rawTransaction.vin[0].txid;
            userPubkey = rawTransaction.vin[0].scriptSig.hex.slice(-66);
            console.log(userValidationAddress);
            console.log(userPubkey);
            console.log(rawTransaction);
            _context2.next = 16;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var addressToVerify, addressVerified, insertLinkedAddressTransactionHash, i, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, detail, address, newTransaction, activity;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        //
                        res.locals.verifyAddress = {};
                        _context.next = 3;
                        return _models["default"].linkedAddress.findOne({
                          where: {
                            address: userValidationAddress,
                            enabled: true,
                            verified: false
                          },
                          include: [{
                            model: _models["default"].user,
                            as: 'user',
                            include: [{
                              model: _models["default"].wallet,
                              as: 'wallet',
                              include: [{
                                model: _models["default"].address,
                                as: 'address',
                                required: true,
                                where: {
                                  address: transaction.details[0].address
                                }
                              }]
                            }]
                          }],
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 3:
                        addressToVerify = _context.sent;

                        if (!addressToVerify) {
                          _context.next = 12;
                          break;
                        }

                        _context.next = 7;
                        return addressToVerify.update({
                          verified: true,
                          pubKey: userPubkey
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 7:
                        addressVerified = _context.sent;
                        _context.next = 10;
                        return _models["default"].linkedAddressTransactionHash.create({
                          hash: userValidateLinkedAddressTransactionHash,
                          linkedAddressId: addressVerified.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 10:
                        insertLinkedAddressTransactionHash = _context.sent;
                        res.locals.verifyAddress = {
                          userId: addressToVerify.userId,
                          discordId: addressToVerify.user.user_id,
                          linkedAddress: addressVerified.address
                        };

                      case 12:
                        //
                        i = 0;
                        res.locals.detail = [];

                        if (!(transaction.details && transaction.details.length > 0)) {
                          _context.next = 62;
                          break;
                        }

                        _iteratorAbruptCompletion = false;
                        _didIteratorError = false;
                        _context.prev = 17;
                        _iterator = _asyncIterator(transaction.details);

                      case 19:
                        _context.next = 21;
                        return _iterator.next();

                      case 21:
                        if (!(_iteratorAbruptCompletion = !(_step = _context.sent).done)) {
                          _context.next = 46;
                          break;
                        }

                        detail = _step.value;

                        if (!(detail.category === 'receive')) {
                          _context.next = 43;
                          break;
                        }

                        _context.next = 26;
                        return _models["default"].address.findOne({
                          where: {
                            address: detail.address
                          },
                          include: [{
                            model: _models["default"].wallet,
                            as: 'wallet',
                            include: [{
                              model: _models["default"].user,
                              as: 'user'
                            }]
                          }],
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 26:
                        address = _context.sent;
                        console.log(address);

                        if (!address) {
                          _context.next = 43;
                          break;
                        }

                        res.locals.detail[parseInt(i, 10)] = {};
                        res.locals.detail[parseInt(i, 10)].userId = address.wallet.user.id;
                        _context.next = 33;
                        return _models["default"].transaction.findOrCreate({
                          where: {
                            txid: transaction.txid,
                            type: detail.category,
                            userId: address.wallet.userId,
                            walletId: address.wallet.id
                          },
                          defaults: {
                            txid: txId,
                            addressId: address.id,
                            phase: 'confirming',
                            type: detail.category,
                            amount: detail.amount * 1e8,
                            userId: address.wallet.userId,
                            walletId: address.wallet.id
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 33:
                        newTransaction = _context.sent;

                        if (!newTransaction[1]) {
                          _context.next = 42;
                          break;
                        }

                        _context.next = 37;
                        return _models["default"].transaction.findOne({
                          where: {
                            id: newTransaction[0].id
                          },
                          include: [{
                            model: _models["default"].wallet,
                            as: 'wallet'
                          }],
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 37:
                        res.locals.detail[parseInt(i, 10)].transaction = _context.sent;
                        _context.next = 40;
                        return _models["default"].activity.findOrCreate({
                          where: {
                            transactionId: newTransaction[0].id
                          },
                          defaults: {
                            earnerId: address.wallet.userId,
                            type: 'depositAccepted',
                            amount: detail.amount * 1e8,
                            transactionId: newTransaction[0].id
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 40:
                        activity = _context.sent;
                        res.locals.activity.unshift(activity[0]);

                      case 42:
                        i += 1;

                      case 43:
                        _iteratorAbruptCompletion = false;
                        _context.next = 19;
                        break;

                      case 46:
                        _context.next = 52;
                        break;

                      case 48:
                        _context.prev = 48;
                        _context.t0 = _context["catch"](17);
                        _didIteratorError = true;
                        _iteratorError = _context.t0;

                      case 52:
                        _context.prev = 52;
                        _context.prev = 53;

                        if (!(_iteratorAbruptCompletion && _iterator["return"] != null)) {
                          _context.next = 57;
                          break;
                        }

                        _context.next = 57;
                        return _iterator["return"]();

                      case 57:
                        _context.prev = 57;

                        if (!_didIteratorError) {
                          _context.next = 60;
                          break;
                        }

                        throw _iteratorError;

                      case 60:
                        return _context.finish(57);

                      case 61:
                        return _context.finish(52);

                      case 62:
                        t.afterCommit(function () {
                          next();
                          console.log('commited');
                        });

                      case 63:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[17, 48, 52, 62], [53,, 57, 61]]);
              }));

              return function (_x4) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function walletNotifyTokel(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var _default = walletNotifyTokel;
exports["default"] = _default;
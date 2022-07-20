"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchTokelDeposits = patchTokelDeposits;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../../models"));

var _rclient = require("../../../services/rclient");

var _embeds = require("../../../embeds");

function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }

function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, "return": function _return(value) { var ret = this.s["return"]; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, "throw": function _throw(value) { var thr = this.s["return"]; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }

function patchTokelDeposits(_x) {
  return _patchTokelDeposits.apply(this, arguments);
}

function _patchTokelDeposits() {
  _patchTokelDeposits = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(discordClient) {
    var transactions, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

    return _regenerator["default"].wrap(function _callee3$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return (0, _rclient.getInstance)().listTransactions(1000);

          case 2:
            transactions = _context4.sent;
            _iteratorAbruptCompletion = false;
            _didIteratorError = false;
            _context4.prev = 5;
            _loop = /*#__PURE__*/_regenerator["default"].mark(function _loop() {
              var trans, address, verifyAddress, rawTransaction, userValidationAddress, userValidateLinkedAddressTransactionHash, userPubkey;
              return _regenerator["default"].wrap(function _loop$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      trans = _step.value;

                      if (!(trans.category === 'receive')) {
                        _context3.next = 16;
                        break;
                      }

                      if (!trans.address) {
                        _context3.next = 16;
                        break;
                      }

                      _context3.next = 5;
                      return _models["default"].address.findOne({
                        where: {
                          address: trans.address
                        },
                        include: [{
                          model: _models["default"].wallet,
                          as: 'wallet'
                        }]
                      });

                    case 5:
                      address = _context3.sent;
                      verifyAddress = {};

                      if (!address) {
                        _context3.next = 16;
                        break;
                      }

                      _context3.next = 10;
                      return (0, _rclient.getInstance)().getRawTransaction(trans.txid);

                    case 10:
                      rawTransaction = _context3.sent;
                      userValidationAddress = rawTransaction.vin[0].address;
                      userValidateLinkedAddressTransactionHash = rawTransaction.vin[0].txid;
                      userPubkey = rawTransaction.vin[0].scriptSig.hex.slice(-66);
                      _context3.next = 16;
                      return _models["default"].sequelize.transaction({
                        isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
                      }, /*#__PURE__*/function () {
                        var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(t) {
                          var addressToVerify, linkedAddressHashExists, addressVerified, insertLinkedAddressTransactionHash, newTrans;
                          return _regenerator["default"].wrap(function _callee2$(_context2) {
                            while (1) {
                              switch (_context2.prev = _context2.next) {
                                case 0:
                                  _context2.next = 2;
                                  return _models["default"].linkedAddress.findOne({
                                    where: {
                                      address: userValidationAddress,
                                      enabled: true,
                                      verified: false
                                    },
                                    include: [{
                                      model: _models["default"].linkedAddressTransactionHash,
                                      as: 'linkedAddressTransactionHashes'
                                    }, {
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
                                            address: trans.address
                                          }
                                        }]
                                      }]
                                    }],
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 2:
                                  addressToVerify = _context2.sent;

                                  if (!addressToVerify) {
                                    _context2.next = 13;
                                    break;
                                  }

                                  linkedAddressHashExists = addressToVerify.linkedAddressTransactionHashes.find(function (o) {
                                    return o.hash === userValidateLinkedAddressTransactionHash;
                                  });

                                  if (linkedAddressHashExists) {
                                    _context2.next = 13;
                                    break;
                                  }

                                  _context2.next = 8;
                                  return addressToVerify.update({
                                    verified: true,
                                    pubKey: userPubkey
                                  }, {
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 8:
                                  addressVerified = _context2.sent;
                                  _context2.next = 11;
                                  return _models["default"].linkedAddressTransactionHash.create({
                                    hash: userValidateLinkedAddressTransactionHash,
                                    linkedAddressId: addressVerified.id
                                  }, {
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 11:
                                  insertLinkedAddressTransactionHash = _context2.sent;
                                  verifyAddress = {
                                    userId: addressToVerify.userId,
                                    discordId: addressToVerify.user.user_id,
                                    linkedAddress: addressVerified.address
                                  };

                                case 13:
                                  _context2.next = 15;
                                  return _models["default"].transaction.findOrCreate({
                                    where: {
                                      txid: trans.txid,
                                      type: trans.category,
                                      userId: address.wallet.userId
                                    },
                                    defaults: {
                                      txid: trans.txid,
                                      addressId: address.id,
                                      phase: 'confirming',
                                      type: trans.category,
                                      amount: trans.amount * 1e8,
                                      userId: address.wallet.userId
                                    },
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 15:
                                  newTrans = _context2.sent;
                                  t.afterCommit( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
                                    var myClient;
                                    return _regenerator["default"].wrap(function _callee$(_context) {
                                      while (1) {
                                        switch (_context.prev = _context.next) {
                                          case 0:
                                            console.log('commited');

                                            if (!(verifyAddress && Object.keys(verifyAddress).length > 0)) {
                                              _context.next = 7;
                                              break;
                                            }

                                            _context.next = 4;
                                            return discordClient.users.fetch(verifyAddress.discordId, false);

                                          case 4:
                                            myClient = _context.sent;
                                            _context.next = 7;
                                            return myClient.send({
                                              embeds: [(0, _embeds.linkedAddressVerified)(verifyAddress.discordId, verifyAddress.linkedAddress)]
                                            })["catch"](function (error) {
                                              console.log(error);
                                            });

                                          case 7:
                                          case "end":
                                            return _context.stop();
                                        }
                                      }
                                    }, _callee);
                                  })));

                                case 17:
                                case "end":
                                  return _context2.stop();
                              }
                            }
                          }, _callee2);
                        }));

                        return function (_x2) {
                          return _ref.apply(this, arguments);
                        };
                      }());

                    case 16:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _loop);
            });
            _iterator = _asyncIterator(transactions);

          case 8:
            _context4.next = 10;
            return _iterator.next();

          case 10:
            if (!(_iteratorAbruptCompletion = !(_step = _context4.sent).done)) {
              _context4.next = 15;
              break;
            }

            return _context4.delegateYield(_loop(), "t0", 12);

          case 12:
            _iteratorAbruptCompletion = false;
            _context4.next = 8;
            break;

          case 15:
            _context4.next = 21;
            break;

          case 17:
            _context4.prev = 17;
            _context4.t1 = _context4["catch"](5);
            _didIteratorError = true;
            _iteratorError = _context4.t1;

          case 21:
            _context4.prev = 21;
            _context4.prev = 22;

            if (!(_iteratorAbruptCompletion && _iterator["return"] != null)) {
              _context4.next = 26;
              break;
            }

            _context4.next = 26;
            return _iterator["return"]();

          case 26:
            _context4.prev = 26;

            if (!_didIteratorError) {
              _context4.next = 29;
              break;
            }

            throw _iteratorError;

          case 29:
            return _context4.finish(26);

          case 30:
            return _context4.finish(21);

          case 31:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee3, null, [[5, 17, 21, 31], [22,, 26, 30]]);
  }));
  return _patchTokelDeposits.apply(this, arguments);
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatch = undefined;

var _functions = require('./functions');

var functions = _interopRequireWildcard(_functions);

var _validations = require('./validations');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var dispatch = exports.dispatch = function dispatch(name, args) {
  if (functionValidations[name]) {
    functionValidations[name](name)(args);
  }
  return functions['sf$' + name].apply(functions, _toConsumableArray(args));
};

var functionValidations = {
  exponentiate: (0, _validations.validateNumOfParams)(2),
  and: (0, _validations.validateNumOfParams)(2),
  or: (0, _validations.validateNumOfParams)(2),
  not: (0, _validations.validateNumOfParams)(1),
  if: (0, _validations.validateNumOfParams)(3),
  equal: (0, _validations.validateNumOfParams)(2),
  unequal: (0, _validations.validateNumOfParams)(2),
  greaterThan: (0, _validations.validateNumOfParams)(2),
  greaterThanOrEqual: (0, _validations.validateNumOfParams)(2),
  lessThan: (0, _validations.validateNumOfParams)(2),
  lessThanOrEqual: (0, _validations.validateNumOfParams)(2),
  abs: (0, _validations.validateNumOfParams)(1),
  ceiling: (0, _validations.validateNumOfParams)(1),
  exp: (0, _validations.validateNumOfParams)(1),
  floor: (0, _validations.validateNumOfParams)(1),
  ln: (0, _validations.validateNumOfParams)(1),
  log: (0, _validations.validateNumOfParams)(1),
  mod: (0, _validations.validateNumOfParams)(2),
  round: (0, _validations.validateNumOfParams)(2),
  sqrt: (0, _validations.validateNumOfParams)(1),
  begins: (0, _validations.validateNumOfParams)(2),
  br: (0, _validations.validateNumOfParams)(0),
  contains: (0, _validations.validateNumOfParams)(2),
  left: (0, _validations.validateNumOfParams)(2),
  len: (0, _validations.validateNumOfParams)(1),
  mid: (0, _validations.validateNumOfParams)(3),
  right: (0, _validations.validateNumOfParams)(2),
  trim: (0, _validations.validateNumOfParams)(1),
  regex: (0, _validations.validateNumOfParams)(3)
};
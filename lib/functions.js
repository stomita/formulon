'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sf$regex = exports.sf$upper = exports.sf$trim = exports.sf$right = exports.sf$mid = exports.sf$rpad = exports.sf$lpad = exports.sf$lower = exports.sf$len = exports.sf$left = exports.sf$find = exports.sf$contains = exports.sf$br = exports.sf$begins = exports.sf$sqrt = exports.sf$round = exports.sf$mod = exports.sf$min = exports.sf$max = exports.sf$log = exports.sf$ln = exports.sf$floor = exports.sf$exp = exports.sf$ceiling = exports.sf$abs = exports.sf$lessThanOrEqual = exports.sf$lessThan = exports.sf$greaterThanOrEqual = exports.sf$greaterThan = exports.sf$unequal = exports.sf$equal = exports.sf$if = exports.sf$not = exports.sf$or = exports.sf$case = exports.sf$and = exports.sf$exponentiate = exports.sf$multiply = exports.sf$add = exports.sf$invert = exports.sf$negate = undefined;

var _utils = require('./utils');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Math Operators

var sf$negate = exports.sf$negate = function sf$negate(value) {
  return (0, _utils.buildLiteralFromJs)(-1 * value.value);
};

var sf$invert = exports.sf$invert = function sf$invert(value) {
  return (0, _utils.buildLiteralFromJs)(1.0 / value.value);
};

var sf$add = exports.sf$add = function sf$add() {
  for (var _len = arguments.length, input = Array(_len), _key = 0; _key < _len; _key++) {
    input[_key] = arguments[_key];
  }

  var values = input.map(function (v) {
    return v.value;
  });
  return (0, _utils.buildLiteralFromJs)(values.reduce(function (a, b) {
    return a + b;
  }));
};

var sf$multiply = exports.sf$multiply = function sf$multiply() {
  for (var _len2 = arguments.length, input = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    input[_key2] = arguments[_key2];
  }

  var values = input.map(function (v) {
    return v.value;
  });
  return (0, _utils.buildLiteralFromJs)(values.reduce(function (a, b) {
    return a * b;
  }));
};

var sf$exponentiate = exports.sf$exponentiate = function sf$exponentiate(value1, value2) {
  return (0, _utils.buildLiteralFromJs)(Math.pow(value1.value, value2.value));
};

// Logical Operators and Functions

var sf$and = exports.sf$and = function sf$and(logical1, logical2) {
  return (0, _utils.buildLiteralFromJs)(logical1.value && logical2.value);
};

var sf$case = exports.sf$case = function sf$case(expression) {
  var lastValueIndex = (arguments.length <= 1 ? 0 : arguments.length - 1) - 1;
  if (lastValueIndex <= 0) {
    throw new SyntaxError('Incorrect number of parameters for function \'CASE()\'. Expected 4+, received ' + (lastValueIndex + 2));
  }

  if (lastValueIndex % 2 !== 0) {
    throw new SyntaxError('Incorrect number of parameters for function \'CASE()\'. Expected ' + (lastValueIndex + 1) + ', received ' + (lastValueIndex + 2));
  }
  for (var index = 0; index < lastValueIndex; index += 2) {
    if (sf$equal(arguments.length <= index + 1 ? undefined : arguments[index + 1], expression).value) {
      return arguments.length <= index + 1 + 1 ? undefined : arguments[index + 1 + 1];
    }
  }
  return arguments.length <= lastValueIndex + 1 ? undefined : arguments[lastValueIndex + 1];
};

var sf$or = exports.sf$or = function sf$or(logical1, logical2) {
  return (0, _utils.buildLiteralFromJs)(logical1.value || logical2.value);
};

var sf$not = exports.sf$not = function sf$not(logical) {
  return (0, _utils.buildLiteralFromJs)(!logical.value);
};

var sf$if = exports.sf$if = function sf$if(logicalTest, valueIfTrue, valueIfFalse) {
  return logicalTest.value ? valueIfTrue : valueIfFalse;
};

var sf$equal = exports.sf$equal = function sf$equal(value1, value2) {
  return (0, _utils.buildLiteralFromJs)(value1.value === value2.value);
};

var sf$unequal = exports.sf$unequal = function sf$unequal(value1, value2) {
  return (0, _utils.buildLiteralFromJs)(value1.value !== value2.value);
};

var sf$greaterThan = exports.sf$greaterThan = function sf$greaterThan(value1, value2) {
  return (0, _utils.buildLiteralFromJs)(value1.value > value2.value);
};

var sf$greaterThanOrEqual = exports.sf$greaterThanOrEqual = function sf$greaterThanOrEqual(value1, value2) {
  return (0, _utils.buildLiteralFromJs)(value1.value >= value2.value);
};

var sf$lessThan = exports.sf$lessThan = function sf$lessThan(value1, value2) {
  return (0, _utils.buildLiteralFromJs)(value1.value < value2.value);
};

var sf$lessThanOrEqual = exports.sf$lessThanOrEqual = function sf$lessThanOrEqual(value1, value2) {
  return (0, _utils.buildLiteralFromJs)(value1.value <= value2.value);
};

// Math Functions

var sf$abs = exports.sf$abs = function sf$abs(number) {
  return (0, _utils.buildLiteralFromJs)(Math.abs(number.value));
};

var sf$ceiling = exports.sf$ceiling = function sf$ceiling(number) {
  return (0, _utils.buildLiteralFromJs)(Math.ceil(number.value));
};

var sf$exp = exports.sf$exp = function sf$exp(number) {
  return (0, _utils.buildLiteralFromJs)(Math.exp(number.value));
};

var sf$floor = exports.sf$floor = function sf$floor(number) {
  return (0, _utils.buildLiteralFromJs)(Math.floor(number.value));
};

var sf$ln = exports.sf$ln = function sf$ln(number) {
  return (0, _utils.buildLiteralFromJs)(Math.log(number.value));
};

var sf$log = exports.sf$log = function sf$log(number) {
  return (0, _utils.buildLiteralFromJs)(Math.log10(number.value));
};

var sf$max = exports.sf$max = function sf$max() {
  for (var _len3 = arguments.length, numbers = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    numbers[_key3] = arguments[_key3];
  }

  var values = numbers.map(function (v) {
    return v.value;
  });
  return (0, _utils.buildLiteralFromJs)(Math.max.apply(Math, _toConsumableArray(values)));
};

var sf$min = exports.sf$min = function sf$min() {
  for (var _len4 = arguments.length, numbers = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    numbers[_key4] = arguments[_key4];
  }

  var values = numbers.map(function (v) {
    return v.value;
  });
  return (0, _utils.buildLiteralFromJs)(Math.min.apply(Math, _toConsumableArray(values)));
};

var sf$mod = exports.sf$mod = function sf$mod(number, divisor) {
  return (0, _utils.buildLiteralFromJs)(number.value % divisor.value);
};

var sf$round = exports.sf$round = function sf$round(number, numDigits) {
  return (0, _utils.buildLiteralFromJs)((0, _utils.sfRound)(number.value, numDigits.value));
};

var sf$sqrt = exports.sf$sqrt = function sf$sqrt(number) {
  return (0, _utils.buildLiteralFromJs)(Math.sqrt(number.value));
};

// Text Functions

var sf$begins = exports.sf$begins = function sf$begins(text, compareText) {
  return (0, _utils.buildLiteralFromJs)(text.value.startsWith(compareText.value));
};

var sf$br = exports.sf$br = function sf$br() {
  return (0, _utils.buildLiteralFromJs)('\n');
};

var sf$contains = exports.sf$contains = function sf$contains(text, compareText) {
  return (0, _utils.buildLiteralFromJs)(text.value.includes(compareText.value));
};

var sf$find = exports.sf$find = function sf$find(searchText, text) {
  var startNum = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : (0, _utils.buildLiteralFromJs)(1);

  if (startNum.value <= 0 || searchText.value === '') {
    return (0, _utils.buildLiteralFromJs)(0);
  }

  var textToSearchIn = text.value.substring(startNum.value - 1);
  return (0, _utils.buildLiteralFromJs)(textToSearchIn.indexOf(searchText.value) + 1);
};

var sf$left = exports.sf$left = function sf$left(text, numChars) {
  return sf$mid(text, (0, _utils.buildLiteralFromJs)(1), numChars);
};

var sf$len = exports.sf$len = function sf$len(text) {
  return (0, _utils.buildLiteralFromJs)(text.value.length);
};

var sf$lower = exports.sf$lower = function sf$lower(text, locale) {
  return (0, _utils.buildLiteralFromJs)(text.value.toLowerCase());
};

var sf$lpad = exports.sf$lpad = function sf$lpad(text, paddedLength, padString) {
  if (padString == null) {
    return text;
  } else if (paddedLength.value < text.value.length) {
    return sf$left(text, paddedLength);
  }
  var maxPadding = padString.value.repeat(paddedLength.value);
  return (0, _utils.buildLiteralFromJs)((maxPadding + text.value).slice(-paddedLength.value));
};

var sf$rpad = exports.sf$rpad = function sf$rpad(text, paddedLength, padString) {
  if (padString == null) {
    return text;
  } else if (paddedLength.value < text.value.length) {
    return sf$left(text, paddedLength);
  }
  var maxPadding = padString.value.repeat(paddedLength.value);
  return (0, _utils.buildLiteralFromJs)((text.value + maxPadding).substr(0, paddedLength.value));
};

var sf$mid = exports.sf$mid = function sf$mid(text, startNum, numChars) {
  return (0, _utils.buildLiteralFromJs)(text.value.substr(startNum.value - 1, numChars.value));
};

var sf$right = exports.sf$right = function sf$right(text, numChars) {
  return (0, _utils.buildLiteralFromJs)(text.value.substr(text.value.length - numChars.value));
};

var sf$trim = exports.sf$trim = function sf$trim(text) {
  return (0, _utils.buildLiteralFromJs)(text.value.trim());
};

var sf$upper = exports.sf$upper = function sf$upper(text, locale) {
  return (0, _utils.buildLiteralFromJs)(text.value.toUpperCase());
};

// Advanced Functions

var sf$regex = exports.sf$regex = function sf$regex(text, regexText) {
  var r = new RegExp('^' + regexText.value + '$');
  return (0, _utils.buildLiteralFromJs)(r.exec(text.value) != null);
};
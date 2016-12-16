'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var buildLiteralFromJs = exports.buildLiteralFromJs = function buildLiteralFromJs(input) {
  var type = typeof input === 'undefined' ? 'undefined' : _typeof(input);
  var base = { type: 'literal', value: input };
  switch (typeof input === 'undefined' ? 'undefined' : _typeof(input)) {
    case 'number':
      return Object.assign(base, { dataType: 'number', options: calculateNumberOptions(input) });
    case 'string':
      return Object.assign(base, { dataType: 'text', options: { length: input.length } });
    case 'boolean':
      return Object.assign(base, { dataType: 'checkbox', options: {} });
    case 'object':
      return Object.assign(base, { dataType: 'complexvalue' });
    default:
      throw new TypeError('Unsupported type \'' + type + '\'');
  }
};

var arrayUnique = exports.arrayUnique = function arrayUnique(array) {
  return array.reduce(function (p, c) {
    if (p.indexOf(c) < 0) p.push(c);
    return p;
  }, []);
};

var coerceLiteral = exports.coerceLiteral = function coerceLiteral(input) {
  return Object.assign({}, input, { value: coerceValue(input.dataType, input.value, input.options) });
};

// Salesforce rounding works slightly different than JS rounding
// JS:
// Math.round(-1.5) => -1
// SF:
// ROUND(-1.5) => -2
var sfRound = exports.sfRound = function sfRound(number, numDigits) {
  if (number < 0) {
    return -1 * sfRound(number * -1, numDigits);
  }
  var multiplier = Math.pow(10, numDigits);
  return Math.round(number * multiplier) / multiplier;
};

// private

var calculateNumberOptions = function calculateNumberOptions(number) {
  var numberString = number.toString().replace('-', '');
  if (numberString.indexOf('.') !== -1) {
    var splitted = numberString.split('.');
    return {
      length: splitted[0].length,
      scale: splitted[1].length
    };
  }

  return {
    length: numberString.length,
    scale: 0
  };
};

var coerceValue = function coerceValue(dataType, value, options) {
  switch (dataType) {
    case 'number':
      return sfRound(value, options.scale);
    case 'text':
      return value.substring(0, options.length);
    default:
      return value;
  }
};
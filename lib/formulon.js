'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extract = exports.parse = exports.parseAndThrowError = undefined;

var _ast = require('./ast');

var _utils = require('./utils');

var parseAndThrowError = exports.parseAndThrowError = function parseAndThrowError(formula) {
  var substitutions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var ast = (0, _ast.build)(formula);
  var coercedSubstitions = Object.keys(substitutions).reduce(function (previous, current) {
    previous[current] = (0, _utils.coerceLiteral)(substitutions[current]);
    return previous;
  }, {});
  return (0, _ast.traverse)((0, _ast.replace)(ast, coercedSubstitions));
};

var parse = exports.parse = function parse(formula) {
  var substitutions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (formula == null || formula.trim() === '') {
    return (0, _utils.buildLiteralFromJs)('');
  }

  try {
    return parseAndThrowError(formula, substitutions);
  } catch (err) {
    return {
      type: 'error',
      errorType: err.constructor.name,
      message: err.message
    };
  }
};

var extract = exports.extract = function extract(formula) {
  if (formula == null || formula.trim() === '') {
    return [];
  }

  var ast = (0, _ast.build)(formula);
  return (0, _utils.arrayUnique)((0, _ast.extract)(ast));
};
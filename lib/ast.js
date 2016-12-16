'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = exports.evaluate = exports.replace = exports.extractFieldPath = exports.extract = exports.traverse = exports.build = undefined;

var _functionDispatcher = require('./functionDispatcher');

var _utils = require('./utils');

var build = exports.build = function build(formula) {
  var parser = require('./salesforceParser.js');
  try {
    return parser.parse(formula == null ? '' : formula.trim());
  } catch (err) {
    if (err instanceof parser.SyntaxError) {
      throw new EvalError('Parsing Error');
    }

    throw err;
  }
};

var traverse = exports.traverse = function traverse(ast) {
  switch (ast.type) {
    case 'literal':
      return ast;
    case 'callExpression':
      return (0, _functionDispatcher.dispatch)(ast.id, ast.arguments.map(function (arg) {
        return traverse(arg);
      }));
    case 'identifier':
      throw new ReferenceError('Undefined variable \'' + ast.name + '\'');
  }
};

var _extract = function _extract(ast) {
  var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  switch (ast.type) {
    case 'literal':
      return state;
    case 'callExpression':
      return ast.arguments.map(function (arg) {
        return _extract(arg, state);
      }).reduce(function (a, b) {
        return a.concat(b);
      }, []);
    case 'memberExpression':
      return state.concat(extractFieldPath(ast.object, [ast.property.name]).join('.'));
    case 'identifier':
      return state.concat(ast.name);
  }
};

exports.extract = _extract;
var extractFieldPath = exports.extractFieldPath = function extractFieldPath(ast) {
  var fields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  console.log('extractFieldPath', ast, fields);
  switch (ast.type) {
    case 'identifier':
      return [ast.name].concat(fields);
    case 'memberExpression':
      return extractFieldPath(ast.object, [ast.property.name].concat(fields));
  }
};

var replace = exports.replace = function replace(ast, replacement) {
  switch (ast.type) {
    case 'literal':
      return ast;
    case 'callExpression':
      return {
        type: 'callExpression',
        id: ast.id,
        arguments: ast.arguments.map(function (arg) {
          return replace(arg, replacement);
        })
      };
    case 'identifier':
      if (replacement[ast.name]) {
        return Object.assign({}, replacement[ast.name], { type: 'literal' });
      } else {
        return ast;
      }
  }
};

var _evaluate = function _evaluate(ast) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  switch (ast.type) {
    case 'literal':
      return ast;
    case 'callExpression':
      return (0, _functionDispatcher.dispatch)(ast.id, ast.arguments.map(function (a) {
        return _evaluate(a, context);
      }));
    case 'identifier':
      return (0, _utils.buildLiteralFromJs)(context[ast.name]);
    case 'memberExpression':
      return (0, _utils.buildLiteralFromJs)(_evaluate(ast.object, context).value[ast.property.name]);
  }
};

exports.evaluate = _evaluate;
var parse = exports.parse = function parse(formula) {
  var ast = build(formula);
  return {
    _ast: ast,
    extract: function extract() {
      return _extract(ast);
    },
    evaluate: function evaluate(context) {
      return _evaluate(ast, context).value;
    }
  };
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var validateNumOfParams = exports.validateNumOfParams = function validateNumOfParams(expectedNumOfParams) {
  return function (fnName) {
    return function (params) {
      if (params.length !== expectedNumOfParams) {
        throw new SyntaxError('Incorrect number of parameters for function \'' + fnName.toUpperCase() + '()\'. Expected ' + expectedNumOfParams + ', received ' + params.length);
      }
    };
  };
};
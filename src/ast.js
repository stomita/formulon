'use strict'
import { dispatch } from './functionDispatcher'
import { buildLiteralFromJs } from './utils'

export const build = (formula) => {
  const parser = require('./salesforceParser.js')
  try {
    return parser.parse(formula == null ? '' : formula.trim())
  } catch (err) {
    if (err instanceof parser.SyntaxError) {
      throw new EvalError('Parsing Error')
    }

    throw err
  }
}

export const traverse = (ast) => {
  switch (ast.type) {
    case 'literal':
      return ast
    case 'callExpression':
      return dispatch(ast.id, ast.arguments.map((arg) => traverse(arg)))
    case 'identifier':
      throw new ReferenceError(`Undefined variable '${ast.name}'`)
  }
}

export const extract = (ast, state = []) => {
  switch (ast.type) {
    case 'literal':
      return state
    case 'callExpression':
      return ast.arguments.map((arg) => extract(arg, state)).reduce((a, b) => { return a.concat(b) }, [])
    case 'memberExpression':
      return state.concat(extractFieldPath(ast.object, [ast.property.name]).join('.'))
    case 'identifier':
      return state.concat(ast.name)
  }
}

export const extractFieldPath = (ast, fields=[]) => {
  console.log('extractFieldPath', ast, fields);
  switch (ast.type) {
    case 'identifier':
      return [ast.name].concat(fields);
    case 'memberExpression':
      return extractFieldPath(ast.object, [ast.property.name].concat(fields))
  }
}

export const replace = (ast, replacement) => {
  switch (ast.type) {
    case 'literal':
      return ast
    case 'callExpression':
      return {
        type: 'callExpression',
        id: ast.id,
        arguments: ast.arguments.map((arg) => replace(arg, replacement))
      }
    case 'identifier':
      if (replacement[ast.name]) {
        return Object.assign(
          {},
          replacement[ast.name],
          { type: 'literal' }
        )
      } else {
        return ast
      }
  }
}

export const evaluate = (ast, context = {}) => {
  switch (ast.type) {
    case 'literal':
      return ast;
    case 'callExpression':
      return dispatch(ast.id, ast.arguments.map((a) => evaluate(a, context)))
    case 'identifier':
      return buildLiteralFromJs(context[ast.name])
    case 'memberExpression':
      return buildLiteralFromJs(evaluate(ast.object, context).value[ast.property.name])
  }
}

export const parse = (formula) => {
  const ast = build(formula)
  return {
    _ast: ast,
    extract() {
      return extract(ast)
    },
    evaluate(context) {
      return evaluate(ast, context).value
    }
  }
}

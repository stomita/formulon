/* global describe it context */

'use strict'

import { build, extract, replace, traverse } from '../lib/ast'
const expect = require('chai').expect

describe('ast', () => {
  describe('build', () => {
    context('Trimming', () => {
      it('parses AST correctly with trailing whitespace', () => {
        const expected = {
          type: 'literal',
          value: 1,
          dataType: 'number',
          options: {
            length: 1,
            scale: 0
          }
        }
        expect(build('1 ')).to.deep.equal(expected)
      })

      it('parses AST correctly with leading whitespace', () => {
        const expected = {
          type: 'literal',
          value: 2,
          dataType: 'number',
          options: {
            length: 1,
            scale: 0
          }
        }
        expect(build(' 2')).to.deep.equal(expected)
      })

      it('parses AST correctly with leading and trailing whitespace', () => {
        const expected = {
          type: 'literal',
          value: 3,
          dataType: 'number',
          options: {
            length: 1,
            scale: 0
          }
        }
        expect(build(' 3 ')).to.deep.equal(expected)
      })

      it('parses AST correctly with whitespaces in function calls', () => {
        const expected = {
          type: "callExpression",
          id: "ceiling",
          arguments: [
            {
              type: "literal",
              value: 1.9,
              dataType: "number",
              options: {
                length: 1,
                scale: 1
              }
            }
          ]
        }
        expect(build('CEILING (1.9 )')).to.deep.equal(expected)
      })
    })

    context('Function Calls', () => {
      it('function call without arguments', () => {
        const expected = {
          type: 'callExpression',
          id: 'now',
          arguments: []
        }
        expect(build('NOW()')).to.deep.equal(expected)
      })

      it('function call with single argument', () => {
        const expected = {
          type: 'callExpression',
          id: 'abs',
          arguments: [
            {
              type: 'literal',
              value: 1.5,
              dataType: 'number',
              options: {
                length: 1,
                scale: 1
              }
            }
          ]
        }
        expect(build('ABS(1.5)')).to.deep.equal(expected)
      })

      it('function call with multiple arguments', () => {
        const expected = {
          type: 'callExpression',
          id: 'mod',
          arguments: [
            {
              type: 'literal',
              value: 11,
              dataType: 'number',
              options: {
                length: 2,
                scale: 0
              }
            },
            {
              type: 'literal',
              value: 2,
              dataType: 'number',
              options: {
                length: 1,
                scale: 0
              }
            }
          ]
        }
        expect(build('MOD(11, 2)')).to.deep.equal(expected)
      })

      it('nested function calls', function() {
        this.timeout(5000)
        const expected = {
          type: 'callExpression',
          id: 'if',
          arguments: [
            {
              type: 'callExpression',
              id: 'ispickval',
              arguments: [
                { type: 'identifier', name: 'StageName' },
                {
                  type: 'literal',
                  value: 'Closed Won',
                  dataType: 'text',
                  options: {
                    length: 10
                  }
                }
              ]
            },
            { type: 'identifier', name: 'Amount' },
            {
              type: 'literal',
              value: 0,
              dataType: 'number',
              options: {
                length: 1,
                scale: 0
              }
            }
          ]
        }
        expect(build('IF(ISPICKVAL(StageName, "Closed Won"), Amount, 0)')).to.deep.equal(expected)
      })
    })

    context('Arithmetics', () => {
      it('string concatenation', () => {
        const expected = {
          type: 'callExpression',
          id: 'add',
          arguments: [
            {
              type: 'literal',
              value: 'con',
              dataType: 'text',
              options: {
                length: 3
              }
            },
            {
              type: 'literal',
              value: 'cated',
              dataType: 'text',
              options: {
                length: 5
              }
            }
          ]
        }

        expect(build('"con" & "cated"')).to.deep.equal(expected)
      })

      it('simple addition', () => {
        const expected = {
          type: 'callExpression',
          id: 'add',
          arguments: [
            {
              type: 'literal',
              value: 1.5,
              dataType: 'number',
              options: {
                length: 1,
                scale: 1
              }
            },
            {
              type: 'literal',
              value: 2,
              dataType: 'number',
              options: {
                length: 1,
                scale: 0
              }
            }
          ]
        }
        expect(build('1.5 + 2')).to.deep.equal(expected)
      })

      it('simple subtraction', () => {
        const expected = {
          type: 'callExpression',
          id: 'add',
          arguments: [
            {
              type: 'literal',
              value: 1,
              dataType: 'number',
              options: {
                length: 1,
                scale: 0
              }
            },
            {
              type: "callExpression",
              id: "negate",
              arguments: [
                {
                  type: 'literal',
                  value: 10,
                  dataType: 'number',
                  options: {
                    length: 2,
                    scale: 0
                  }
                }
              ]
            }
          ]
        }
        expect(build('1 - 10')).to.deep.equal(expected)
      })

      it('addition with more than 2 arguments', () => {
        const expected = {
          type: 'callExpression',
          id: 'add',
          arguments: [
            {
              type: 'literal',
              value: 1,
              dataType: 'number',
              options: {
                length: 1,
                scale: 0
              }
            },
            {
              type: 'literal',
              value: 2,
              dataType: 'number',
              options: {
                length: 1,
                scale: 0
              }
            },
            {
              type: 'literal',
              value: 3,
              dataType: 'number',
              options: {
                length: 1,
                scale: 0
              }
            }
          ]
        }
        expect(build('1 + 2 + 3')).to.deep.equal(expected)
      })

      it('addition with function', () => {
        const expected = {
          type: 'callExpression',
          id: 'add',
          arguments: [
            {
              type: 'callExpression',
              id: 'max',
              arguments: [
                {
                  type: 'literal',
                  value: 1,
                  dataType: 'number',
                  options: {
                    length: 1,
                    scale: 0
                  }
                },
                {
                  type: 'literal',
                  value: 3,
                  dataType: 'number',
                  options: {
                    length: 1,
                    scale: 0
                  }
                }
              ]
            },
            {
              type: 'literal',
              value: 7,
              dataType: 'number',
              options: {
                length: 1,
                scale: 0
              }
            }
          ]
        }

        expect(build('MAX(1,3) + 7')).to.deep.equal(expected)
      })

      it('simple multiplication', () => {
        const expected = {
          type: 'callExpression',
          id: 'multiply',
          arguments: [
            {
              type: 'literal',
              value: 7,
              dataType: 'number',
              options: {
                length: 1,
                scale: 0
              }
            },
            {
              type: 'literal',
              value: 8,
              dataType: 'number',
              options: {
                length: 1,
                scale: 0
              }
            }
          ]
        }
        expect(build('7 * 8')).to.deep.equal(expected)
      })

      it('simple division', () => {
        const expected = {
          type: 'callExpression',
          id: 'multiply',
          arguments: [
            {
              type: 'literal',
              value: 100,
              dataType: 'number',
              options: {
                length: 3,
                scale: 0
              }
            },
            {
              type: "callExpression",
              id: "invert",
              arguments: [
                {
                  type: 'literal',
                  value: 25,
                  dataType: 'number',
                  options: {
                    length: 2,
                    scale: 0
                  }
                }
              ]
            }
          ]
        }
        expect(build('100 / 25')).to.deep.equal(expected)
      })

      it('addition and multiplication (multiplication first)', () => {
        const expected = {
          type: 'callExpression',
          id: 'add',
          arguments: [
            {
              type: 'callExpression',
              id: 'multiply',
              arguments: [
                {
                  type: 'literal',
                  value: 7,
                  dataType: 'number',
                  options: {
                    length: 1,
                    scale: 0
                  }
                },
                {
                  type: 'literal',
                  value: 8,
                  dataType: 'number',
                  options: {
                    length: 1,
                    scale: 0
                  }
                }
              ]
            },
            {
              type: 'literal',
              value: 5,
              dataType: 'number',
              options: {
                length: 1,
                scale: 0
              }
            }
          ]
        }
        expect(build('7 * 8 + 5')).to.deep.equal(expected)
      })

      it('addition and multiplication (addition first)', () => {
        const expected = {
          type: 'callExpression',
          id: 'add',
          arguments: [
            {
              type: 'literal',
              value: 5,
              dataType: 'number',
              options: {
                length: 1,
                scale: 0
              }
            },
            {
              type: 'callExpression',
              id: 'multiply',
              arguments: [
                {
                  type: 'literal',
                  value: 7,
                  dataType: 'number',
                  options: {
                    length: 1,
                    scale: 0
                  }
                },
                {
                  type: 'literal',
                  value: 8,
                  dataType: 'number',
                  options: {
                    length: 1,
                    scale: 0
                  }
                }
              ]
            }
          ]
        }
        expect(build('5 + 7 * 8')).to.deep.equal(expected)
      })

      it('addition and multiplication with parentheses', () => {
        const expected = {
          type: 'callExpression',
          id: 'multiply',
          arguments: [
            {
              type: 'literal',
              value: 7,
              dataType: 'number',
              options: {
                length: 1,
                scale: 0
              }
            },
            {
              type: 'callExpression',
              id: 'add',
              arguments: [
                {
                  type: 'literal',
                  value: 8,
                  dataType: 'number',
                  options: {
                    length: 1,
                    scale: 0
                  }
                },
                {
                  type: 'literal',
                  value: 5,
                  dataType: 'number',
                  options: {
                    length: 1,
                    scale: 0
                  }
                }]
            }
          ]
        }
        expect(build('7 * (8 + 5)')).to.deep.equal(expected)
      })

      it('simple exponentiation', () => {
        const expected = {
          type: 'callExpression',
          id: 'exponentiate',
          arguments: [
            {
              type: 'literal',
              value: 2,
              dataType: 'number',
              options: {
                length: 1,
                scale: 0
              }
            },
            {
              type: 'literal',
              value: 8,
              dataType: 'number',
              options: {
                length: 1,
                scale: 0
              }
            }
          ]
        }
        expect(build('2 ^ 8')).to.deep.equal(expected)
      })

      it('exponentiation and multiplication', () => {
        const expected = {
          type: 'callExpression',
          id: 'multiply',
          arguments: [
            {
              type: 'callExpression',
              id: 'exponentiate',
              arguments: [
                {
                  type: 'literal',
                  value: 2,
                  dataType: 'number',
                  options: {
                    length: 1,
                    scale: 0
                  }
                },
                {
                  type: 'literal',
                  value: 8,
                  dataType: 'number',
                  options: {
                    length: 1,
                    scale: 0
                  }
                }
              ]
            },
            {
              type: 'literal',
              value: 7,
              dataType: 'number',
              options: {
                length: 1,
                scale: 0
              }
            }
          ]
        }
        expect(build('2 ^ 8 * 7')).to.deep.equal(expected)
      })

      it('exponentiation, multiplication and addition', () => {
        const expected = {
          type: 'callExpression',
          id: 'add',
          arguments: [
            {
              type: 'callExpression',
              id: 'multiply',
              arguments: [
                {
                  type: 'callExpression',
                  id: 'exponentiate',
                  arguments: [
                    {
                      type: 'literal',
                      value: 2,
                      dataType: 'number',
                      options: {
                        length: 1,
                        scale: 0
                      }
                    },
                    {
                      type: 'literal',
                      value: 8,
                      dataType: 'number',
                      options: {
                        length: 1,
                        scale: 0
                      }
                    }
                  ]
                },
                {
                  type: 'literal',
                  value: 7,
                  dataType: 'number',
                  options: {
                    length: 1,
                    scale: 0
                  }
                }
              ]
            },
            {
              type: 'literal',
              value: 5,
              dataType: 'number',
              options: {
                length: 1,
                scale: 0
              }
            }
          ]
        }
        expect(build('2 ^ 8 * 7 + 5')).to.deep.equal(expected)
      })

      it('exponentiation, multiplication and addition in parentheses', () => {
        const expected = {
          type: 'callExpression',
          id: 'exponentiate',
          arguments: [
            {
              type: 'literal',
              value: 2,
              dataType: 'number',
              options: {
                length: 1,
                scale: 0
              }
            },
            {
              type: 'callExpression',
              id: 'add',
              arguments: [
                {
                  type: 'callExpression',
                  id: 'multiply',
                  arguments: [
                    {
                      type: 'literal',
                      value: 8,
                      dataType: 'number',
                      options: {
                        length: 1,
                        scale: 0
                      }
                    },
                    {
                      type: 'literal',
                      value: 7,
                      dataType: 'number',
                      options: {
                        length: 1,
                        scale: 0
                      }
                    }
                  ]
                },
                {
                  type: 'literal',
                  value: 5,
                  dataType: 'number',
                  options: {
                    length: 1,
                    scale: 0
                  }
                }
              ]
            }
          ]
        }
        expect(build('2 ^ (8 * 7 + 5)')).to.deep.equal(expected)
      })

      it('logical comparison and concatination', () => {
        const expected = {
          type: 'callExpression',
          id: 'and',
          arguments: [
            {
              type: 'callExpression',
              id: 'equal',
              arguments: [
                {
                  type: 'literal',
                  value: 1,
                  dataType: 'number',
                  options: {
                    length: 1,
                    scale: 0
                  }
                },
                {
                  type: 'literal',
                  value: 1,
                  dataType: 'number',
                  options: {
                    length: 1,
                    scale: 0
                  }
                }
              ]
            },
            {
              type: 'callExpression',
              id: 'equal',
              arguments: [
                {
                  type: 'literal',
                  value: 1,
                  dataType: 'number',
                  options: {
                    length: 1,
                    scale: 0
                  }
                },
                {
                  type: 'literal',
                  value: 1,
                  dataType: 'number',
                  options: {
                    length: 1,
                    scale: 0
                  }
                }
              ]
            }
          ]
        }
        expect(build('1 == 1 && 1 == 1')).to.deep.equal(expected)
      })
    })

    context('Identifiers', () => {
      it('identifier', () => {
        const expected = {
          type: 'identifier',
          name: 'Name'
        }
        expect(build('Name')).to.deep.equal(expected)
      })
    })

    context('Literals', () => {
      it('string literal', () => {
        const expected = {
          type: 'literal',
          value: 'a String',
          dataType: 'text',
          options: {
            length: 8
          }
        }
        expect(build('"a String"')).to.deep.equal(expected)
      })

      it('integer literal', () => {
        const expected = {
          type: 'literal',
          value: 12,
          dataType: 'number',
          options: {
            length: 2,
            scale: 0
          }
        }
        expect(build('12')).to.deep.equal(expected)
      })

      it('negative integer literal', () => {
        const expected = {
          type: 'literal',
          value: -123,
          dataType: 'number',
          options: {
            length: 3,
            scale: 0
          }
        }
        expect(build('-123')).to.deep.equal(expected)
      })

      it('explicitely positive integer literal', () => {
        const expected = {
          type: 'literal',
          value: 1234,
          dataType: 'number',
          options: {
            length: 4,
            scale: 0
          }
        }
        expect(build('+1234')).to.deep.equal(expected)
      })

      it('float literal', () => {
        const expected = {
          type: 'literal',
          value: 11.2,
          dataType: 'number',
          options: {
            length: 2,
            scale: 1
          }
        }
        expect(build('11.2')).to.deep.equal(expected)
      })

      it('TRUE literal', () => {
        const expected = {
          type: 'literal',
          value: true,
          dataType: 'checkbox',
          options: {}
        }
        expect(build('TRUE')).to.deep.equal(expected)
      })

      it('FALSE literal', () => {
        const expected = {
          type: 'literal',
          value: false,
          dataType: 'checkbox',
          options: {}
        }
        expect(build('FALSE')).to.deep.equal(expected)
      })
    })

    context('Logic', () => {
      context('unary', () => {
        it('NOT with Identifier', () => {
          const expected = {
            type: 'callExpression',
            id: 'not',
            arguments: [{type: 'identifier', name: 'Negative'}]
          }
          expect(build('!Negative')).to.deep.equal(expected)
        })

        it('NOT with boolean literal', () => {
          const expected = {
            type: 'callExpression',
            id: 'not',
            arguments: [
              {
                type: 'literal',
                value: false,
                dataType: 'checkbox',
                options: {}
              }
            ]
          }
          expect(build('!FALSE')).to.deep.equal(expected)
        })
      })

      context('binary', () => {
        it('&&', () => {
          const expected = {
            type: 'callExpression',
            id: 'and',
            arguments: [
              {type: 'identifier', name: 'First'},
              {type: 'identifier', name: 'Second'}
            ]
          }
          expect(build('First && Second')).to.deep.equal(expected)
        })

        it('||', () => {
          const expected = {
            type: 'callExpression',
            id: 'or',
            arguments: [
              {type: 'identifier', name: 'First'},
              {type: 'identifier', name: 'Second'}
            ]
          }
          expect(build('First || Second')).to.deep.equal(expected)
        })

        it('==', () => {
          const expected = {
            type: 'callExpression',
            id: 'equal',
            arguments: [
              {type: 'identifier', name: 'First'},
              {type: 'identifier', name: 'Second'}
            ]
          }
          expect(build('First == Second')).to.deep.equal(expected)
        })

        it('=', () => {
          const expected = {
            type: 'callExpression',
            id: 'equal',
            arguments: [
              {type: 'identifier', name: 'First'},
              {type: 'identifier', name: 'Second'}
            ]
          }
          expect(build('First = Second')).to.deep.equal(expected)
        })

        it('!=', () => {
          const expected = {
            type: 'callExpression',
            id: 'unequal',
            arguments: [
              {type: 'identifier', name: 'First'},
              {type: 'identifier', name: 'Second'}
            ]
          }
          expect(build('First != Second')).to.deep.equal(expected)
        })

        it('<>', () => {
          const expected = {
            type: 'callExpression',
            id: 'unequal',
            arguments: [
              {type: 'identifier', name: 'First'},
              {type: 'identifier', name: 'Second'}
            ]
          }
          expect(build('First <> Second')).to.deep.equal(expected)
        })

        it('<', () => {
          const expected = {
            type: 'callExpression',
            id: 'lessThan',
            arguments: [
              {type: 'identifier', name: 'First'},
              {type: 'identifier', name: 'Second'}
            ]
          }
          expect(build('First < Second')).to.deep.equal(expected)
        })

        it('<=', () => {
          const expected = {
            type: 'callExpression',
            id: 'lessThanOrEqual',
            arguments: [
              {type: 'identifier', name: 'First'},
              {type: 'identifier', name: 'Second'}
            ]
          }
          expect(build('First <= Second')).to.deep.equal(expected)
        })

        it('>', () => {
          const expected = {
            type: 'callExpression',
            id: 'greaterThan',
            arguments: [
              {type: 'identifier', name: 'First'},
              {type: 'identifier', name: 'Second'}
            ]
          }
          expect(build('First > Second')).to.deep.equal(expected)
        })

        it('>=', () => {
          const expected = {
            type: 'callExpression',
            id: 'greaterThanOrEqual',
            arguments: [
              {type: 'identifier', name: 'First'},
              {type: 'identifier', name: 'Second'}
            ]
          }
          expect(build('First >= Second')).to.deep.equal(expected)
        })
      })
    })
  })

  describe('traverse', () => {
    context('literal', () => {
      it('integer literal', () => {
        const input = {
          type: 'literal',
          value: 11,
          dataType: 'number',
          options: {
            length: 2,
            scale: 0
          }
        }
        const expected = {
          type: 'literal',
          value: 11,
          dataType: 'number',
          options: {
            length: 2,
            scale: 0
          }
        }

        expect(traverse(input)).to.deep.equal(expected)
      })

      it('float literal', () => {
        const input = {
          type: 'literal',
          value: 11.2,
          dataType: 'number',
          options: {
            length: 2,
            scale: 1
          }
        }

        const expected = {
          type: 'literal',
          value: 11.2,
          dataType: 'number',
          options: {
            length: 2,
            scale: 1
          }
        }

        expect(traverse(input)).to.deep.equal(expected)
      })

      it('string literal', () => {
        const input = {
          type: 'literal',
          value: 'a String',
          dataType: 'text',
          options: {
            length: 8,
            scale: 0
          }
        }

        const expected = {
          type: 'literal',
          value: 'a String',
          dataType: 'text',
          options: {
            length: 8,
            scale: 0
          }
        }

        expect(traverse(input)).to.deep.equal(expected)
      })
    })

    context('identifier', () => {
      it('throws ReferenceError', () => {
        const input = { type: 'identifier', name: 'Name' }
        const fn = function () { traverse(input) }

        expect(fn).to.throw(ReferenceError, `Undefined variable '${input.name}'`)
      })
    })

    context('callExpression', () => {
      it('1 level', () => {
        const input = {
          type: 'callExpression',
          id: 'add',
          arguments: [
            {
              type: 'literal',
              value: 1.5,
              dataType: 'number',
              options: {
                length: 1,
                scale: 1
              }
            },
            {
              type: 'literal',
              value: 9,
              dataType: 'number',
              options: {
                length: 1,
                scale: 0
              }
            }
          ]
        }

        const expected = {
          type: 'literal',
          value: 10.5,
          dataType: 'number',
          options: {
            length: 2,
            scale: 1
          }
        }

        expect(traverse(input)).to.deep.equal(expected)
      })

      it('2 levels', () => {
        const input = {
          type: 'callExpression',
          id: 'add',
          arguments: [
            {
              type: 'callExpression',
              id: 'multiply',
              arguments: [
                {
                  type: 'literal',
                  value: 7,
                  dataType: 'number',
                  options: {
                    length: 1,
                    scale: 0
                  }
                },
                {
                  type: 'literal',
                  value: 8,
                  dataType: 'number',
                  options: {
                    length: 1,
                    scale: 0
                  }
                }
              ]
            },
            {
              type: 'literal',
              value: 5,
              dataType: 'number',
              options: {
                length: 1,
                scale: 0
              }
            }
          ]
        }
        const expected = {
          type: 'literal',
          value: 61,
          dataType: 'number',
          options: {
            length: 2,
            scale: 0
          }
        }

        expect(traverse(input)).to.deep.equal(expected)
      })
    })
  })

  describe('extract', () => {
    context('no identifiers', () => {
      let ast = {
        type: 'callExpression',
        id: 'add',
        arguments: [
          {
            type: 'literal',
            value: 1.5,
            dataType: 'number',
            options: {
              length: 1,
              scale: 1
            }
          },
          {
            type: 'literal',
            value: 2,
            dataType: 'number',
            options: {
              length: 1,
              scale: 0
            }
          }
        ]
      }

      it('returns empty array', () => {
        const expected = []
        expect(extract(ast)).to.deep.equal(expected)
      })
    })

    context('one identifier', () => {
      let ast = {
        type: 'callExpression',
        id: 'add',
        arguments: [{type: 'literal', value: 1.5}, {type: 'identifier', name: 'Name'}]
      }

      it('returns array with identifiers', () => {
        const expected = ['Name']
        expect(extract(ast)).to.deep.equal(expected)
      })
    })

    context('multiple identifiers', () => {
      let ast = {
        type: 'callExpression',
        id: 'add',
        arguments: [
          {
            type: 'callExpression',
            id: 'subtract',
            arguments: [{type: 'identifier', name: 'Argument1'}, {type: 'identifier', name: 'Argument2'}]
          },
          {type: 'identifier', name: 'Name'}
        ]
      }

      it('returns array with identifiers', () => {
        const expected = ['Argument1', 'Argument2', 'Name']
        expect(extract(ast)).to.deep.equal(expected)
      })
    })

    context('redundant identifiers', () => {
      let ast = {
        type: 'callExpression',
        id: 'add',
        arguments: [{type: 'identifier', name: 'Name'}, {type: 'identifier', name: 'Name'}]
      }

      it('returns array with replaced variables', () => {
        const expected = ['Name', 'Name']
        expect(extract(ast)).to.deep.equal(expected)
      })
    })

    context('function call without parameters', () => {
      let ast = {
        type: 'callExpression',
        id: 'date',
        arguments: []
      }

      it('returns empty array', () => {
        const expected = []
        expect(extract(ast)).to.deep.equal(expected)
      })
    })
  })

  describe('replace', () => {
    context('no identifiers', () => {
      let ast = {
        type: 'callExpression',
        id: 'add',
        arguments: [
          {
            type: 'literal',
            value: 1.5,
            dataType: 'number',
            options: {
              length: 1,
              scale: 1
            }
          },
          {
            type: 'literal',
            value: 2,
            dataType: 'number',
            options: {
              length: 1,
              scale: 0
            }
          }
        ]
      }

      it('returns empty array', () => {
        const expected = ast
        expect(replace(ast, {Name: 'value'})).to.deep.equal(expected)
      })
    })

    context('one identifier', () => {
      context('replacement given', () => {
        let ast = {
          type: 'callExpression',
          id: 'add',
          arguments: [
            {
              type: 'literal',
              value: 1.5,
              dataType: 'number',
              options: {
                length: 1,
                scale: 1
              }
            },
            {
              type: 'identifier',
              name: 'Name'
            }
          ]
        }

        it('returns replaced array', () => {
          const expected = {
            type: 'callExpression',
            id: 'add',
            arguments: [
              {
                type: 'literal',
                value: 1.5,
                dataType: 'number',
                options: {
                  length: 1,
                  scale: 1
                }
              },
              {
                type: 'literal',
                value: 'value',
                dataType: 'text',
                options: {
                  length: 4
                }
              }
            ]
          }
          let substitutions = {
            Name: {
              value: 'value',
              dataType: 'text',
              options: {
                length: 4
              }
            }
          }
          expect(replace(ast, substitutions)).to.deep.equal(expected)
        })
      })

      context('no replacement given', () => {
        let ast = {
          type: 'callExpression',
          id: 'add',
          arguments: [
            {
              type: 'literal',
              value: 1.5,
              dataType: 'number',
              options: {
                length: 1,
                scale: 1
              }
            },
            {
              type: 'identifier',
              name: 'Name'
            }
          ]
        }

        it('returns replaced array', () => {
          const expected = ast
          expect(replace(ast, {})).to.deep.equal(expected)
        })
      })
    })
  })
})

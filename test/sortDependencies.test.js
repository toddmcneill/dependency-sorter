const { sortDependencies } = require('../src/sortDependencies.js')
const { assert } = require('chai')

describe('sortDependencies', () => {
  context('sortDependencies', () => {
    it('sorts 1 package with no dependency')
    it('sorts 2 packages with a single dependency')
    it('detects a circular dependency of 2 packages')
    it('detects a circular dependency of 5 packages')
    it('detects a circular dependency that does not include all packages')
  })
})

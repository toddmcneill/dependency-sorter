const sortPackagesFunctions = require('../src/sortPackages.js')
const { sortPackages, getOrderedDependencyList, sortPackagesMultipleDependencies } = sortPackagesFunctions
const { assert } = require('chai')
const sinon = require('sinon')

describe('sortPackages', () => {
  let sandbox
  before(() => {
    sandbox = sinon.sandbox.create()
  })
  afterEach(() => {
    sandbox.restore()
  })

  context('sortPackages', () => {
    it('sorts 1 package with no dependency', () => {
      const input = [ 'a: ' ]
      const output = sortPackages(input)
      const expected = 'a'
      assert.equal(output, expected)
    })

    it('sorts 2 packages with a single dependency already in the correct order', () => {
      const input = [ 'a: ', 'b: a' ]
      const output = sortPackages(input)
      const expected = 'a, b'
      assert.equal(output, expected)
    })

    it('sorts 2 packages with a single dependency not already in the correct order', () => {
      const input = [ 'a: b', 'b' ]
      const output = sortPackages(input)
      const expected = 'b, a'
      assert.equal(output, expected)
    })

    it('detects a circular dependency of 2 packages', () => {
      const input = [ 'a: b', 'b: a' ]
      assert.throws(() => sortPackages(input))
    })

    it('detects a circular dependency of 5 packages', () => {
      const input = [ 'a: b', 'b: c', 'c: d', 'd: e', 'e: a' ]
      assert.throws(() => sortPackages(input))
    })

    it('detects a circular dependency that does not include all packages', () => {
      const input = [ 'a: ', 'b: c', 'c: d', 'd: b', 'e: a' ]
      assert.throws(() => sortPackages(input))
    })

    it('sorts valid input example 1 from requirements', () => {
      const input = [
        'KittenService: CamelCaser',
        'CamelCaser: '
      ]
      const output = sortPackages(input)
      const expected = 'CamelCaser, KittenService'
      assert.equal(output, expected)
    })

    it('sorts valid input example 2 from requirements', () => {
      const input = [
        'KittenService: ',
        'Leetmeme: Cyberportal',
        'Cyberportal: Ice',
        'CamelCaser: KittenService',
        'Fraudstream: Leetmeme',
        'Ice: '
      ]
      const output = sortPackages(input)
      assert(isOutputValid(input, output))
    })

    it('throws on invalid input example from requirements', () => {
      const input = [
        'KittenService: ',
        'Leetmeme: Cyberportal',
        'Cyberportal: Ice',
        'CamelCaser: KittenService',
        'Fraudstream: ',
        'Ice: Leetmeme'
      ]
      assert.throws(() => sortPackages(input))
    })
  })

  context('getOrderedDependencyList', () => {
    it('returns the package if there is no dependency', () => {
      const output = getOrderedDependencyList('a', null, [])
      const expected = [ 'a' ]
      assert.deepEqual(output, expected)
    })
    
    it('throws an error if the package is already in the dependency chain', () => {
      const troubleFunction = () => getOrderedDependencyList('a', 'b', [], ['b'])
      assert.throws(troubleFunction, 'Circular dependency found')
    })
    
    it('includes an error message identifying the problem', () => {
      const troubleFunction = () => getOrderedDependencyList('a', 'c', [], ['b', 'c', 'd', 'e'])
      assert.throws(troubleFunction, 'Circular dependency found: c > e > d > c')
    })
    
    it('calls itself to follow the dependency chain', () => {
      sandbox.spy(sortPackagesFunctions, 'getOrderedDependencyList')
      const packageDetailsList = [
        { packageName: 'b', dependency: 'c' },
        { packageName: 'c', dependency: 'd' },
        { packageName: 'd', dependency: null }
      ]
      sortPackagesFunctions.getOrderedDependencyList('a', 'b', packageDetailsList)
      assert.equal(sortPackagesFunctions.getOrderedDependencyList.callCount, 4)
    })

    it('returns an ordered dependency chain', () => {
      const packageDetailsList = [
        { packageName: 'b', dependency: 'c' },
        { packageName: 'c', dependency: 'd' },
        { packageName: 'd', dependency: null }
      ]
      const output = getOrderedDependencyList('a', 'b', packageDetailsList)
      const expected = ['d', 'c', 'b', 'a']
      assert.deepEqual(output, expected)
    })
  })

  context.skip('sortPackagesMultipleDependencies', () => {
    it('sorts 3 packages with 1 multiple dependency', () => {
      const input = [ 'a: b, c', 'b: ', 'c: b' ]
      const output = sortPackages(input)
      const expected = 'b, c, a'
      assert.equal(output, expected)
    })

    it('sorts 5 packages with each depending on all the ones following it', () => {
      const input = [ 'a: b, c, d, e', 'b: c, d, e', 'c: d, e', 'd: e', 'e: ' ]
      const output = sortPackages(input)
      const expected = 'e, d, c, b, a'
      assert.equal(output, expected)
    })
  })
})

// Since more complex inputs can often yield a number of valid outputs, a static comparison is not sufficient, and this helper function is needed.
function isOutputValid (input, output) {
  const outputArray = output.split(', ')

  for (let i = 0; i < input.length; i++) {
    const [ packageName, dependency ] = input[i].split(': ')

    // Verify the package is included in the output.
    if (!outputArray.includes(packageName)) {
      throw new Error(`${packageName} is not present in the output`)
    }

    // Skip the dependency check if no dependency is specified.
    if (!dependency) {
      continue
    }

    // Verify the dependency is included in the list.
    if (!outputArray.includes(dependency)) {
      throw new Error(`${dependency} is not present in the output`)
    }

    // Verify the dependency is before the package in the list.
    if (outputArray.indexOf(dependency) > outputArray.indexOf(packageName)) {
      throw new Error(`${packageName} depends on ${dependency}, but is before it in the output`)
    }
  }

  return true
}

const { sortPackages } = require('../src/sortPackages.js')
const { assert } = require('chai')

describe('sortPackages', () => {
  context('sortPackages', () => {
    it('sorts 1 package with no dependency', () => {
      const input = [ "a: " ]
      const output = sortPackages(input)
      const expected = "a"
      assert.equal(output, expected)
    })

    it('sorts 2 packages with a single dependency already in the correct order', () => {
      const input = [ "a: ", "b: a" ]
      const output = sortPackages(input)
      const expected = "a, b"
      assert.equal(output, expected)
    })

    it('sorts 2 packages with a single dependency not already in the correct order', () => {
      const input = [ "a: b", "b" ]
      const output = sortPackages(input)
      const expected = "b, a"
      assert.equal(output, expected)
    })

    it('detects a circular dependency of 2 packages', () => {
      const input = [ "a: b", "b: a" ]
      assert.throws(() => sortPackages(input))
    })

    it('detects a circular dependency of 5 packages', () => {
      const input = [ "a: b", "b: c", "c: d", "d: e", "e: a" ]
      assert.throws(() => sortPackages(input))
    })

    it('detects a circular dependency that does not include all packages', () => {
      const input = [ "a: ", "b: c", "c: d", "d: b", "e: a" ]
      assert.throws(() => sortPackages(input))
    })

    it('sorts valid input example 1 from requirements', () => {
      const input = [
        "KittenService: CamelCaser",
        "CamelCaser: "
      ]
      const output = sortPackages(input)
      const expected = "CamelCaser, KittenService"
      assert.equal(output, expected)
    })

    it('sorts valid input example 2 from requirements', () => {
      const input = [
        "KittenService: ",
        "Leetmeme: Cyberportal",
        "Cyberportal: Ice",
        "CamelCaser: KittenService",
        "Fraudstream: Leetmeme",
        "Ice: "
      ]
      const output = sortPackages(input)
      assert(isOutputValid(input, output))
    })

    it('throws on invalid input example from requirements', () => {
      const input = [
        "KittenService: ",
        "Leetmeme: Cyberportal",
        "Cyberportal: Ice",
        "CamelCaser: KittenService",
        "Fraudstream: ",
        "Ice: Leetmeme"
      ]
      assert.throws(() => sortPackages(input))
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
      return false
    }

    // Skip the dependency check if no dependency is specified.
    if (!dependency) {
      continue
    }

    // Verify the dependency is included in the list.
    if (!outputArray.includes(dependency)) {
      return false
    }

    // Verify the dependency is before the package in the list.
    if (outputArray.indexOf(dependency) > outputArray.indexOf(packageName)) {
      return false
    }
  }

  return true
}

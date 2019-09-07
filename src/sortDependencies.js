/*
packageList: an array of strings, each containing a colon- and space-separated package name and optionally a dependency, formatted as "package: dependency"
Returns: a comma-separated list of packages in an order they can be loaded such that no package is loaded until it's dependency is loaded.
Throws: when a circular dependency is detected.
 */
function sortDependencies (packageList) {
  // TODO: implement this function.

  return ''
}

module.exports = {
  sortDependencies
}

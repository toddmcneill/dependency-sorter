/*
packageList: an array of strings, each containing a colon- and space-separated package name and optionally a dependency, formatted as "packageName: dependency"
Returns: a comma-separated list of packages in an order they can be loaded such that no package is loaded until it's dependency is loaded.
Throws: if a circular dependency is detected.
 */
function sortPackages (packageList) {
  const packageDetailsList = packageList.map(packageListItem => {
    const [ packageName, dependency ] = packageListItem.split(': ')
    return { packageName, dependency }
  })

  const orderedPackageNames = []
  while (packageDetailsList.length) {
    const packageDetails = packageDetailsList.shift()

    // Don't add the package again if it has already been added.
    if (orderedPackageNames.includes(packageDetails.packageName)) {
      continue
    }

    // Add the package and all it's dependencies in the correct order to the list.
    const orderedDependencyList = getOrderedDependencyList(packageDetails, packageDetailsList)
    orderedPackageNames.push(...orderedDependencyList)
  }

  // Create a string from the ordered package names and return it.
  return orderedPackageNames.join(', ')
}

/*
packageDetails: an object with the structure { packageName, dependency }
packageDetailsList: an array of objects with the same structure as packageDetails
dependencyChain: an array a string package names
Returns: an array containing all dependencies down the chain needed to include the package found in packageDetails, as well as the package itself
Throws: if a circular dependency is detected
 */
function getOrderedDependencyList(packageDetails, packageDetailsList, dependencyChain = []) {
  // TODO: implement this function.

  return []
}

function sortPackagesMultipleDependencies (packageList) {
  const packageListDetails = packageList.map(packageEntry => {
    // This structure allows for multiple dependency support.
    const [ packageName, dependency ] = packageEntry.split(': ')
    return { packageName, dependencies: [ dependency ] }
  })

  // TODO: implement this function later, since multiple dependencies would probably be very useful.

  return ''
}

module.exports = {
  sortPackages,
  getOrderedDependencyList,
  sortPackagesMultipleDependencies
}

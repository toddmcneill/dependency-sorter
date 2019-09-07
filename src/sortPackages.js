/*
packageList: an array of strings, each containing a colon- and space-separated package name and optionally a dependency, formatted as 'packageName: dependency'
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
    const dependencyChain = getDependencyChain(packageDetails.packageName, packageDetails.dependency, packageDetailsList)
    orderedPackageNames.push(...dependencyChain)
  }

  // Create a string from the ordered package names and return it.
  return orderedPackageNames.join(', ')
}

/*
packageName: String
dependency: String
packageDetailsList: an array of objects with the structure { packageName, dependency }
usedDependencies: an array a string package names that have already been used in the current chain
Returns: an array containing all dependencies down the chain needed to include the package found in packageDetails, as well as the package itself
Throws: if a circular dependency is detected
 */
function getDependencyChain(packageName, dependency, packageDetailsList, usedDependencies = []) {
  // If there is no dependency, return an array with just the package name itself.
  if (!dependency) {
    return [ packageName ]
  }

  // Check for a circular dependency.
  const duplicateIndex = usedDependencies.indexOf(dependency)
  if (duplicateIndex !== -1) {
    // Display a helpful message to identify the problem.
    const messageDetails = [ ...usedDependencies, dependency].slice(duplicateIndex).reverse().join(' > ')
    throw new Error(`Circular dependency found: ${messageDetails}`)
  }

  // Find details about the dependency.
  const dependencyDetails = packageDetailsList.find(packageDetails => packageDetails.packageName === dependency)
  if (!dependencyDetails) {
    // If the dependency details are not found, that means they were already added to the list.
    // Assumption: user input will never include a dependency with a broken reference to a package that is not also in the input.
    return [ packageName ]
  }

  // Add the dependency to the list and go deeper.
  const dependencyChain = module.exports.getDependencyChain(dependencyDetails.packageName, dependencyDetails.dependency, packageDetailsList, [ ...usedDependencies, packageName ])

  // Add the package to the list after its dependencies.
  return [ ...dependencyChain, packageName ]
}

function sortPackagesMultipleDependencies (packageList) {
  const packageListDetails = packageList.map(packageEntry => {
    const [ packageName, dependencies ] = packageEntry.split(': ')
    return { packageName, dependencies: dependencies.split(', ') }
  })

  // TODO: implement this function later, since multiple dependencies would probably be very useful.

  return ''
}

module.exports = {
  sortPackages,
  getDependencyChain,
  sortPackagesMultipleDependencies
}

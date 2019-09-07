const { sortDependencies } = require('./src/sortDependencies')

// Read in command line arguments.
const args = process.argv.slice(2)

// Sort dependencies.
const orderedPackages = sortDependencies(args)

// Write the output to stdout.
process.stdout.write(orderedPackages)

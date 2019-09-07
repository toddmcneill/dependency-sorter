const { sortDependencies } = require('./src/sortDependencies')

// Read in command line arguments.
const args = process.argv.slice(2)

// Sort dependencies.
let orderedPackages
try {
  orderedPackages = sortDependencies(args)
} catch (err) {
  process.stderr.write(err.message)
  process.exit(1)
}


// Write the output to stdout.
process.stdout.write(orderedPackages)

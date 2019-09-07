const { sortPackages } = require('./src/sortPackages')

// Read in command line arguments.
const args = process.argv.slice(2)

// Sort packages.
let orderedPackages
try {
  orderedPackages = sortPackages(args)
} catch (err) {
  // Log the error and exit the script.
  process.stderr.write(err.message)
  process.exit(1)
}

// Write the output to stdout.
process.stdout.write(orderedPackages)

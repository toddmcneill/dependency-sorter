# Dependency Sorter

## Requirements
See REQUIREMENTS.md

## How to Run
`yarn start {package list}`  
`npm start -- {package list}`

`{package list}` must be a space separated list of packages and dependencies as defined in REQUIREMENTS.md. For example:  
```
yarn start "KittenService: CamelCaser" "CamelCaser: "
```

Output will be printed to standard out.

## Run Tests
`yarn test`  
`npm test`

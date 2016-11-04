# Integrated Console System

## Requirements

- Node.js v6
- Git
- Run comman: npm install

## Build

For quick build:
- npm run build

For full build (includes lint, test, coverage):
- npm run dist

After building you can start (http://localhost:8282):
- npm run dev:server

Clean up dist:
- npm run clean

Clean up node_modules:
- npm run clear

## Development

Build and run:
- npm run dev

All unit tests:
- npm run dev:test

Debug all unit tests:
- npm run dev:debug

One single unit test:
- npm run dev:test:one -- /client-app/path/to/test.spec.js

Test and code coverage:
- npm run test

Lint JS & CSS:
- npm run lint
Lint JS:
- npm run lint:js
Lint CSS:
- npm run lint:css

Build only partially examples:
- npm run js
- npm run css
- npm run html
- npm run resources
- npm run build:server
- npm run build:apidoc
- npm run build:cache
- npm run build:simulator

Restart local server:
- npm run dev:server

## DEV Links

## TODO

- Cache and field authorization use case (generate data)
- SDD

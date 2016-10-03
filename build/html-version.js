const packageJson = require('../dist/thin/version.json')
const shell = require('shelljs')
const fs = require('fs')

const target = 'dist/thin/index.html'
const result = shell.sed('\\$VERSION', packageJson.version, target)

fs.writeFileSync(target, result, 'utf8')

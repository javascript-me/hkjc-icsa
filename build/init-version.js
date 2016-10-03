const packageJson = require('../package.json')
const moment = require('moment')
const shell = require('shelljs')
const fs = require('fs')

const now = moment()
const build = now.format('YYYY_MM_DD-hh_mm_ss')
const version = `${packageJson.version}+${build}`

const versionJson = {
	name: packageJson.name,
	version: version
}

const versionString = JSON.stringify(versionJson, null, '\t')
shell.echo('INIT VERSION:')
shell.echo(versionString)
fs.writeFileSync('dist/thin/version.json', versionString, 'utf8')


import sourceMapSupport from 'source-map-support'
import express from 'express'

import ping from './ping'

const cache = express.Router()
cache.use('/ping/', ping)

if (!module.parent) {
	sourceMapSupport.install()
	const morgan = require('morgan')
	const bodyParser = require('body-parser')
	const app = express()
	app.use(
		morgan('dev'),
		bodyParser.json(),
		bodyParser.urlencoded({
			extended: true
		})
		)
	app.use('/', cache)

	const port = 8181
	app.listen(port, () => {
		console.log(`Cache listening on port ${port}`) // eslint-disable-line no-console
	})
}

export default cache

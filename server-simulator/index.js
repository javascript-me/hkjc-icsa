import 'source-map-support/register'
import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'

import cache from '../server-cache'
import users from './users'

const server = express.Router()
server.use('/users/', users)

const app = express()
app.use(
	morgan('dev'),
	bodyParser.json(),
	bodyParser.urlencoded({
		extended: true
	})
	)
app.use('/', express.static('./dist/thin'))
cache.use('/apidoc/', express.static('./dist/cache/apidoc'))
app.use('/cache/', cache)
server.use('/apidoc/', express.static('./dist/simulator/apidoc'))
app.use('/api/', server)

const port = 8282
app.listen(port, () => {
	console.log(`Server simulator listening on port ${port}`) // eslint-disable-line no-console
})
import 'source-map-support/register'
import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'

import cache from '../server-cache'
import eventdirectory from './eventdirectory'
import users from './users'
import config from './config'
import clock from './clock'

const server = express.Router()
server.use('/eventdirectory/', eventdirectory)
server.use('/users/', users)
server.use('/config/', config)
server.use('/clock/', clock)

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

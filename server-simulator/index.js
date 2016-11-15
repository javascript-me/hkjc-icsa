import 'source-map-support/register'
import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'

import cache from '../server-cache'
import users from './API/users'
import auditlog from './API/auditlog'
import APIconfig from './API/config'
import config from './config'


const server = express.Router()
server.use('/users/', users)
server.use('/auditlog/', auditlog)
server.use('/config/', APIconfig)


const app = express()
app.use(
	morgan('dev'),
	bodyParser.json(),
	bodyParser.urlencoded({
		extended: true
	})
)
// Add headers
app.use(function (req, res, next) {

    // Client URL
    res.setHeader('Access-Control-Allow-Origin', config.CLIENT_URL);

    // Request methods to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
})

app.use('/', express.static('./dist/thin'))
cache.use('/apidoc/', express.static('./dist/cache/apidoc'))
app.use('/cache/', cache)
server.use('/apidoc/', express.static('./dist/simulator/apidoc'))
app.use('/api/', server)

const port = 8282
app.listen(port, () => {
	console.log(`Server simulator listening on port ${port}`) // eslint-disable-line no-console
})

import 'source-map-support/register'
import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'

import eventdirectory from './API/eventdirectory'
import users from './API/users'
import auditlog from './API/auditlog'
import userprofile from './API/userprofile'
import roles from './API/roles'
import noticeBoard from './API/notice-board'
import APIconfig from './API/config'
import config from './config'
import clock from './API/clock'
import baseUserProfile from './API/basicalUser'

const server = express.Router()
server.use('/eventdirectory/', eventdirectory)
server.use('/users/', users)
server.use('/clock/', clock)
server.use('/auditlog/', auditlog)
server.use('/userprofile/', userprofile)
server.use('/roles/', roles)
server.use('/notice-board/', noticeBoard)
server.use('/config/', APIconfig)
server.use('/basicusers/', baseUserProfile)

const app = express()
app.use(
	morgan('dev'),
	bodyParser.json(),
	bodyParser.urlencoded({
		extended: true
	})
)
// Add headers
app.use((req, res, next) => {
    // Client URL
	res.setHeader('Access-Control-Allow-Origin', config.CLIENT_URL)

    // Request methods to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

    // Request headers to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

    // Set to true if you need the website to include cookies in the requests sent
	res.setHeader('Access-Control-Allow-Credentials', true)

    // Pass to next layer of middleware
	next()
})

app.use('/', express.static('./dist/thin'))
server.use('/apidoc/', express.static('./dist/simulator/apidoc'))
app.use('/api/', server)

const port = 8282
app.listen(port, () => {
	console.log(`Server simulator listening on port ${port}`) // eslint-disable-line no-console
})

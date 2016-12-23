import express from 'express'
import _ from 'lodash'
const router = express.Router()

const users = require('../json/users.json')
const tasks = require('../json/tasks.json')
const basicUsers = require('../json/userProfile2.json')

/**
 * @api {POST} /users/login Login
 * @apiGroup Users

 * @apiDescription Users' password authentication.
 *
 * @apiParam {String} username Customer's username.
 * @apiParam {String} password Customer's password.
 *
 * @apiSuccess (Success) {String} username  allgood
 * @apiSuccess (Success) {String} password  ofcourse
 * @apiSuccessExample Success response
 *		HTTP/1.1 200 OK
 *		{
 *			"username": "allgood",
 *			"fullname": "All Good"
 *			"authorizations": ["login", "foobar"]
 *		}
 *
 * @apiError (Forbidden) {String} username  allgood
 * @apiErrorExample Forbidden response
 *		HTTP/1.1 403 Forbidden
 *		{
 *		}
 *
 * @apiError (Locked) {String} username  goodbut
 * @apiSuccess (Success) {String} password  maybe
 * @apiErrorExample Locked response
 *		HTTP/1.1 423 Locked
 *		{
 *		}
 *
 * @apiError (Error) {String} username  nogood
 * @apiErrorExample Error response
 *		HTTP/1.1 500 Internal Server Error
 *		{
 *		}
 */
router.post('/login', (req, res) => {
	const username = req.body.username
	const password = req.body.password || ''
	let status = 403
	let result = { error: 'Sorry we could not find your credentials for this user', data: [username, password] }
	let expiredMsg = 'Your password is expired. Please contact the help desk.'
	let errorMsg = 'The username or password you have entered is invalid. You have 3 attempts left.'
	let lockedMsg = 'Your account has been locked, please contact the help desk.'

	var user = users[username]

	if (user && password === user.password) {
		user.count = 0
		status = user.status
		if (status === 200) {
			if (user.passwordExpired) {
				result.expired = true
				result.error = expiredMsg
			} else if (user.locked) {
				result.locked = true
				result.error = lockedMsg
			} else {
				result = user.profile
			}
		}
	} else if (!user || (user && password !== user.password)) {
		status = user.status
		if (status === 200) {
			result.error = errorMsg
			if (user && password !== user.password) {
				user.count = user.count || 0
				user.count ++
				result.count = user.count

				if (result.count < 4) {
					result.error = 'The username or password you have entered is invalid. You have ' + (4 - user.count) + ' attempts left.'
				} else {
					result.locked = true
					result.error = lockedMsg
				}
			}
		}
	}
	res.status(status)
	res.send(result)
})

router.post('/updateNoticeboardAndBroadcastSetting', (req, res) => {
	if (req.body.position !== '') {
		const position = req.body.position
		const username = req.body.username
		var user = users[username]
		let status = 200
		var userProfile = user.profile
		if (userProfile.noticeboardSettings.position !== position) {
			userProfile.noticeboardSettings.position = position
		}
		res.status(status)
		res.send(userProfile)
	}
})

router.post('/updateTaskSetting', (req, res) => {
	if (req.body.position !== '') {
		const position = req.body.position
		const username = req.body.username
		var user = users[username]
		let status = 200
		var userProfile = user.profile
		if (userProfile.taskSettings.position !== position) {
			userProfile.taskSettings.position = position
		}
		res.status(status)
		res.send(userProfile)
	}
})

router.post('/getNoticeBoardDisplaySettings', (req, res) => {
	const username = req.body.username
	var user = users[username]
	let status = 200
	var userProfile = user.profile
	res.status(status)
	res.send(userProfile)
})

router.get('/getTasks', (req, res) => {
	res.status(200)
	let result = {}
	result = tasks
	res.send(result)
})

router.get('/getUserinfo', (req, res) => {
	let result = {}
	const userID = req.query.userID
	result = _.find(basicUsers, (baseItem, idx) => (userID === baseItem.userID))
	res.send(result)
})

export default router

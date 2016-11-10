import express from 'express'
const router = express.Router()

const users = require('./json/users.json')

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
	let result = {}

	var user = users[username]

	if (user && password.match(new RegExp(user.password))) {
		status = user.status
		if (status === 200) {
			result = user.profile
		}
	}

	res.status(status)
	res.send(result)
})

export default router

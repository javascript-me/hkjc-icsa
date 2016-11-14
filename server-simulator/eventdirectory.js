import express from 'express'
const router = express.Router()

const eventdirectory = require('./json/eventdirectory.json')

/**
 * @api {POST} /eventdirectory/ Eventdirectory search result
 * @apiGroup EventDirectory

 * @apiDescription Eventdirectory search result.
 *
 * @apiParam {String} keyword search keyword.
 *
 * @apiSuccessExample Success response
 *		HTTP/1.1 200 OK
 *		{
 *			"result": []
 *		}
 *
 */
router.post('/', (req, res) => {
	const keyword = req.body.keyword
	let result = {result: []}

	if (keyword === 'ARS') {
		result = eventdirectory
	}

	res.send(result)
})

export default router

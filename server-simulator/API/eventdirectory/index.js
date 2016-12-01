import express from 'express'
import EventDirectoryUtil from './event-directory-util'
const router = express.Router()

const eventdirectory = require('../json/eventdirectory.json')

/**
 * @api {POST} /eventdirectory/ Eventdirectory search result
 * @apiGroup EventDirectory

 * @apiDescription Eventdirectory search result.
 *
 * @apiParam {String} keyword Search keyword.
 * @apiParam {String} [scenario] Scenario filter.
 * @apiParam {String} [competition] Competition filter.

 * @apiSuccess (Success) {String} status In-Play and selling status
 * @apiSuccess (Success) {String} t1 Home team short name
 * @apiSuccess (Success) {String} t1Tip Home team full name
 * @apiSuccess (Success) {String} t2 Away team short name
 * @apiSuccess (Success) {String} t2Tip Away team full name
 * @apiSuccessExample Success response
 *		HTTP/1.1 200 OK
 *		{
 *			"result": [{
 *				"name": "England",
 *				"children": [{
 *					"name": "Premier League",
 *					"competitions": [{
 *						"status": "available",
 *						"t1": "ARS",
 *						"t1Tip": "Arsenal",
 *						"t2": "ASV",
 *						"t2Tip": "Aston Villa"
 *					}]
 *				}]
 *			}]
 *		}
 *
 */
router.post('/', (req, res) => {
	const keyword = req.body.keyword
	let result = {}
	result.result = EventDirectoryUtil.doFilter(eventdirectory, keyword)

	res.send(result)
})

export default router

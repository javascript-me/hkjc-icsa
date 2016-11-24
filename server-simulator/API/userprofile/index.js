import express from 'express'
const router = express.Router()

const userprofiles = require('../json/userprofiles.json')

/**
 * @api {POST} /userprofile/ userprofiles search result
 * @apiGroup UserProfile

 * @apiDescription userprofiles search result.
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
router.post('/list', (req, res) => {
	let result = userprofiles

	res.send(result)
})

router.post('/item', (req, res) => {
	let result = userprofiles

	res.send(result)
})

router.post('/add', (req, res) => {
	let result = userprofiles

	res.send(result)
})

router.post('/update', (req, res) => {
	let result = userprofiles

	res.send(result)
})

router.post('/delete', (req, res) => {
	let result = userprofiles

	res.send(result)
})

export default router

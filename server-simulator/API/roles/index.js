import express from 'express'
const router = express.Router()

const roles = require('../json/roles.json')

/**
 * @api {POST} /roles/ roles search result
 * @apiGroup Roles

 * @apiDescription roles search result.
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
	let result = roles

	res.send(result)
})

export default router

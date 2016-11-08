import express from 'express'
const router = express.Router()

const config = require('./json/config.json')

/**
 * @api {GET} /config/ Config Overrides
 * @apiGroup Config

 * @apiDescription Retrieve server specific config overrides.
 *
 * @apiSuccessExample Success response
 *		HTTP/1.1 200 OK
 *		{
 *			"countries": ["China", "Hong Kong", "Macau"]
 *		}
 *
 */
router.get('/', (req, res) => {
	res.send(config)
})

export default router

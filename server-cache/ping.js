import express from 'express'
const router = express.Router()

/**
 * @api {GET} /cache/ping Ping
 * @apiName Ping
 * @apiGroup Cache

 * @apiDescription Ping the cache
 *
 * @apiSuccessExample Default behaviour
 *		HTTP/1.1 200 OK
 *		{
 *		}
 */
router.get('/', (req, res) => {
	res.status(200)
	res.send()
})

export default router

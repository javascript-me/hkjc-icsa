import express from 'express'
const router = express.Router()

/**
 * @api {GET} /clock Get the time
 * @apiGroup Clock

 * @apiDescription Get the time.
 *
 * @apiSuccessExample Success response
 *		HTTP/1.1 200 OK
 *		{
 *			"1479723928178"
 *		}
 *
 */
router.get('/', (req, res) => {
	res.status(200)
	res.send(new Date().getTime().toString())
})

export default router

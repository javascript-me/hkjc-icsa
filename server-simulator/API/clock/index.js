import express from 'express'
const router = express.Router()

router.get('/getTime', (req, res) => {
	res.status(200)
	res.send(new Date().getTime().toString())
})

export default router

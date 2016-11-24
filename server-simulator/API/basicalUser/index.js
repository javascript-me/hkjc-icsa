import express from 'express'
const router = express.Router()
import allUser from '../json/baseUserProfile.json'
import _ from 'lodash'

/**
 
 
 */
router.post('/getById', (req, res) => {
	let status = 200
	let result = ''
	if(!req.body.id) {
		result = allUser
	} else {
		result = _.find(allUser,item => item.id === id)
	}
	(!result) && (status = 404)
	res.status(status)
	res.send(result)
})

export default router

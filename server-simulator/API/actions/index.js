import express from 'express'
import _ from 'lodash'

const allActions = require('../json/actions.json')
import ActionsUtil from './actions-util'

const router = express.Router()

/**
 * @apiGroup Actions
 * @api {POST} /actions/list actions list

 * @apiDescription Search criteria mock API in actions list.
 *
 */
router.post('/list', (req, res) => {
	var filteredResult = ActionsUtil.listFilter(allActions, req.body)
	res.send(filteredResult)
})

router.post('/edit', (req, res) => {
	let data = req.body.data
	let status = 200
	let result = {}
	if (data) {
		let index = _.findIndex(allActions, (item) => (item.taskID === data.taskID))
		if (index > -1) {
			allActions[index] = Object.assign({}, allActions[index], data)
			result.status = true
		} else {
			status = 404
			result.status = false
		}
	}
	res.send(result)
	res.status(status)
})

export default router

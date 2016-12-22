import express from 'express'
// import _ from 'lodash'

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

export default router

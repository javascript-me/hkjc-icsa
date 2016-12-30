import express from 'express'
import _ from 'lodash'

const allActions = require('../json/actions.json')
import ActionsUtil from './actions-util'
import priorityFilter from '../json/filter-dropdowns/priorities.json'
import categoriesFilter from '../json/filter-dropdowns/categories_action.json'
import statusFilter from '../json/filter-dropdowns/status_action.json'
import competitionsFilter from '../json/filter-dropdowns/competitions.json'
import matchesFilter from '../json/filter-dropdowns/matches.json'
import inplayFilter from '../json/filter-dropdowns/inplay.json'
import continentsFilter from '../json/filter-dropdowns/continents.json'
import countriesFilter from '../json/filter-dropdowns/countries.json'
import sportsFilter from '../json/filter-dropdowns/sports.json'

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

router.post('/reassignmentUser', (req, res) => {
	var result = ActionsUtil.reassignmentUser(allActions, req.body)
	res.send(result)
})

router.post('/reassignmentUserRole', (req, res) => {
	var result = ActionsUtil.reassignmentUserRole(allActions, req.body)
	res.send(result)
})

router.get('/priorities', (req, res) => {
	let status = 200
	let result = priorityFilter
	res.status(status)
	res.send(result)
})

router.get('/categories', (req, res) => {
	let status = 200
	let result = categoriesFilter
	res.status(status)
	res.send(result)
})

router.get('/countries', (req, res) => {
	let status = 200
	let result = countriesFilter.countries
	res.status(status)
	res.send(result)
})

router.get('/sports', (req, res) => {
	let status = 200
	let result = sportsFilter.sports
	res.status(status)
	res.send(result)
})

router.get('/competitions', (req, res) => {
	let status = 200
	let result = competitionsFilter.competitions
	res.status(status)
	res.send(result)
})

router.get('/continents', (req, res) => {
	let status = 200
	let result = continentsFilter.continents
	res.status(status)
	res.send(result)
})

router.get('/matches', (req, res) => {
	let status = 200
	let result = matchesFilter.matches
	res.status(status)
	res.send(result)
})

router.get('/inplay', (req, res) => {
	let status = 200
	let result = inplayFilter.inplay
	res.status(status)
	res.send(result)
})

router.get('/status', (req, res) => {
	let status = 200
	let result = statusFilter
	res.status(status)
	res.send(result)
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

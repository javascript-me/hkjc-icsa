import express from 'express'

import EventDirectoryUtil from './event-directory-util'
const football = require('../json/eventdirectory/football.json').events

const eventType = require('../json/filter-dropdowns/event-type.json')
const competition = require('../json/filter-dropdowns/competitions.json')
const router = express.Router()

/**
 * @api {POST} /eventdirectory/search/football Eventdirectory search result
 * @apiGroup EventDirectory

 * @apiDescription Eventdirectory search result
 *
 * @apiParam {String} keyword Search keyword
 * @apiParam {String} [eventType] Event Type
 * @apiParam {String} [from] Kick Off Time From
 * @apiParam {String} [to] Kick Off Time To
 * @apiParamExample {json} Request-Example:
 * 		{
 * 			"keyword": "England",
 * 			"eventType": "Assigned,In-Play,Pre-Event",
 * 			"competition": "Assigned,In-Play,Pre-Event",
 * 			"from": "16/09/2016 10:00",
 * 			"to": "26/09/2016 10:00"
 * 		}
 */
router.post('/search/football', (req, res) => {
	let result = EventDirectoryUtil.footballFilter(football, req.body)
	res.send(result)
})

router.get('/autosugestion/football', (req, res) => {
	let allKeyWord = EventDirectoryUtil.footballAllKeyWord(football)
	res.send(allKeyWord)
})

router.get('/eventType', (req, res) => {
	let status = 200
	let result = eventType
	res.status(status)
	res.send(result)
})
router.get('/competition', (req, res) => {
	let status = 200
	let result = competition.competitions
	res.status(status)
	res.send(result)
})
export default router

import express from 'express'
import moment from 'moment'
import utils from './utils.js'

const router = express.Router()
const jsonObject = require('../json/broadcast.json')
const jsonObjectOfOtherUser = require('../json/broadcast.json')


/**
 * @api {GET} /broadcast/search Search Broadcast
 * @apiGroup Broadcast

 * @apiDescription Search criteria mock API in Broadcast log page.
 *
 * @apiParam {String} username=allgood Current customer's name
 * @apiParam {String} betType=football Sport Type, football, basketball or horse-racing
 * @apiParam {String} [keyword] Keyword for search criteria
 * @apiParam {DateTime} dateTimeFrom Broadcast log date time from, defualt as 60 days before, e.g. 22 Sep 2016 00:00.
 * @apiParam {DateTime} dateTimeTo Broadcast log date time to, default as today's midnight, e.g. 21 Nov 2016 23:59.
 * @apiParam {String} [Category] Category value.
 * @apiParam {String} [Sports] Sports value.
 *
 * @apiSuccess (Success) {String} betType football
 * @apiSuccess (Success) {String} keyword
 * @apiSuccess (Success) {DateTime} dateTimeFrom 22 Sep 2016 00:00 ( 60 days before)
 * @apiSuccess (Success) {DateTime} dateTimeTo 21 Nov 2016 23:59 (Today)
 * @apiSuccess (Success) {Object[]} data
 * @apiSuccessExample Success response
 *		HTTP/1.1 200 OK
 *		{
 *			"data": [ ... ],
 *			"betType": "football",
 *			"keyword": "",
 *			"dateTimeFrom": "22 Sep 2016 00:00:00",
 *			"dateTimeTo": "21 Nov 2016 00:00:00"
 *		}
 *
 *
 */
router.get('/search', (req, res) => {
	const broadcast = req.body.username === 'allgood' ? jsonObject.broadcast.slice() : jsonObjectOfOtherUser.broadcast.slice()

	const result = utils.doFilter(broadcast, req.body)

	res.send({ data: result, betType: req.body.betType, keyword: req.body.keyword, dateTimeFrom: req.body.dateTimeFrom, dateTimeTo: req.body.dateTimeTo })
})

/**
 * @api {GET} /broadcast/categories Return Categories for Broadcast
 * @apiGroup Broadcast

 * @apiDescription Return Categories mock API in Broadcast page.
 *
 *
 * @apiSuccess (Success) {DateTime} dateFetch 22 Sep 2016 00:00 Current Date
 * @apiSuccess (Success) {Object[]} data
 * @apiSuccessExample Success response
 *		HTTP/1.1 200 OK
 *		{
 *			"data": [ ... ],
 *			"dateTimeFrom": "22 Sep 2016 00:00:00"
 *		}
 *
 *
 */
router.get('/categories', (req, res) => {
	let result = []
	const categories = ['Message name','Sports Type','Continent','Country','Competition(Event Level1)','Match (Race for HR )(Event Level2)']
	categories.map((e,i) => result.push({id: i, value: e}))

	res.send({ data: result, dateFetch: new Date() })
})

/**
 * @api {GET} /broadcast/inplay Return Inplay for Broadcast
 * @apiGroup Broadcast

 * @apiDescription Return Inplay mock API in Broadcast page.
 *
 *
 * @apiSuccess (Success) {DateTime} dateFetch 22 Sep 2016 00:00 Current Date
 * @apiSuccess (Success) {Object[]} data
 * @apiSuccessExample Success response
 *		HTTP/1.1 200 OK
 *		{
 *			"data": [ ... ],
 *			"dateTimeFrom": "22 Sep 2016 00:00:00"
 *		}
 *
 *
 */
router.get('/inplay', (req, res) => {
	let result = []
	const categories = ['Not In-Play','In Play']
	categories.map((e,i) => result.push({id: i, value: e}))

	res.send({ data: result, dateFetch: new Date() })
})


export default router

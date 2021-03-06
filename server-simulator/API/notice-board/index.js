import express from 'express'
import moment from 'moment'
import helper from './export_helper'
import NoticeBoardUtil from './notice-board-util'
const router = express.Router()
const jsonAlerts = require('../json/notice-alerts.json') || {}
const jsonCriticalInformations = require('../json/notice-critical-informations.json') || {}
const allCategories = require('../json/filter-dropdowns/categories.json')
const allCompetitions = require('../json/filter-dropdowns/competitions.json')
const allContinents = require('../json/filter-dropdowns/continents.json')
const allCountries = require('../json/filter-dropdowns/countries.json')
const allInplays = require('../json/filter-dropdowns/inplay.json')
const allMatches = require('../json/filter-dropdowns/matches.json')
const allPriorities = require('../json/filter-dropdowns/priorities.json')
const allSports = require('../json/filter-dropdowns/sports.json')
const allStatuses = require('../json/filter-dropdowns/status.json')

const getRecentlySixMonthNoticesByUserName = (alerts, criticalInformations, userName) => {
	let cloneNotices = []

	// Step 1 Get all alerts and critical information by current userName and combine into one array
	cloneNotices = getNoticeDataByUserName(alerts, criticalInformations, userName)

	// // Step 2 Filter by system_distribution_time, and only keep recently 6 months data
	cloneNotices = filterOutNoticeEalierThanSixMonthsAgo(cloneNotices)

	// // Step 3 Sort by system_distribution_time column in DESC
	cloneNotices.sort(sortNoticesBySystemDistributionTimeDESC)

	return cloneNotices
}

const getNoticeDataByUserName = (allAlerts, allCriticalInformations, userName) => {
	let alerts = allAlerts[userName] || []
	let criticalInformations = allCriticalInformations[userName] || []

	return [].concat(alerts, criticalInformations)
}

const filterOutNoticeEalierThanSixMonthsAgo = (notices) => {
	let now = moment(new Date())
	let sixMonthsBefore = now.subtract(6, 'months')

	return notices.filter((notice) => {
		return moment(notice.system_distribution_time).isAfter(sixMonthsBefore)
	})
}

const sortNoticesBySystemDistributionTimeDESC = (a, b) => {
	return moment(b.system_distribution_time).valueOf() - moment(a.system_distribution_time).valueOf()
}

const checkNoticeIsImportant = (notice) => {
	return notice.alert_status === 'New'
}

/**
 * @api {GET} /notice-board/ Get notice board data
 * @apiGroup NoticeBoard

 * @apiDescription Mock API for getting alerts and critical informations results for notice board.
 *
 * @apiParam {String} username Username of current user.
 *
 * @apiSuccess (Success) {String} username allgood
 * @apiSuccessExample Success response
 *        HTTP/1.1 200 OK
 *        [
 *            // alerts and critical information array
 *        ]
 *
 */
router.get('/', (req, res) => {
	let userName = req.query.username
	let cloneNotices = []
	let status = null
	let result = {}

	// Step 1 check userName exits or not, if not, response error with http 403, otherwise, go ahead
	if (!userName) {
		status = 403
		result = {error: 'Sorry we need your username to get notice data'}

		res.status(status)
		res.send(result)

		return false
	}

	// Step 2 get valid notices
	cloneNotices = getRecentlySixMonthNoticesByUserName(jsonAlerts, jsonCriticalInformations, userName)

	// Step 3 response the data result with http 200
	status = 200
	result = cloneNotices

	res.status(status)
	res.send(result)
})

/**
 * @api {POST} /notice-board/update-acknowledge-status/ Get notice board data with updating notice status by id
 * @apiGroup NoticeBoard

 * @apiDescription Mock API for getting alerts and critical information results for notice board,
 * before sending response, we will also update notice status by given id.
 *
 * @apiParam {String} username Username of current user.
 * @apiParam {String} id Unique id of notice.
 * @apiParam {String} command Action need to take. It will be either "Acknowledge" or "Unacknowledge".
 *
 * @apiSuccess (Success) {String} username allgood
 * @apiSuccess (Success) {String} id A1
 * @apiSuccess (Success) {String} command Acknowledge
 *
 * @apiSuccessExample Success response
 *        HTTP/1.1 200 OK
 *        [
 *            // alerts and critical informations array
 *        ]
 *
 */
router.post('/update-acknowledge-status', (req, res) => {
	let userName = req.body.username
	let id = req.body.id
	let command = req.body.command

	let cloneNotices = []
	let status = null
	let result = {}

	// Step 1 check userName exits or not, if not, response error with http 403, otherwise, go ahead
	if (!userName) {
		status = 403
		result = { error: 'Sorry we need your username to get notice data' }

		res.status(status)
		res.send(result)

		return false
	}

	NoticeBoardUtil.updateAcknowledgeStatusById(jsonAlerts[userName], id, command)
	NoticeBoardUtil.updateAcknowledgeStatusById(jsonCriticalInformations[userName], id, command)

	// Step 2 get valid notices
	cloneNotices = getRecentlySixMonthNoticesByUserName(jsonAlerts, jsonCriticalInformations, userName)

	// Step 3 response the data result with http 200
	status = 200
	result = cloneNotices

	//
	result.id = id

	res.status(status)
	res.send(result)
})

/**
 * @api {POST} /notice-board/update-table-acknowledge-status/ noticeboard table updating notice status
 * @apiGroup NoticeBoard

 * @apiDescription when click 'Acknowledge/Unacknowledge' button, the status will be update in the noticeboard table.
 *
 * @apiParam {String} username Username of current user.
 * @apiParam {String} id Unique id of notice.
 * @apiParam {String} command Action need to take. It will be either "Acknowledge" or "Unacknowledge".
 *
 * @apiSuccess (Success) {String} username allgood
 * @apiSuccess (Success) {String} id A1
 * @apiSuccess (Success) {String} command Acknowledge
 *
 * @apiSuccessExample Success response
 *        HTTP/1.1 200 OK
 *        [
 *            // alerts and critical information array
 *        ]
 *
 */
router.post('/update-table-acknowledge-status', (req, res) => {
	let id = req.body.id
	let command = req.body.command

	let cloneNotices
	const username = req.body.username

	NoticeBoardUtil.updateAcknowledgeStatusById(jsonAlerts[username], id, command)
	NoticeBoardUtil.updateAcknowledgeStatusById(jsonCriticalInformations[username], id, command)
	cloneNotices = getRecentlySixMonthNoticesByUserName(jsonAlerts, jsonCriticalInformations, username)

	let status = 200
	const filteredNotices = NoticeBoardUtil.doFilter(cloneNotices,
		req.body.keyword,
		req.body.priority,
		req.body.sportsType,
		req.body.competition,
		req.body.match,
		req.body.inPlay,
		req.body.continent,
		req.body.country,
		req.body.messageCategory,
		req.body.alertStatus,
		req.body.dateTimeFrom,
		req.body.dateTimeTo
	)
	res.status(status)
	res.send(NoticeBoardUtil.doSorting(filteredNotices, 'date_time', 'DESCEND'))
})

/**
 * @api {post} /notice-board/add-noticeboard-data Add New noticeboard data
 * @apiGroup NoticeBoard

 * @apiSuccessExample Success response
 *		HTTP/1.1 200 OK
 *		{
 *			"alert_name": "Test Name",
 *			"priority": "Critical",
 *			"alert_status": "New",
 *			"message_category": "Test Information",
 *			"system_distribution_time": ,
 *			"message_detail": "Test Message Detail",
 *			"assignee": "Trading Manager",
 *			"time_range": "",
 *			"sports_type": "Football",
 *			"event_level1": "FA Cup",
 *			"event_level2": "ARS vs ASV",
 *			"inplay": "In-play",
 *			"continent": "Europe",
 *			"country": "England",
 *			"recipient": "Senior Trader",
 *			"id":
 *		}
 *
 *
*/
router.post('/add-noticeboard-data', (req, res) => {
	// let newJsonAlerts
	let option = 'allgood'
	let dt = new Date()
	let systemDisTime = moment(dt, 'DD MMMM YYYY HH:mm:ss').format('DD MMMM YYYY HH:mm:ss')
	let id = 'TEST' + Math.floor(Math.random() * 1000)
	let value = {
		'alert_name': 'Test Name',
		'priority': 'Critical',
		'alert_status': 'New',
		'message_category': 'Test Information',
		'system_distribution_time': systemDisTime,
		'message_detail': 'Test Message Detail',
		'assignee': 'Trading Manager',
		'time_range': '',
		'sports_type': 'Football',
		'event_level1': 'FA Cup',
		'event_level2': 'ARS vs ASV',
		'inplay': 'In-play',
		'continent': 'Europe',
		'country': 'England',
		'recipient': 'Senior Trader',
		'id': id
	}
	jsonAlerts[option].push(value)
	// newJsonAlerts = jsonAlerts[option]

	let status = 200
	res.status(status)
	// res.send(newJsonAlerts)
	res.send(value)
})

/**
 * @api {GET} /notice-board/remind-count/ Get remind count
 * @apiGroup NoticeBoard

 * @apiDescription Get unread and high or critical priority notices count
 *
 * @apiParam {String} username Username of current user.
 *
 * @apiSuccess (Success) {String} username allgood
 * @apiSuccessExample Success response
 *        HTTP/1.1 200 OK
 *        number   // Unread and high or critical priority notices count
 *
 */
router.get('/remind-count', (req, res) => {
	let userName = req.query.username
	let cloneNotices = []
	let status = null
	let result = {count: 0}

	// Step 1 check userName exits or not, if not, response error with http 403, otherwise, go ahead
	if (!userName) {
		status = 403
		result = {error: 'Sorry we need your username to get notice data'}

		res.status(status)
		res.send(result)

		return false
	}

	// Step 2 get valid notices
	cloneNotices = getRecentlySixMonthNoticesByUserName(jsonAlerts, jsonCriticalInformations, userName)

	// Step 5 response the length result with http 200
	status = 200
	result = {
		count: cloneNotices.filter(checkNoticeIsImportant).length
	}

	res.status(status)
	res.send(result)
})
/**
 * @api {GET} /notice-board/export Export
 * @apiGroup NoticeBoard

 * @apiDescription Mock API for export search result of Noticeboard page.
 *
 * @apiParam {String} type File type (pdf, csv) ask for export.
 * @apiParam {String} username=allgood Current customer's name
 * @apiParam {String} [keyword] Keyword for search criteria
 * * @apiParam {String} [priority] priority.
 * @apiParam {DateTime} dateTimeFrom Notice board date time from, defualt as 60 days before, e.g. 22 Sep 2016 00:00.
 * @apiParam {DateTime} dateTimeTo Notice board date time to, default as today's midnight, e.g. 21 Nov 2016 23:59.
 * @apiParam {String} [sportsType] sports type.
 * @apiParam {String} [competition] competition.
 * @apiParam {String} [match] match.
 * @apiParam {String} [inPlay] inPlay.
 * @apiParam {String} [continent] continent.
 * @apiParam {String} [country] country.
 * @apiParam {String} [messageCategory] message Category.
 * @apiParam {String} [alertStatus] alert Status.
 * @apiParam {String} [recipient] recipient.
 *
 * @apiSuccess (Success) {String} type pdf
 * @apiSuccess (Success) {String} username allgood
 * @apiSuccess (Success) {String} keyword
 * @apiSuccess (Success) {DateTime} dateTimeFrom 22 Sep 2016 00:00 ( 60 days before)
 * @apiSuccess (Success) {DateTime} dateTimeTo 21 Nov 2016 23:59 (Today)
 * @apiSuccessExample Success response
 *		HTTP/1.1 200 OK
 *		PDF or CVS file
 *
 */
router.get('/export', (req, res) => {
	const type = req.params.type || req.query.type
	const json = req.params.json || req.query.json
	const filters = json ? JSON.parse(decodeURIComponent(json)) : {}
	let data = []
	if (filters.username === 'allgood') {
		data = jsonAlerts[filters.username]
	}
	let result = data
	let statusCode = 200
	let dateFilename = moment(new Date()).format('DDMMYYHHmmSS')
	switch (type.toLowerCase()) {
	case 'pdf':
		res.sendfile('server-simulator/API/notice-board/output.pdf')

		break
	case 'csv':
		result = helper.toCSV(result)
		res.writeHead(statusCode, {
			'Content-Type': 'application/octet-stream',
			'Content-Disposition': 'attachment; filename=NoticeBoardReport_' + dateFilename + '.csv'
		})
		res.end(result)
		break
	default:
		break
	}
})
/**
 * @api {GET} /notice-board/filterNoticeBoardTableData Filter Noticeboard Table Data
 * @apiGroup NoticeBoard

 * @apiDescription Mock API to Filter result of Noticeboard page.
 * @apiParam {String} username=allgood Current customer's name
 * @apiParam {String} [keyword] Keyword for search criteria
 * * @apiParam {String} [priority] priority.
 * @apiParam {DateTime} dateTimeFrom Notice board date time from, defualt as 60 days before, e.g. 22 Sep 2016 00:00.
 * @apiParam {DateTime} dateTimeTo Notice board date time to, default as today's midnight, e.g. 21 Nov 2016 23:59.
 * @apiParam {String} [sportsType] sports type.
 * @apiParam {String} [competition] competition.
 * @apiParam {String} [match] match.
 * @apiParam {String} [inPlay] inPlay.
 * @apiParam {String} [continent] continent.
 * @apiParam {String} [country] country.
 * @apiParam {String} [messageCategory] message Category.
 * @apiParam {String} [alertStatus] alert Status.
 * @apiParam {String} [recipient] recipient.
 *
 * @apiSuccess (Success) {String} type pdf
 * @apiSuccess (Success) {String} username allgood
 * @apiSuccess (Success) {String} keyword
 * @apiSuccess (Success) {DateTime} dateTimeFrom 22 Sep 2016 00:00 ( 60 days before)
 * @apiSuccess (Success) {DateTime} dateTimeTo 21 Nov 2016 23:59 (Today)
 * @apiSuccessExample Success response
 *		HTTP/1.1 200 OK
 *
 */
router.post('/filterNoticeBoardTableData', (req, res) => {
	const username = req.body.username
	let alerts = jsonAlerts[username]
	let criticalAlerts = jsonCriticalInformations[username]
	let cloneNotices = [].concat(alerts, criticalAlerts)
	let status = 200
	const filteredNotices = NoticeBoardUtil.doFilter(cloneNotices,
		req.body.keyword,
		req.body.priority,
		req.body.sportsType,
		req.body.competition,
		req.body.match,
		req.body.inPlay,
		req.body.continent,
		req.body.country,
		req.body.messageCategory,
		req.body.alertStatus,
		req.body.dateTimeFrom,
		req.body.dateTimeTo,
		req.body.recipient
	)
	res.status(status)
	res.send(NoticeBoardUtil.doSorting(filteredNotices, 'date_time', 'DESCEND'))
})
/**
 * @api {GET} /notice-board/categories Get categories list
 * @apiGroup NoticeBoard

 * @apiDescription Mock API to get all categories.
 * @apiSuccessExample Success response
 *		HTTP/1.1 200 OK
 *
 *
 */
router.get('/categories', (req, res) => {
	let status = 200
	let result = allCategories.categories
	res.status(status)
	res.send(result)
})
/**
 * @api {GET} /notice-board/competitions Get competitions list
 * @apiGroup NoticeBoard

 * @apiDescription Mock API to get all competitions.
 * @apiSuccessExample Success response
 *		HTTP/1.1 200 OK
 *
 *
 */
router.get('/competitions', (req, res) => {
	let status = 200
	let result = allCompetitions.competitions
	res.status(status)
	res.send(result)
})
/**
 * @api {GET} /notice-board/continents Get continents list
 * @apiGroup NoticeBoard

 * @apiDescription Mock API to get all continents.
 * @apiSuccessExample Success response
 *		HTTP/1.1 200 OK
 *
 *
 */
router.get('/continents', (req, res) => {
	let status = 200
	let result = allContinents.continents
	res.status(status)
	res.send(result)
})
/**
 * @api {GET} /notice-board/countries Get countries list
 * @apiGroup NoticeBoard

 * @apiDescription Mock API to get all countries.
 * @apiSuccessExample Success response
 *		HTTP/1.1 200 OK
 *
 *
 */
router.get('/countries', (req, res) => {
	let status = 200
	let result = allCountries.countries
	res.status(status)
	res.send(result)
})
/**
 * @api {GET} /notice-board/inplays Get inplays list
 * @apiGroup NoticeBoard

 * @apiDescription Mock API to get all inplays.
 * @apiSuccessExample Success response
 *		HTTP/1.1 200 OK
 *
 *
 */
router.get('/inplays', (req, res) => {
	let status = 200
	let result = allInplays.inplay
	res.status(status)
	res.send(result)
})
/**
 * @api {GET} /notice-board/matches Get matches list
 * @apiGroup NoticeBoard

 * @apiDescription Mock API to get all matches.
 * @apiSuccessExample Success response
 *		HTTP/1.1 200 OK
 *
 *
 */
router.get('/matches', (req, res) => {
	let status = 200
	let result = allMatches.matches
	res.status(status)
	res.send(result)
})
/**
 * @api {GET} /notice-board/priorities Get priorities list
 * @apiGroup NoticeBoard

 * @apiDescription Mock API to get all priorities.
 * @apiSuccessExample Success response
 *		HTTP/1.1 200 OK
 *
 *
 */
router.get('/priorities', (req, res) => {
	let status = 200
	let result = allPriorities.priorities
	res.status(status)
	res.send(result)
})
/**
 * @api {GET} /notice-board/sports Get sports list
 * @apiGroup NoticeBoard

 * @apiDescription Mock API to get all sports.
 * @apiSuccessExample Success response
 *		HTTP/1.1 200 OK
 *
 *
 */
router.get('/sports', (req, res) => {
	let status = 200
	let result = allSports.sports
	res.status(status)
	res.send(result)
})
/**
 * @api {GET} /notice-board/statuses Get statuses list
 * @apiGroup NoticeBoard

 * @apiDescription Mock API to get all statuses.
 * @apiSuccessExample Success response
 *		HTTP/1.1 200 OK
 *
 *
 */
router.get('/statuses', (req, res) => {
	let status = 200
	let result = allStatuses.status
	res.status(status)
	res.send(result)
})
/**
 * @api {GET} /notice-board/notice-tips/ Get remind count
 * @apiGroup NoticeBoard

 * @apiDescription Get the new tasks count
 *
 * @apiParam {String} username Username of current user.
 *
 * @apiSuccess (Success) {String} username allgood
 * @apiSuccessExample Success response
 *		HTTP/1.1 200 OK
 *		number   // Get the new tasks count
 *
 */
router.get('/notice-tips', (req, res) => {
	let userName = req.query.username
	let status = null
	let result = {count: 0}

	// Step 1 check userName exits or not, if not, response error with http 403, otherwise, go ahead
	if (!userName) {
		status = 403
		result = { error: 'Sorry we need your username to get notice data' }

		res.status(status)
		res.send(result)

		return false
	}

	// Step 5 response the length result with http 200
	status = 200
	result = {
		count: Math.round(Math.random() * 10)
	}

	res.status(status)
	res.send(result)
})

export default router

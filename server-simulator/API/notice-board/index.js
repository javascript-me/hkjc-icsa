import express from 'express'
import moment from 'moment'

const router = express.Router()
const jsonAlerts = require('../json/notice-alerts.json') || {}
const jsonCriticalInformations = require('../json/notice-critical-informations.json') || {}

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


/**
 * @api {GET} /notice-board/ Get notice board data
 * @apiGroup NoticeBoard

 * @apiDescription Mock API for getting alerts and critical informations results for notice board.
 *
 * @apiParam {String} username Username of current user.
 *
 * @apiSuccess (Success) {String} username allgood
 * @apiSuccessExample Success response
 *		HTTP/1.1 200 OK
 *		[
 *			// alerts and critical informations array
 *		]
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
		result = { error: 'Sorry we need your username to get notice data' }

		res.status(status)
		res.send(result)

		return false
	}

	// Step 2 Get all alerts and critical information by current userName and combine into one array
	cloneNotices = getNoticeDataByUserName(jsonAlerts, jsonCriticalInformations, userName)

	// // Step 3 Filter by system_distribution_time, and only keep recently 6 months data
	cloneNotices = filterOutNoticeEalierThanSixMonthsAgo(cloneNotices)

	// // Step 4 Sort by system_distribution_time column in DESC
	cloneNotices.sort(sortNoticesBySystemDistributionTimeDESC)

	// Step 5 response the data result with http 200
	status = 200
	result = cloneNotices

	res.status(status)
	res.send(result)
})

export default router

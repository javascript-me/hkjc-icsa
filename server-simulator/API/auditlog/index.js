import express from 'express'
import helper from './export_helper'
import * as fs from 'fs'
import moment from 'moment'
import AuditlogsUtil from './auditlogs-util'

const router = express.Router()
const jsonObject = require('../json/auditlogs.json')
const jsonObjectOfOtherUser = require('../json/auditlogs-other-user.json')

/**
 * @api {POST} /auditlog/filterAuditlogs Filter Auditlogs
 * @apiGroup Auditlog

 * @apiDescription Search criteria mock API in Audit log page.
 *
 * @apiParam {String} username=allgood Current customer's name
 * @apiParam {String} betType=football Sport Type, football, basketball or horse-racing
 * @apiParam {String} [keyword] Keyword for search criteria
 * @apiParam {String} sortingObjectFieldName=date_time Column name which sorted by.
 * @apiParam {String} sortingObjectOrder=DESCEND Sorting order, DESCEND or ASCEND.
 * @apiParam {Number} selectedPageNumber=1 Selected page number.
 * @apiParam {DateTime} dateTimeFrom Audit log date time from, defualt as 60 days before, e.g. 22 Sep 2016 00:00.
 * @apiParam {DateTime} dateTimeTo Audit log date time to, default as today's midnight, e.g. 21 Nov 2016 23:59.
 * @apiParam {String} [typeValue] Type value.
 * @apiParam {String} [backEndID] Back end ID.
 * @apiParam {String} [frontEndID] Front end ID.
 * @apiParam {String} [eventLv1] Event name.
 * @apiParam {String} [homeValue] Home team.
 * @apiParam {String} [awayValue] Away team.
 * @apiParam {String} [dateTimeGameStart] Game Start time.
 * @apiParam {String} [userId] The user who trigger this log.
 * @apiParam {String} [userRole] The role of the user who trigger this log.
 * @apiParam {String} [systemFunc] In which function trigger this log.
 * @apiParam {String} [betTypeFeature] Bet type of the games.
 * @apiParam {String} [device] Device
 * @apiParam {String} [ipAddress] IP Address.
 * @apiParam {String} [errorCode] Error code.
 *
 * @apiSuccess (Success) {String} username allgood
 * @apiSuccess (Success) {String} betType football
 * @apiSuccess (Success) {String} keyword
 * @apiSuccess (Success) {String} sortingObjectFieldName date_time
 * @apiSuccess (Success) {String} sortingObjectOrder DESCEND
 * @apiSuccess (Success) {Number} selectedPageNumber 1
 * @apiSuccess (Success) {DateTime} dateTimeFrom 22 Sep 2016 00:00 ( 60 days before)
 * @apiSuccess (Success) {DateTime} dateTimeTo 21 Nov 2016 23:59 (Today)
 * @apiSuccessExample Success response
 *		HTTP/1.1 200 OK
 *		{
 *			"auditlogs": [ ... ],
 *			"pageData": {pages: [ ... ], totalPages: 40 }
 *		}
 *
 *
 */
router.post('/filterAuditlogs', (req, res) => {
	let cloneAuditlogs

	if (req.body.username === 'allgood') {
		cloneAuditlogs = jsonObject.auditlogs.slice(0)
	} else {
		cloneAuditlogs = jsonObjectOfOtherUser.auditlogs.slice(0)
	}

	const filteredAuditlogs = AuditlogsUtil.doFilter(cloneAuditlogs,
		req.body.keyword,
		req.body.typeValue,
		req.body.userRole,
		req.body.systemFunc,
		req.body.betTypeFeature,
		req.body.device,
		req.body.dateTimeFrom,
		req.body.dateTimeTo
	)

	// TODO: check how to send JSON POST request data.

	res.send(AuditlogsUtil.doSorting(filteredAuditlogs, 'date_time', 'DESCEND'))
})

router.get('/download/:file', (req, res) => {
	res.writeHead(200, {
		'Content-Type': 'application/octet-stream',
		'Content-Disposition': 'attachment; filename=audit.pdf'})

	fs.createReadStream('./' + req.params.file).pipe(res)
})

/**
 * @api {GET} /auditlog/export Export
 * @apiGroup Auditlog

 * @apiDescription Mock API for export search result of Audit log page.
 *
 * @apiParam {String} type File type (pdf, csv) ask for export.
 * @apiParam {String} username=allgood Current customer's name
 * @apiParam {String} betType=football Sport Type, football, basketball or horse-racing
 * @apiParam {String} [keyword] Keyword for search criteria
 * @apiParam {DateTime} dateTimeFrom Audit log date time from, defualt as 60 days before, e.g. 22 Sep 2016 00:00.
 * @apiParam {DateTime} dateTimeTo Audit log date time to, default as today's midnight, e.g. 21 Nov 2016 23:59.
 * @apiParam {String} [typeValue] Type value.
 * @apiParam {String} [backEndID] Back end ID.
 * @apiParam {String} [frontEndID] Front end ID.
 * @apiParam {String} [eventLv1] Event name.
 * @apiParam {String} [homeValue] Home team.
 * @apiParam {String} [awayValue] Away team.
 * @apiParam {String} [dateTimeGameStart] Game Start time.
 * @apiParam {String} [userId] The user who trigger this log.
 * @apiParam {String} [userRole] The role of the user who trigger this log.
 * @apiParam {String} [systemFunc] In which function trigger this log.
 * @apiParam {String} [betTypeFeature] Bet type of the games.
 * @apiParam {String} [device] Device
 * @apiParam {String} [ipAddress] IP Address.
 * @apiParam {String} [errorCode] Error code.
 *
 * @apiSuccess (Success) {String} type pdf
 * @apiSuccess (Success) {String} username allgood
 * @apiSuccess (Success) {String} betType football
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
		data = jsonObject.auditlogs.slice(0)
	} else {
		data = jsonObjectOfOtherUser.auditlogs.slice(0)
	}

	let result = AuditlogsUtil.doFilter(data,
		filters.keyword,
		filters.typeValue,
		filters.userRole,
		filters.systemFunc,
		filters.betTypeFeature,
		filters.device
	)

	let statusCode = 200
	let dateFilename = moment(new Date()).format('DDMMYYHHmmSS')

	switch (type.toLowerCase()) {
	case 'pdf':
		// dateReport = moment(new Date()).format('DD-MMM-YYYY HH:mm')
        //
		// result = helper.toHTML(result, dateReport)
		// res.writeHead(statusCode, {
		// 	'Content-Type': 'application/octet-stream',
		// 	'Content-Disposition': 'attachment; filename=AuditLogReport_' + dateFilename + '.pdf'})
        //
		// pdf.create(result, options).toStream((err, file) => {
		// 	if (err) {
		// 		res.end()
		// 	} else {
		// 		file.pipe(res)
		// 	}
		// })

		res.sendfile('server-simulator/API/auditlog/output.pdf')

		break
	case 'csv':
		result = helper.toCSV(result)
		res.writeHead(statusCode, {
			'Content-Type': 'application/octet-stream',
			'Content-Disposition': 'attachment; filename=AuditLogReport_' + dateFilename + '.csv'})
		res.end(result)
		break
	default:
		break
	}
})

export default router

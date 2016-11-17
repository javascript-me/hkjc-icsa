import express from 'express'
import helper from './export_helper'
import * as pdf from 'html-pdf'
import * as fs from 'fs'
import moment from 'moment'
import PagingUtil from './paging-util'
import PagingService from './paging-service'

const router = express.Router()
const options = { format: 'Letter', orientation: 'landscape', header: { 'height': '15mm'} }
const jsonObject = require('../json/auditlogs.json')
const jsonObjectOfOtherUser = require('../json/auditlogs-other-user.json')

router.post('/filterAuditlogs', (req, res) => {
	var result = {}

	var cloneAuditlogs

	if (req.body.username == "allgood") {
		cloneAuditlogs = jsonObject.auditlogs.slice(0)
	} else {
		cloneAuditlogs = jsonObjectOfOtherUser.auditlogs.slice(0)
	}

	var filteredAuditlogs = PagingUtil.doFilter(cloneAuditlogs,
		req.body.keyword,
		req.body.typeValue,
		req.body.userRole,
		req.body.systemFunc,
		req.body.betTypeFeature,
		req.body.device
	)

	var sortedAuditlogs = PagingUtil.doSorting(filteredAuditlogs, req.body.sortingObjectFieldName, req.body.sortingObjectOrder)

	result.auditlogs = PagingUtil.getAuditlogsFragmentByPageNumber(sortedAuditlogs, Number(req.body.selectedPageNumber))

	PagingService.totalPages = PagingUtil.getTotalPages(sortedAuditlogs.length)
	result.pageData = PagingService.getDataByPageNumber(Number(req.body.selectedPageNumber))

	result.forDebug = {
		sortingObjectFieldName: req.body.sortingObjectFieldName,
		sortingObjectOrder: req.body.sortingObjectOrder,
		keyword: req.body.keyword,
		username: req.body.username
	}

    // TODO: check how to send JSON POST request data.

	res.send(result)
})

router.post('/search', (req, res) => {
	let status = 200
    let result = ""

	const typeValue = req.body.typeValue;
	const userRole = req.body.userRole;
	const systemFunc = req.body.systemFunc;
	const betTypeFeature = req.body.betTypeFeature;
	const device = req.body.device;

	result =  jsonObject.auditlogs.filter(function (al) {
		return (al.Type == typeValue && al.user_role == userRole && al.function_module == systemFunc && al.bet_type == betTypeFeature && al.device == device )
	});

	res.status(status)
	res.send(result)
})

router.get('/download/:file', (req, res) => {
	console.log(req.params)
	res.writeHead(200, {
		'Content-Type': 'application/octet-stream',
		'Content-Disposition': 'attachment; filename=audit.pdf'})

	fs.createReadStream('./' + req.params.file).pipe(res)
})

router.get('/export', (req, res) => {
	const type = req.params.type || req.query.type
	const json = req.params.json || req.query.json
	const filters = !!json ? JSON.parse(json) : {}
	let data = []

	if (filters.username == "allgood") {
		data = jsonObject.auditlogs.slice(0)
	} else {
		data = jsonObjectOfOtherUser.auditlogs.slice(0)
	}

	console.log(filters)
	let result =	PagingUtil.doFilter(data,
						filters.keyword,
						filters.typeValue,
						filters.userRole,
						filters.systemFunc,
						filters.betTypeFeature,
						filters.device
					)
	console.log(result)
	let status = 200
	let dateFilename = moment(new Date()).format('DDMMYYHHmmSS')
	
	switch (type.toLowerCase()) {
		case 'pdf':

			let dateReport = moment(new Date()).format('DD-MMM-YYYY HH:mm')
			
			result = helper.toHTML(result, dateReport)
			res.writeHead(200, {
				'Content-Type': 'application/octet-stream',
				'Content-Disposition': 'attachment; filename=AuditLogReport_' + dateFilename + '.pdf'})

			pdf.create(result, options).toStream((err, file) => {
				if (err) {
					console.log(err)
					res.end()
				}
				else
	                file.pipe(res)
			})

			break
		case 'csv':
			result = helper.toCSV(result)
			res.writeHead(200, {
				'Content-Type': 'application/octet-stream',
				'Content-Disposition': 'attachment; filename=AuditLogReport_' + dateFilename + '.csv'})
			res.end(result)
			break
		default:
			break
	}
})

export default router

import express from 'express'
import helper from './export_helper'
import * as pdf from 'html-pdf'
import * as fs from 'fs'
import moment from 'moment'
import PagingUtil from './paging-util'
import PagingService from './paging-service'


const router = express.Router()
const options = { format: 'Letter', orientation: 'landscape', header: { 'height': '15mm'} }
const data = require('../json/auditlogs.json')

function search(filters = []){

	//Case 3 for betType, Case 1 for Keyword, Case 2 for Filters
	const option = !!filters.keyword ? 1 : !!filters.filters && filters.filters.length > 0 ? 2 :  !!filters.betType ? 3 : 4;

	switch(option){
		case 2:
			return data.auditlogs.filter( i =>{ return i.Type === "Event" })
		break;
		case 1:
			return data.auditlogs.filter( i =>{ return i.function_module === filters.keyword })
		break;
		case 3:
			return data.auditlogs.filter(function(i){ return i.bet_type === filters.betType })
		break;
		default:
			return {...data.auditlogs}
		break;
	}
}

router.post('/filterAuditlogs', (req, res) => {
    var result = {};

    result.auditlogs = PagingUtil.getAuditlogsByPageNumber(data.auditlogs, Number(req.body.selectedPageNumber))

    PagingService.totalPages = PagingUtil.getTotalPages(data.auditlogs.length)
    result.pageData = PagingService.getDataByPageNumber(Number(req.body.selectedPageNumber))

    result.forDebug = {
        sortingObjectFieldName: req.body.sortingObjectFieldName,
        sortingObjectOrder: req.body.sortingObjectOrder
    }

    //TODO: check how to send JSON POST request data.

    res.send(result);
})

router.get('/search', (req, res) => {
	let result = data
	let status = 200

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


	let result = search(filters)
	let status = 200

	switch (type.toLowerCase()) {
		case 'pdf':

			let dateReport = moment(new Date()).format('DD-MMM-YYYY HH:mm')
			let dateFilename = moment(new Date()).format('DDMMYYHHmmSS')
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

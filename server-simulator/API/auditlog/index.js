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

router.post('/filterAuditlogs', (req, res) => {
    var result = {};

	var cloneAuditlogs = jsonObject.auditlogs.slice(0)

	var sortedAuditlogs = PagingUtil.doSorting(cloneAuditlogs, req.body.sortingObjectFieldName, req.body.sortingObjectOrder)

    result.auditlogs = PagingUtil.getAuditlogsFragmentByPageNumber(sortedAuditlogs, Number(req.body.selectedPageNumber))

    PagingService.totalPages = PagingUtil.getTotalPages(sortedAuditlogs.length)
    result.pageData = PagingService.getDataByPageNumber(Number(req.body.selectedPageNumber))

    result.forDebug = {
        sortingObjectFieldName: req.body.sortingObjectFieldName,
        sortingObjectOrder: req.body.sortingObjectOrder
    }

    //TODO: check how to send JSON POST request data.

    res.send(result);
})

router.get('/search', (req, res) => {
	let result = jsonObject
	let status = 200
    const key_word = req.body.key_word  
     if(key_word === "World Cup" || key_word === "EPC" || key_word === "VCL"|| key_word === "SFL" || key_word === "PFL" || key_word === "EPI") {
       result = data.auditlogs.filter(function (al) {
     return (al.event_name === key_word  ) 
     });  
     }
        
    if(key_word === "Candy Date" || key_word === "Jagger Smith" || key_word === "Jerry Li"|| key_word === "Karthik Blay") {
       result = data.auditlogs.filter(function (al) {
         return (al.user_name === key_word ) 
         });  
    }

    if(key_word === "BOCC Supervisor" || key_word === "Trading Manager" || key_word === "Trading Support Analyst" || key_word === "Finance Controller" 
        || key_word === "Content & Planning Manager" 
        || key_word === "Customer Care Representative"
        || key_word === "Director of Group Treasury"
        || key_word === "System Administrator") {
       result = data.auditlogs.filter(function (al) {
         return (al.user_role === key_word ) 
         });  
    }
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
	let result = Array.from(data.auditlogs)
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

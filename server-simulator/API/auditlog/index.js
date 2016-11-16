﻿import express from 'express'
import helper from './export_helper'
import PagingUtil from './paging-util'
import pdf from 'html-pdf'
import PagingService from './paging-service'

const router = express.Router()
const options = { format: 'Letter', orientation: "landscape", header: { "height": "15mm"} }
const data = require('../json/auditlogs.json')

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

router.post('/search', (req, res) => {
    let result = data
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

router.get('/export', (req, res) => {

    
    const type = req.params.type || req.query.type
    let result = {...data.auditlogs}
    let status = 200

    switch (type.toLowerCase()) {
        case "pdf":
            
            result = helper.toHTML(result);
            res.set('Content-Type', 'application/pdf');
            res.set('Content-disposition', 'attachment; filename=auditlog.pdf'); 
            
            pdf.create(result, options).toStream(function (err, file) {
                if (err) {
                    console.log(err)
                    status = 500
                    result = err  
                } 
                else
                    file.pipe(res)
                
                res.status(status)
                res.send(result)
            });
        
            break;
        case "csv":
            result = helper.toCSV(result.auditlogs);
            res.set('Content-Type', 'text/csv');
            res.set('Content-disposition', 'attachment; filename=auditlog.csv'); 
            res.status(status)
            res.send(result)
            break;
        default:
            break;
    }


    
})

export default router

import express from 'express'
import helper from './export_helper'
import PagingUtil from './paging-util'
import pdf from 'html-pdf'
import PagingService from './paging-service'

const router = express.Router()
const options = { format: 'Letter', orientation: "landscape", header: { "height": "15mm"} }
const data = require('../json/auditlogs.json')

router.post('/filterAuditlogs', (req, res) => {
    const filtersArray = ""; // Write filters array accordingly
    const pageNumber = ""; // Write accordingly
    let status = 403
    let result = { error: "Sorry we could not find auditlog with this search criteria", data: [filtersArray, pageNumber] }

    /*Search and Filter code will go here*/
    result = {};
    result.auditlogs = PagingUtil.getAuditlogsByPageNumber(data.auditlogs, Number(req.body.selectedPageNumber))

    PagingService.totalPages = PagingUtil.getTotalPages(data.auditlogs.length)

    result.pageData = PagingService.getDataByPageNumber(Number(req.body.selectedPageNumber))

    res.send(result);
})

router.get('/search', (req, res) => {
    
    let result = data
    let status = 200

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

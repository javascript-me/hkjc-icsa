import express from 'express'
import helper from './export_helper'
import fs from 'fs'
import pdf from 'html-pdf'

const router = express.Router()
const options = { format: 'Letter', orientation: "landscape", header: { "height": "15mm"} }
const data = require('../json/auditlogs.json')


router.post('/filterAuditlogs', (req, res) => {
    const searchText = ""; // Write parameter according
    const filtersArray = ""; // Write filters array accordingly
    const pageNumber = ""; // Write accordingly
    let status = 403
    let result = { error: "Sorry we could not find auditlog with this search criteria", data: [searchText, filtersArray, pageNumber] }

    /*Search and Filter code will go here*/
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

import express from 'express'
import helper from './export_helper'
import * as pdf from 'html-pdf'
import * as fs from 'fs'
import moment from 'moment'


const router = express.Router()
const options = { format: 'Letter', orientation: "landscape", header: { "height": "15mm"} }
const data = require('../json/auditlogs.json')


router.get('/filterAuditlogs', (req, res) => {
    const filtersArray = ""; // Write filters array accordingly
    const pageNumber = ""; // Write accordingly
    let status = 403
    let result = { error: "Sorry we could not find auditlog with this search criteria", data: [filtersArray, pageNumber] }

    /*Search and Filter code will go here*/
    result = data;
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
    "Content-Type": "application/octet-stream",
    "Content-Disposition" : "attachment; filename=audit.pdf"});

    fs.createReadStream("./"+req.params.file).pipe(res)

})

router.get('/export', (req, res) => {

    
    const type = req.params.type || req.query.type
    let result = Array.from(data.auditlogs)
    let status = 200

    switch (type.toLowerCase()) {
        case "pdf":

            let dateReport = moment(new Date()).format("DD-MMM-YYYY HH:mm")
            let dateFilename = moment(new Date()).format("DDMMYYHHmmSS")
            result = helper.toHTML(result)
            res.writeHead(200, {
            "Content-Type": "application/octet-stream",
            "Content-Disposition" : "attachment; filename=AuditLogReport_"+dateFilename+".pdf"});
            
            pdf.create(result, options).toStream(function (err, file) {
                if (err) {
                    console.log(err)
                    status = 500
                    res.status(status)
                    res.end()
                } 
                else
                    fs.createReadStream("./temp.pdf").pipe(res)
            });
        
            break;
        case "csv":
            result = helper.toCSV(result);
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

import csv from 'json2csv'
import _ from 'underscore'
import fs from 'fs'

let helper = {}

helper.toCSV = data => {
	let fields = []

	Object.keys(data[0]).forEach((k) => fields.push(k))
	return csv({ data: data, fields: fields })
}

helper.toHTML = (data, date) => {
	let temp = data
	let html = ''
	let headers = ''
	let counter = 1

	const columns = Object.keys(temp[0])
	const tableHeader = getTableHeader(columns)
	const source = fs.readFileSync('./server-simulator/API/notice-board/template.html', 'utf-8')
	let template = _.template(source)

	while (temp.length > 0) {
		const rows = temp.length > 25 ? 25 : temp.length
		const table = temp.slice(0, rows)
		html += getPage(table, tableHeader, counter, date)
		headers += getHeader(counter++, date)
		temp.splice(0, 25)
	}

	headers += getFooter()

	template = template({ html: html, pageHeaders: headers })

	return template
}

function getTableHeader (columns) {
	let html = '<tr>'
	columns.forEach(key => {
		html += '<th>' + key + '</th>'
	})

	return html
}

function getPage (data, tableHeader, counter) {
	const sourceTable = fs.readFileSync('./server-simulator/API/notice-board/table-template.html', 'utf-8')
	let table = _.template(sourceTable)

	let html = ''
	data.forEach((row) => {
		html += '<tr>'
		Object.keys(row).forEach((key) => {
			html += '<td>' + row[key] + '</td>'
		})
		html += '</tr>'
	})

	return table({ body: html, head: tableHeader })
}

// 15-AUG-2007 01:27
function getHeader (counter, date) {
	const number = counter === 1 ? 'first' : counter
	const page = counter < 10 ? `00${counter}` : counter < 100 ? `0${counter}` : counter

	return `<div id="pageHeader-${number}" class="row">
		        <div class="col-md-4">
			        AUD901c SBC
		        </div>
		        <div class="col-md-4 center">
		         Audit Report for Parameter Changes
		        </div>
		        <div class="col-md-4 right">
			        Date ${date}   Page ${page}
		        </div>
	        </div>`
}

function getFooter () {
	return `<div id="pageFooter-last" class="row">
		<div class="col-md-12 center">
			*** AUD901c SBC: End of Report ***
		</div>
	</div>`
}

export default helper

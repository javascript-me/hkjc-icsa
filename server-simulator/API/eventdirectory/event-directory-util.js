// const util = require('util')
import _ from 'lodash'

function footballAllKeyWord (football) {
	let events = football
	let outObj = {}
	let results = []

	events.forEach((item) => {
		outObj[item.level1Info.name] = true
	})

	// events.forEach((item) => {
	// 	outObj[item.level2Info.name] = true
	// })

	events.forEach((item) => {
		outObj[item.t1] = true
		outObj[item.t2] = true
	})

	_.keys(outObj).forEach((key) => {
		results.push(key)
	})

	return results
}

function footballFilter (football, param) {
	function toRecord (item, keyword) {
		const record = {}
		record.status = item.status
		record.t1 = item.t1
		record.t1Tip = item.t1Tip
		record.t2 = item.t2
		record.t2Tip = item.t2Tip
		record.active = 0
		if (match === 'L3') {
			if (item.t1.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
				record.active = 1
			} else {
				record.active = 2
			}
		}
		return record
	}

	let keyword = param.keyword
	let eventType = (!param.eventType || param.eventType === 'All') ? '' : param.eventType.split(',')
	let competition = (!param.competition || param.competition === 'All') ? '' : param.competition.split(',')
	// let tiemFrom = param.from
	// let timeTo = param.to

	let events = football
	let results = []
	let match = 'None'

	// filter by keyword for level1
	if (match === 'None' && keyword) {
		results = events.filter((item) => {
			return item.level1Info.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1
		})
		if (results.length > 0) {
			match = 'L1'
		}
	}
	// console.log(util.inspect(results, { showHidden: true, depth: 3 }))

	// filter by keyword for level2
	if (match === 'None' && keyword) {
		results = events.filter((item) => {
			return item.level2Info.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1
		})

		if (results.length > 0) {
			match = 'L2'
		}
	}
	// console.log(util.inspect(results, { showHidden: true, depth: 3 }))

	// filter by keyword for level3
	if (match === 'None' && keyword) {
		results = events.filter((item) => {
			return item.t1.toLowerCase().indexOf(keyword.toLowerCase()) > -1 || item.t2.toLowerCase().indexOf(keyword.toLowerCase()) > -1
		})

		if (results.length > 0) {
			match = 'L3'
		}
	}
	// console.log(util.inspect(results, { showHidden: true, depth: 3 }))

	if (match === 'None' && !keyword) {
		results = events
	}

	// filter by status
	if (eventType) {
		results = results.filter((item) => {
			return _.indexOf(eventType, item.status) > -1
		})

		if (match === 'None' && results.length > 0) {
			match = 'L3'
		}
	}
	// console.log(util.inspect(results, { showHidden: true, depth: 3 }))

	// filter by competition
	if (competition) {
		results = results.filter((item) => {
			return _.indexOf(competition, item.level2Info.name) > -1
		})

		if (match === 'None' && results.length > 0) {
			match = 'L2'
		}
	}

	// filter by time from
	// come soon

	// filter by time to
	// come soon

	// genarate result object
	let outObj = {}
	results.forEach((item) => {
		if (undefined === outObj[item.level1Info.name]) {
			outObj[item.level1Info.name] = {}
		}
		const temp = outObj[item.level1Info.name]
		if (undefined === temp[item.level2Info.name]) {
			temp[item.level2Info.name] = []
		}
		temp[item.level2Info.name].push(toRecord(item, keyword))
	})
	// console.log(util.inspect(outObj, { showHidden: true, depth: 3 }))

	// convert to array
	let outArray = []
	let l1Obj = outObj
	_.keys(l1Obj).forEach((l1Name) => {
		let l2Obj = l1Obj[l1Name]
		let l1Children = []

		_.keys(l2Obj).forEach((l2Name) => {
			let l2Children = l2Obj[l2Name]
			l1Children.push({
				name: l2Name,
				records: l2Children
			})
		})

		outArray.push({
			name: l1Name,
			children: l1Children
		})
	})

	// console.log(util.inspect(outArray, { showHidden: true, depth: 5 }))

	return {
		match,
		data: outArray
	}
}

export default {
	footballAllKeyWord,
	footballFilter
}

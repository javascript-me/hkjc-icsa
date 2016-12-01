import _ from 'lodash'

const pageSize = 10

function getAuditlogsByPageNumber (auditlogs, selectedPageNumber) {
	var startIndex = (selectedPageNumber - 1) * pageSize

	var result = []

	var endIndex = 0

	if ((startIndex + pageSize) < auditlogs.length) {
		endIndex = startIndex + pageSize
	} else {
		endIndex = auditlogs.length
	}

	for (var i = startIndex; i < endIndex; i++) {
		result.push(auditlogs[i])
	}

	return result
}

function getTotalPages (length) {
	var divideResult = Math.floor(length / pageSize)

	if ((length % pageSize) > 0) {
		divideResult++
	}

	return divideResult
}

function ascendSort (key) {
	return function (a, b) {
		if (a[key] > b[key]) return 1
		if (a[key] < b[key]) return -1
		return 0
	}
}

function descendSort (key) {
	return function (a, b) {
		if (a[key] > b[key]) return -1
		if (a[key] < b[key]) return 1
		return 0
	}
}

// function parseToMonthIndex (monthName) {
// 	if (monthName === 'January' || monthName === 'Jan') return 0
// 	if (monthName === 'February' || monthName === 'Feb') return 1
// 	if (monthName === 'March' || monthName === 'Mar') return 2
// 	if (monthName === 'April' || monthName === 'Apr') return 3
// 	if (monthName === 'May' || monthName === 'May') return 4
// 	if (monthName === 'June' || monthName === 'Jun') return 5
// 	if (monthName === 'July' || monthName === 'Jul') return 6
// 	if (monthName === 'August' || monthName === 'Aug') return 7
// 	if (monthName === 'September' || monthName === 'Sep') return 8
// 	if (monthName === 'October' || monthName === 'Oct') return 9
// 	if (monthName === 'November' || monthName === 'Nov') return 10
// 	if (monthName === 'December' || monthName === 'Dec') return 11
// 	return -1
// }

function parseToDate (value) {
	var parts = value.split('/')

	var date = parts[0]

	var monthName = parts[1]
	// var monthIndex = parseToMonthIndex(monthName)

	var year = parts[2]

	// var time = parts[3]
	// var items = time.split(':')

	// var hour = items[0]
	// var minute = items[1]

	// var second = items[2] ? items[2] : '00'

	return new Date(year, monthName, date)
}

function compareDate (value0, value1) {
	var time0 = parseToDate(value0).getTime()
	var time1 = parseToDate(value1).getTime()

	if (time0 > time1) return 1
	if (time0 < time1) return -1
	return 0
}

function ascendDateSort (a, b) {
	return compareDate(a['activationDate'], b['activationDate'])
}

function descendDateSort (a, b) {
	return compareDate(b['activationDate'], a['activationDate'])
}

function doSorting (auditlogs, fieldName, order) {
	var descendSortFunction
	var ascendSortFunction

	if (fieldName === 'date_time') {
		descendSortFunction = descendDateSort
		ascendSortFunction = ascendDateSort
	} else {
		descendSortFunction = descendSort(fieldName)
		ascendSortFunction = ascendSort(fieldName)
	}

	if (order === 'DESCEND') auditlogs.sort(descendSortFunction)
	if (order === 'ASCEND') auditlogs.sort(ascendSortFunction)

	return auditlogs
}

function doFilter (userprofiles, keyWord, position, userRole, status, dateTimeFrom, dateTimeTo) {
	keyWord = keyWord || ''
	position = position || 'All'
	userRole = userRole || 'All'
	status = status || 'All'
	dateTimeFrom = dateTimeFrom || '18/09/1900'
	dateTimeTo = dateTimeTo || '31/12/2099'

	let result = userprofiles

	// console.log(result)
	// result.forEach((item) => {
	// 	console.log(item.assignedUserRoles)
	// })

	// console.log('--begin doFilter:')
	// console.log('keyWord'+keyWord)
	// console.log('position'+position)
	// console.log('userRole'+userRole)
	// console.log('status'+status)
	// console.log('dateTimeFrom'+dateTimeFrom)
	// console.log('dateTimeTo'+dateTimeTo)

	result = keyWord ? result.filter((al) => {
		const userID = al.userID ? al.userID.toLowerCase() : ''
		const userName = al.displayName ? al.displayName.toLowerCase() : ''
		let found = userID.indexOf(keyWord.toLowerCase()) > -1 ||
						userName.indexOf(keyWord.toLowerCase()) > -1
		return found
	}) : result

	// console.log(result)

	if (position !== 'All') {
		result = result.filter((al) => {
			return (al.position.toLowerCase().indexOf(position.toLowerCase()) > -1)
		})
	}

	// console.log(result)

	if (userRole !== 'All') {
		result = result.filter((item) => {
			let found = _.find(item.assignedUserRoles, (role) => {
				return role.assignedUserRole.toLowerCase().indexOf(userRole.toLowerCase()) > -1
			})
			return (found !== undefined)
		})
	}

	// console.log(result)

	if (status !== 'All') {
		result = result.filter((al) => {
			return (al.status.toLowerCase().indexOf(status.toLowerCase()) > -1)
		})
	}

	// console.log(result)

	result = result.filter((al) => {
		return parseToDate(dateTimeFrom).getTime() <= parseToDate(al.activationDate).getTime() &&
			parseToDate(al.deactivationDate).getTime() <= parseToDate(dateTimeTo).getTime()
	})

	// console.log(result)

	return result
}

export default {
	getAuditlogsFragmentByPageNumber: getAuditlogsByPageNumber,
	getTotalPages: getTotalPages,
	doSorting: doSorting,
	doFilter: doFilter,
	compareDate: compareDate,
	parseToDate: parseToDate
}

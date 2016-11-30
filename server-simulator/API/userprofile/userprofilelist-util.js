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

function parseToMonthIndex (monthName) {
	if (monthName === 'January' || monthName === 'Jan') return 0
	if (monthName === 'February' || monthName === 'Feb') return 1
	if (monthName === 'March' || monthName === 'Mar') return 2
	if (monthName === 'April' || monthName === 'Apr') return 3
	if (monthName === 'May' || monthName === 'May') return 4
	if (monthName === 'June' || monthName === 'Jun') return 5
	if (monthName === 'July' || monthName === 'Jul') return 6
	if (monthName === 'August' || monthName === 'Aug') return 7
	if (monthName === 'September' || monthName === 'Sep') return 8
	if (monthName === 'October' || monthName === 'Oct') return 9
	if (monthName === 'November' || monthName === 'Nov') return 10
	if (monthName === 'December' || monthName === 'Dec') return 11
	return -1
}

function parseToDate (value) {
	var parts = value.split(' ')

	var date = parts[0]

	var monthName = parts[1]
	var monthIndex = parseToMonthIndex(monthName)

	var year = parts[2]

	var time = parts[3]
	var items = time.split(':')

	var hour = items[0]
	var minute = items[1]

	var second = items[2] ? items[2] : '00'

	return new Date(year, monthIndex, date, hour, minute, second)
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
	dateTimeFrom = dateTimeFrom || '18 Sep 1900 00:00'
	dateTimeTo = dateTimeTo || '31 Dec 2099 23:59'

	let result = userprofiles

	result = keyWord ? userprofiles.filter((al) => {
		const eventName = al.event_name ? al.event_name.toLowerCase() : ''
		const userName = al.user_name ? al.user_name.toLowerCase() : ''
		const userRole = al.user_role ? al.user_role.toLowerCase() : ''

		return position === keyWord.toLowerCase() ||
                userName === keyWord.toLowerCase()

	}) : result

	if (position !== 'All') {
		result = result.filter((al) => {
			return (al.position === position)
		})
	}

	if (userRole !== 'All') {
		result = result.filter((al) => {
			return (al.userRole === userRole)
		})
	}

	if (status !== 'All') {
		result = result.filter((al) => {
			return (al.status === status)
		})
	}

	// result = result.filter((al) => {
	// 	return parseToDate(dateTimeFrom).getTime() <= parseToDate(al.date_time).getTime() &&
	// 		parseToDate(al.date_time).getTime() <= parseToDate(dateTimeTo).getTime()
	// })

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

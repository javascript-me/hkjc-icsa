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

// TODO: refactor to use Moment library.
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
	return compareDate(a['system_distribution_time'], b['system_distribution_time'])
}

function descendDateSort (a, b) {
	return compareDate(b['system_distribution_time'], a['system_distribution_time'])
}
function doSorting (notices, fieldName, order) {
	var descendSortFunction
	var ascendSortFunction

	if (fieldName === 'system_distribution_time') {
		descendSortFunction = descendDateSort
		ascendSortFunction = ascendDateSort
	} else {
		descendSortFunction = descendSort(fieldName)
		ascendSortFunction = ascendSort(fieldName)
	}

	if (order === 'DESCEND') notices.sort(descendSortFunction)
	if (order === 'ASCEND') notices.sort(ascendSortFunction)

	return notices
}

function doFilter (notices, keyWord, priority, sportsType, competition, match, inPlay, continent, country, messageCategory, alertStatus, dateTimeFrom, dateTimeTo, recipientValue) {
	keyWord = keyWord || ''
	priority = priority || 'All'
	sportsType = sportsType || 'All'
	competition = competition || 'All'
	match = match || 'All'
	inPlay = inPlay || 'All'
	dateTimeFrom = dateTimeFrom || '18 Sep 1900 00:00'
	dateTimeTo = dateTimeTo || '31 Dec 2099 23:59'
	continent = continent || 'All'
	country = country || 'All'
	messageCategory = messageCategory || 'All'
	alertStatus = alertStatus || 'All'
	recipientValue = recipientValue || ''

	let result = notices

	result = recipientValue ? notices.filter((al) => {
		const recipient = al.recipient ? al.recipient.toLowerCase() : ''
		return recipient === recipientValue.toLowerCase()
	}) : result

	result = keyWord ? notices.filter((al) => {
		const priority = al.priority ? al.priority.toLowerCase() : ''
		const sportsType = al.sports_type ? al.sports_type.toLowerCase() : ''
		const messageCategory = al.message_category ? al.message_category.toLowerCase() : ''
		const alertName = al.alert_name ? al.alert_name.toLowerCase() : ''
		const recipient = al.recipient ? al.recipient.toLowerCase() : ''
		return priority === keyWord.toLowerCase() ||
			sportsType === keyWord.toLowerCase() ||
			messageCategory === keyWord.toLowerCase() ||
			alertName === keyWord.toLowerCase() ||
			recipient === keyWord.toLowerCase()
	}) : result

	if (priority !== 'All') {
		result = result.filter((al) => {
			return (priority.indexOf(al.priority) >= 0)
		})
	}

	if (sportsType !== 'All') {
		result = result.filter((al) => {
			return (sportsType.indexOf(al.sports_type) >= 0)
		})
	}

	if (competition !== 'All') {
		result = result.filter((al) => {
			return (competition.indexOf(al.event_level1) >= 0)
		})
	}

	if (match !== 'All') {
		result = result.filter((al) => {
			return (match.indexOf(al.event_level2) >= 0)
		})
	}

	if (inPlay !== 'All') {
		result = result.filter((al) => {
			return (inPlay.indexOf(al.inplay) >= 0)
		})
	}
	if (continent !== 'All') {
		result = result.filter((al) => {
			return (continent.indexOf(al.continent) >= 0)
		})
	}
	if (country !== 'All') {
		result = result.filter((al) => {
			return (country.indexOf(al.country) >= 0)
		})
	}
	if (messageCategory !== 'All') {
		result = result.filter((al) => {
			return (messageCategory.indexOf(al.message_category) >= 0)
		})
	}
	if (alertStatus !== 'All') {
		result = result.filter((al) => {
			return (alertStatus.indexOf(al.alert_status) >= 0)
		})
	}

	result = result.filter((al) => {
		return parseToDate(dateTimeFrom).getTime() <= parseToDate(al.system_distribution_time).getTime() &&
			parseToDate(al.system_distribution_time).getTime() <= parseToDate(dateTimeTo).getTime()
	})

	return result
}

function updateAcknowledgeStatusById (json, id, command) {
	json.forEach((element) => {
		if (element.id === id) {
			if (command === 'Unacknowledge') {
				element.alert_status = 'New'
			}
			if (command === 'Acknowledge') {
				element.alert_status = 'Acknowledged'
			}
		}
	})
}

export default {
	doSorting: doSorting,
	doFilter: doFilter,
	updateAcknowledgeStatusById: updateAcknowledgeStatusById
}

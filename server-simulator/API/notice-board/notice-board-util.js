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

function doFilter (notices, keyWord, priority, sportsType, competition, match, inPlay, continent, country, messageCategory, alertStatus, dateTimeFrom, dateTimeTo) {
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

	let result = notices

	result = keyWord ? notices.filter((al) => {
		const priority = al.priority ? al.priority.toLowerCase() : ''
		const sportsType = al.sports_type ? al.sports_type.toLowerCase() : ''
		const messageCategory = al.message_category ? al.message_category.toLowerCase() : ''

		return priority === keyWord.toLowerCase() ||
			sportsType === keyWord.toLowerCase() ||
			messageCategory === keyWord.toLowerCase()
	}) : result

	if (priority !== 'All') {
		result = result.filter((al) => {
			return (al.priority === priority)
		})
	}

	if (sportsType !== 'All') {
		result = result.filter((al) => {
			return (al.sports_type === sportsType)
		})
	}

	if (competition !== 'All') {
		result = result.filter((al) => {
			return (al.competition === competition)
		})
	}

	if (match !== 'All') {
		result = result.filter((al) => {
			return (al.match === match)
		})
	}

	if (inPlay !== 'All') {
		result = result.filter((al) => {
			return (al.inplay === inPlay)
		})
	}
	if (continent !== 'All') {
		result = result.filter((al) => {
			return (al.continent === continent)
		})
	}
	if (country !== 'All') {
		result = result.filter((al) => {
			return (al.country === country)
		})
	}
	if (messageCategory !== 'All') {
		result = result.filter((al) => {
			return (al.message_category === messageCategory)
		})
	}
	if (alertStatus !== 'All') {
		result = result.filter((al) => {
			return (al.alert_status === alertStatus)
		})
	}

	result = result.filter((al) => {
		return parseToDate(dateTimeFrom).getTime() <= parseToDate(al.system_distribution_time).getTime() &&
			parseToDate(al.system_distribution_time).getTime() <= parseToDate(dateTimeTo).getTime()
	})

	return result
}

export default {
	doSorting: doSorting,
	doFilter: doFilter
}

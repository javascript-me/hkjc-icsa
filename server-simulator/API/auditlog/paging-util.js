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

function parseToMonthIndex(monthName) {
    if (monthName == "January") return 0
    if (monthName == "February") return 1
    if (monthName == "March") return 2
    if (monthName == "April") return 3
    if (monthName == "May") return 4
    if (monthName == "June") return 5
    if (monthName == "July") return 6
    if (monthName == "August") return 7
    if (monthName == "September") return 8
    if (monthName == "October") return 9
    if (monthName == "November") return 10
    if (monthName == "December") return 11
    return -1
}

function parseToDate(value) {
    var parts = value.split(" ")

    var date = parts[0]

    var monthName = parts[1]
    var monthIndex = parseToMonthIndex(monthName)

    var year = parts[2]

    var time = parts[3]
    var items = time.split(":")

    var hour = items[0]
    var minute = items[1]
    var second = items[2]

    return new Date(year, monthIndex, date, hour, minute, second)
}

function compareDate(value0, value1) {
    var time0 = parseToDate(value0).getTime()
    var time1 = parseToDate(value1).getTime()

    if (time0 > time1) return 1
    if (time0 < time1) return -1
    return 0
}

function ascendDateSort(a, b) {
    return compareDate(a["date_time"], b["date_time"])
}

function descendDateSort(a, b) {
    return compareDate(b["date_time"], a["date_time"])
}

function doSorting(auditlogs, fieldName, order) {

    var descendSortFunction;
    var ascendSortFunction;

    if (fieldName == "date_time") {
        descendSortFunction = descendDateSort
        ascendSortFunction = ascendDateSort
    } else {
        descendSortFunction = descendSort(fieldName)
        ascendSortFunction = ascendSort(fieldName)
    }

    if (order == "DESCEND") auditlogs.sort(descendSortFunction)
    if (order == "ASCEND") auditlogs.sort(ascendSortFunction)

    return auditlogs
}

function doFilter(auditlogs, key_word, typeValue, userRole, systemFunc, betTypeFeature, device) {

    typeValue = (typeValue == undefined || typeValue == "") ? "All" : typeValue
    userRole = (userRole == undefined || userRole == "") ? "All" : userRole
    systemFunc = (systemFunc == undefined || systemFunc == "") ? "All" : systemFunc
    betTypeFeature = (betTypeFeature == undefined || betTypeFeature == "") ? "All" : betTypeFeature
    device = (device == undefined || device == "") ? "All" : device

    var result = auditlogs

    if (key_word === "World Cup" || key_word === "EPC" || key_word === "VCL" || key_word === "SFL" || key_word === "PFL" || key_word === "EPI") {
        result = auditlogs.filter(function (al) {
            return (al.event_name === key_word  )
        });
    }

    if (key_word === "Candy Date" || key_word === "Jagger Smith" || key_word === "Jerry Li" || key_word === "Karthik Blay") {
        result = auditlogs.filter(function (al) {
            return (al.user_name === key_word )
        });
    }

    if (key_word === "BOCC Supervisor" || key_word === "Trading Manager" || key_word === "Trading Support Analyst" || key_word === "Finance Controller"
        || key_word === "Content & Planning Manager"
        || key_word === "Customer Care Representative"
        || key_word === "Director of Group Treasury"
        || key_word === "System Administrator") {
        result = auditlogs.filter(function (al) {
            return (al.user_role === key_word )
        });
    }

    if (typeValue != "All") {
        result =  result.filter(function (al) {
            return (al.Type == typeValue)
        });
    }

    if (userRole != "All") {
        result =  result.filter(function (al) {
            return (al.user_role == userRole)
        });
    }

    if (systemFunc != "All") {
        result =  result.filter(function (al) {
            return (al.function_module == systemFunc)
        });
    }

    if (betTypeFeature != "All") {
        result =  result.filter(function (al) {
            return (al.bet_type == betTypeFeature)
        });
    }

    if (device != "All") {
        result =  result.filter(function (al) {
            return (al.device == device )
        });
    }

    return result;
}

export default {
    getAuditlogsFragmentByPageNumber: getAuditlogsByPageNumber,
    getTotalPages: getTotalPages,
    doSorting: doSorting,
    doFilter: doFilter,
    compareDate: compareDate,
    parseToDate: parseToDate
}

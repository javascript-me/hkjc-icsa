const pageSize = 10

function getAuditlogsByPageNumber (auditlogs, selectedPageNumber) {

    var startIndex = (selectedPageNumber - 1) * pageSize

    var result = []

    var endIndex = 0

    if ((startIndex + pageSize) < auditlogs.length) {
        endIndex = startIndex + pageSize
    }else {
        endIndex = auditlogs.length
    }

    for (var i = startIndex ; i < endIndex ; i++) {

        result.push(auditlogs[i])

    }

    return result

}

function getTotalPages(length) {

    var divideResult = Math.floor(length / pageSize)

    if ((length % pageSize) > 0) {
        divideResult++
    }

    return divideResult

}

function ascendSort(key) {
    return function(a,b){
        if (a[key] > b[key]) return 1;
        if (a[key] < b[key]) return -1;
        return 0;
    }
}

function descendSort(key) {
    return function(a,b){
        if (a[key] > b[key]) return -1;
        if (a[key] < b[key]) return 1;
        return 0;
    }
}

function doSorting(auditlogs, fieldName, order) {

    if (order == "DESCEND") auditlogs.sort(descendSort(fieldName))
    if (order == "ASCEND") auditlogs.sort(ascendSort(fieldName))

    return auditlogs
}

function doFilter(auditlogs, key_word) {

    // const key_word = req.body.key_word

    if (key_word == "") return auditlogs

    if (key_word === "World Cup" || key_word === "EPC" || key_word === "VCL" || key_word === "SFL" || key_word === "PFL" || key_word === "EPI") {
        return auditlogs.filter(function (al) {
            return (al.event_name === key_word  )
        });
    }

    if (key_word === "Candy Date" || key_word === "Jagger Smith" || key_word === "Jerry Li" || key_word === "Karthik Blay") {
        return auditlogs.filter(function (al) {
            return (al.user_name === key_word )
        });
    }

    if (key_word === "BOCC Supervisor" || key_word === "Trading Manager" || key_word === "Trading Support Analyst" || key_word === "Finance Controller"
        || key_word === "Content & Planning Manager"
        || key_word === "Customer Care Representative"
        || key_word === "Director of Group Treasury"
        || key_word === "System Administrator") {
        return auditlogs.filter(function (al) {
            return (al.user_role === key_word )
        });
    }

    return [];
}

export default {
    getAuditlogsFragmentByPageNumber: getAuditlogsByPageNumber,
    getTotalPages: getTotalPages,
    doSorting: doSorting,
    doFilter: doFilter
}

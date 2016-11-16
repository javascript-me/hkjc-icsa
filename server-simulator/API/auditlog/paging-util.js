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

export default {
    getAuditlogsFragmentByPageNumber: getAuditlogsByPageNumber,
    getTotalPages: getTotalPages,
    doSorting: doSorting
}

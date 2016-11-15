const pageSize = 10

function getAuditlogsByPageNumber (auditlogs, pagenumber) {

    var startIndex = (pagenumber - 1) * pageSize

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

export default {
    getAuditlogsByPageNumber: getAuditlogsByPageNumber,
    getTotalPages: getTotalPages
}

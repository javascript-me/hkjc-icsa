
import { assert } from 'chai'
import PagingUtil from './paging-util'

it('getAuditlogsByPageNumber() should return a small amount of data', function () {

    const data = require('../json/auditlogs.json')
    assert.equal(99, data.auditlogs.length)

    var result = PagingUtil.getAuditlogsByPageNumber(data.auditlogs, 1)

    assert.equal(10, result.length)
    assert.equal(JSON.stringify(result[0]), JSON.stringify(data.auditlogs[0]))
    assert.equal(JSON.stringify(result[9]), JSON.stringify(data.auditlogs[9]))


    var resultOfPage5 = PagingUtil.getAuditlogsByPageNumber(data.auditlogs, 5)
    assert.equal(10, resultOfPage5.length)

    var resultOfPage10 = PagingUtil.getAuditlogsByPageNumber(data.auditlogs, 10)

    assert.equal(9, resultOfPage10.length)
})

it("getTotalPages() should return total pages number based on pageSize", function () {
    assert.equal(10, PagingUtil.getTotalPages(99))
    assert.equal(1, PagingUtil.getTotalPages(9))
    assert.equal(3, PagingUtil.getTotalPages(30))
    assert.equal(4, PagingUtil.getTotalPages(35))
})
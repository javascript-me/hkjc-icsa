﻿
import { assert } from 'chai'
import PagingUtil from './paging-util'

it('getAuditlogsFragmentByPageNumber() should return a small amount of data', function () {

    const data = require('../json/auditlogs.json')
    assert.equal(99, data.auditlogs.length)

    var result = PagingUtil.getAuditlogsFragmentByPageNumber(data.auditlogs, 1)

    assert.equal(10, result.length)
    assert.equal(JSON.stringify(result[0]), JSON.stringify(data.auditlogs[0]))
    assert.equal(JSON.stringify(result[9]), JSON.stringify(data.auditlogs[9]))

    var resultOfPage5 = PagingUtil.getAuditlogsFragmentByPageNumber(data.auditlogs, 5)
    assert.equal(10, resultOfPage5.length)

    var resultOfPage10 = PagingUtil.getAuditlogsFragmentByPageNumber(data.auditlogs, 10)
    assert.equal(9, resultOfPage10.length)
})

it("getTotalPages() should return total pages number based on pageSize", function () {
    assert.equal(10, PagingUtil.getTotalPages(99))
    assert.equal(1, PagingUtil.getTotalPages(9))
    assert.equal(3, PagingUtil.getTotalPages(30))
    assert.equal(4, PagingUtil.getTotalPages(35))
})

it("doSorting() should return list with correct order", function () {

        var auditlogs = [
        {
            "date_time": "23 October 2016 10:30:30",
            "user_id": "Jerry.Li",
            "user_name": "Jerry Li",
            "Type": "Result",
            "function_module": "Master Risk Limit Log",
            "function_event_detail": "Update Result",
            "user_role": "System Administrator",
            "ip_address": "200.3.45.33",
            "backend_id": "FB0125",
            "frontend_id": "FB0012",
            "home": "Hongkong",
            "away": "China",
            "ko_time_game_start_game": "16/09/2016 10:00",
            "bet_type": "Bet Type",
            "event_name": "World Cup",
            "error_code": "018",
            "error_message_content": "No left fields",
            "device": "PC"
        },
        {
            "date_time": "23 October 2016 10:30:32",
            "user_id": "Jerry.Li",
            "user_name": "Jerry Li",
            "Type": "Result",
            "function_module": "Master Risk Limit Log",
            "function_event_detail": "Update Result",
            "user_role": "System Administrator",
            "ip_address": "200.3.45.33",
            "backend_id": "FB0125",
            "frontend_id": "FB0012",
            "home": "Hongkong",
            "away": "China",
            "ko_time_game_start_game": "16/09/2016 10:00",
            "bet_type": "Bet Type",
            "event_name": "World Cup",
            "error_code": "018",
            "error_message_content": "No left fields",
            "device": "PC"
        },
        {
            "date_time": "23 October 2016 10:30:31",
            "user_id": "Jerry.Li",
            "user_name": "Jerry Li",
            "Type": "Result",
            "function_module": "Master Risk Limit Log",
            "function_event_detail": "Update Result",
            "user_role": "System Administrator",
            "ip_address": "200.3.45.33",
            "backend_id": "FB0125",
            "frontend_id": "FB0012",
            "home": "Hongkong",
            "away": "China",
            "ko_time_game_start_game": "16/09/2016 10:00",
            "bet_type": "Bet Type",
            "event_name": "World Cup",
            "error_code": "018",
            "error_message_content": "No left fields",
            "device": "PC"
        }
        ]

    var descendResult = PagingUtil.doSorting(auditlogs.slice(0), "date_time", "DESCEND")

    assert.equal("23 October 2016 10:30:32", descendResult[0]["date_time"])
    assert.equal("23 October 2016 10:30:31", descendResult[1]["date_time"])
    assert.equal("23 October 2016 10:30:30", descendResult[2]["date_time"])

    assert.equal("23 October 2016 10:30:30", auditlogs[0]["date_time"])
    assert.equal("23 October 2016 10:30:32", auditlogs[1]["date_time"])
    assert.equal("23 October 2016 10:30:31", auditlogs[2]["date_time"])

    var ascendResult = PagingUtil.doSorting(auditlogs.slice(0), "date_time", "ASCEND")

    assert.equal("23 October 2016 10:30:30", ascendResult[0]["date_time"])
    assert.equal("23 October 2016 10:30:31", ascendResult[1]["date_time"])
    assert.equal("23 October 2016 10:30:32", ascendResult[2]["date_time"])

    var noOrderResult = PagingUtil.doSorting(auditlogs.slice(0), "date_time", "NO_ORDER")

    assert.equal("23 October 2016 10:30:30", noOrderResult[0]["date_time"])
    assert.equal("23 October 2016 10:30:32", noOrderResult[1]["date_time"])
    assert.equal("23 October 2016 10:30:31", noOrderResult[2]["date_time"])
})

it("Simple test", function () {
    assert.ok("b" > "a")
    assert.ok("23 October 2016 10:30:32" > "23 October 2016 10:30:30")

})

it("doFilter() should return less data", function () {

    const jsonObject = require('../json/auditlogs.json')

    assert.equal(99, jsonObject.auditlogs.length)

    assert.equal(54, PagingUtil.doFilter(jsonObject.auditlogs, "World Cup").length)
    assert.equal(11, PagingUtil.doFilter(jsonObject.auditlogs, "EPC").length)

    assert.equal(99, PagingUtil.doFilter(jsonObject.auditlogs, "").length)
})
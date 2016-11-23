
import { assert } from 'chai'
import PagingUtil from './paging-util'

it('getAuditlogsFragmentByPageNumber() should return a small amount of data', () => {
	const data = require('../json/auditlogs.json')
	assert.equal(451, data.auditlogs.length)

	var result = PagingUtil.getAuditlogsFragmentByPageNumber(data.auditlogs, 1)

	assert.equal(10, result.length)
	assert.equal(JSON.stringify(result[0]), JSON.stringify(data.auditlogs[0]))
	assert.equal(JSON.stringify(result[9]), JSON.stringify(data.auditlogs[9]))

	var resultOfPage5 = PagingUtil.getAuditlogsFragmentByPageNumber(data.auditlogs, 5)
	assert.equal(10, resultOfPage5.length)

	var resultOfPage10 = PagingUtil.getAuditlogsFragmentByPageNumber(data.auditlogs, 10)
	assert.equal(10, resultOfPage10.length)
})

it('getTotalPages() should return total pages number based on pageSize', () => {
	assert.equal(10, PagingUtil.getTotalPages(99))
	assert.equal(1, PagingUtil.getTotalPages(9))
	assert.equal(3, PagingUtil.getTotalPages(30))
	assert.equal(4, PagingUtil.getTotalPages(35))
})

it('doSorting() should return list with correct order', () => {
	var auditlogs = [
		{
			'date_time': '23 October 2016 10:30:30',
			'user_id': 'Jerry.Li',
			'user_name': 'Jerry Li',
			'Type': 'Result',
			'function_module': 'Master Risk Limit Log',
			'function_event_detail': 'Update Result',
			'user_role': 'System Administrator',
			'ip_address': '200.3.45.33',
			'backend_id': 'FB0125',
			'frontend_id': 'FB0012',
			'home': 'Hongkong',
			'away': 'China',
			'ko_time_game_start_game': '16/09/2016 10:00',
			'bet_type': 'Bet Type',
			'event_name': 'World Cup',
			'error_code': '018',
			'error_message_content': 'No left fields',
			'device': 'PC'
		},
		{
			'date_time': '23 October 2016 10:30:32',
			'user_id': 'Jerry.Li',
			'user_name': 'Jerry Li',
			'Type': 'Result',
			'function_module': 'Master Risk Limit Log',
			'function_event_detail': 'Update Result',
			'user_role': 'System Administrator',
			'ip_address': '200.3.45.33',
			'backend_id': 'FB0125',
			'frontend_id': 'FB0012',
			'home': 'Hongkong',
			'away': 'China',
			'ko_time_game_start_game': '16/09/2016 10:00',
			'bet_type': 'Bet Type',
			'event_name': 'World Cup',
			'error_code': '018',
			'error_message_content': 'No left fields',
			'device': 'PC'
		},
		{
			'date_time': '23 October 2016 10:30:31',
			'user_id': 'Jerry.Li',
			'user_name': 'Jerry Li',
			'Type': 'Result',
			'function_module': 'Master Risk Limit Log',
			'function_event_detail': 'Update Result',
			'user_role': 'System Administrator',
			'ip_address': '200.3.45.33',
			'backend_id': 'FB0125',
			'frontend_id': 'FB0012',
			'home': 'Hongkong',
			'away': 'China',
			'ko_time_game_start_game': '16/09/2016 10:00',
			'bet_type': 'Bet Type',
			'event_name': 'World Cup',
			'error_code': '018',
			'error_message_content': 'No left fields',
			'device': 'PC'
		}
	]

	var descendResult = PagingUtil.doSorting(auditlogs.slice(0), 'date_time', 'DESCEND')

	assert.equal('23 October 2016 10:30:32', descendResult[0]['date_time'])
	assert.equal('23 October 2016 10:30:31', descendResult[1]['date_time'])
	assert.equal('23 October 2016 10:30:30', descendResult[2]['date_time'])

	assert.equal('23 October 2016 10:30:30', auditlogs[0]['date_time'])
	assert.equal('23 October 2016 10:30:32', auditlogs[1]['date_time'])
	assert.equal('23 October 2016 10:30:31', auditlogs[2]['date_time'])

	var ascendResult = PagingUtil.doSorting(auditlogs.slice(0), 'date_time', 'ASCEND')

	assert.equal('23 October 2016 10:30:30', ascendResult[0]['date_time'])
	assert.equal('23 October 2016 10:30:31', ascendResult[1]['date_time'])
	assert.equal('23 October 2016 10:30:32', ascendResult[2]['date_time'])

	var noOrderResult = PagingUtil.doSorting(auditlogs.slice(0), 'date_time', 'NO_ORDER')

	assert.equal('23 October 2016 10:30:30', noOrderResult[0]['date_time'])
	assert.equal('23 October 2016 10:30:32', noOrderResult[1]['date_time'])
	assert.equal('23 October 2016 10:30:31', noOrderResult[2]['date_time'])
})

it('compareDate() to date_time should return correct order', () => {
	assert.equal(0, PagingUtil.compareDate('23 October 2016 10:30:30', '23 October 2016 10:30:30'))
	assert.equal(1, PagingUtil.compareDate('23 October 2016 10:30:31', '23 October 2016 10:30:30'))
	assert.equal(-1, PagingUtil.compareDate('23 October 2016 10:30:30', '23 October 2016 10:30:31'))
})

it('parseToDate() should return a date based on input string', () => {
	var date0 = PagingUtil.parseToDate('23 October 2016 10:30:32')
	assert.equal('2016-10-23 10:30:32', date0.toLocaleString())
	assert.equal(1477189832000, date0.getTime())

	var date1 = PagingUtil.parseToDate('23 October 2016 10:30:33')
	assert.equal('2016-10-23 10:30:33', date1.toLocaleString())
	assert.equal(1477189833000, date1.getTime())

	var date2 = PagingUtil.parseToDate('23 Oct 2016 10:30:33')
	assert.equal('2016-10-23 10:30:33', date2.toLocaleString())
	assert.equal(1477189833000, date2.getTime())

	var date3 = PagingUtil.parseToDate('23 Oct 2016 10:30')
	assert.equal('2016-10-23 10:30:00', date3.toLocaleString())
	assert.equal(1477189833000, date2.getTime())

	var date4 = PagingUtil.parseToDate('23 Oct 2016 00:00:00')
	assert.equal('2016-10-23 00:00:00', date4.toLocaleString())
	assert.equal(1477152000000, date4.getTime())
})

it('Simple test', () => {
	assert.ok('b' > 'a')
	assert.ok('23 October 2016 10:30:32' > '23 October 2016 10:30:30')
})

it('doFilter() should return less data', () => {
	const jsonObject = require('../json/auditlogs.json')

	assert.equal(451, jsonObject.auditlogs.length)

	assert.equal(296, PagingUtil.doFilter(jsonObject.auditlogs, 'World Cup').length)
	assert.equal(34, PagingUtil.doFilter(jsonObject.auditlogs, 'EPC').length)

	assert.equal(296, PagingUtil.doFilter(jsonObject.auditlogs, 'World Cup').length)
	assert.equal(34, PagingUtil.doFilter(jsonObject.auditlogs, 'EPC').length)

	assert.equal(451, PagingUtil.doFilter(jsonObject.auditlogs, '').length)

	assert.equal(177, PagingUtil.doFilter(jsonObject.auditlogs, '', null, null, null, null, null,
		'18 September 2016 14:30:10', '23 October 2016 10:30:30').length)
})


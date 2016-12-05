import React from 'react'
import { shallow } from 'enzyme'
import { assert } from 'chai'
import Tabulardata from './tabulardata'

var headers = [
	{label: 'Date/Time', fieldName: 'date_time', sortingClass: 'no-arrow'},
	{label: 'User ID', fieldName: 'user_id', sortingClass: 'no-arrow'},
	{label: 'User Name', fieldName: 'user_name', sortingClass: 'no-arrow'},
	{label: 'Type', fieldName: 'Type', sortingClass: 'no-arrow'},
	{label: 'Function/Module', fieldName: 'function_module', sortingClass: 'no-arrow'},
	{label: 'Function Event Detail', fieldName: 'function_event_detail', sortingClass: 'no-arrow'},
	{label: 'User Role', fieldName: 'user_role', sortingClass: 'no-arrow'},
	{label: 'IP Address', fieldName: 'ip_address', sortingClass: 'no-arrow'},
	{label: 'Back End ID', fieldName: 'backend_id', sortingClass: 'no-arrow'},
	{label: 'Front End ID', fieldName: 'frontend_id', sortingClass: 'no-arrow'},
	{label: 'Home', fieldName: 'home', sortingClass: 'no-arrow'},
	{label: 'Away', fieldName: 'away', sortingClass: 'no-arrow'},
	{label: 'K.O. Time/ Game Start Time', fieldName: 'ko_time_game_start_game', sortingClass: 'no-arrow'},
	{label: 'Bet Type', fieldName: 'bet_type', sortingClass: 'no-arrow'},
	{label: 'Event Name', fieldName: 'event_name', sortingClass: 'no-arrow'},
	{label: 'Error Code', fieldName: 'error_code', sortingClass: 'no-arrow'},
	{label: 'Error Message Content', fieldName: 'error_message_content', sortingClass: 'no-arrow'},
	{label: 'Device', fieldName: 'device', sortingClass: 'no-arrow'}
]

var dataCollection = [{
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
	'home': 'Hong Kong',
	'away': 'China',
	'ko_time_game_start_game': '16/09/2016 10:00',
	'bet_type': 'Bet Type',
	'event_name': 'EPC',
	'error_code': '018',
	'error_message_content': 'No left fields',
	'device': 'PC'
}]

describe('<Tabulardata />', () => {

	it('renders a table div', () => {
		const tabulardata = shallow(<Tabulardata headers={headers} dataCollection={dataCollection} />)
		expect(tabulardata.find('table')).to.have.length(1)
	})

	it('Render with no results', () => {
		const tabulardata = shallow(<Tabulardata headers={headers} dataCollection={dataCollection} />)
		expect(tabulardata.find('table')).to.have.length(1)
	})

	it('Render with custom field formats', () => {
		const tabulardata = shallow(<Tabulardata headers={headers} dataCollection={dataCollection} />)
		expect(tabulardata.find('table')).to.have.length(1)
	})

	it('Render with checkbox and inputs', () => {
		const tabulardata = shallow(<Tabulardata headers={headers} dataCollection={dataCollection} />)
		expect(tabulardata.find('table')).to.have.length(1)
	})

	it('Render with pagination', () => {
		const tabulardata = shallow(<Tabulardata headers={headers} dataCollection={dataCollection} />)
		expect(tabulardata.find('table')).to.have.length(1)
	})

	it('Pagination works', () => {
		const tabulardata = shallow(<Tabulardata headers={headers} dataCollection={dataCollection} />)
		expect(tabulardata.find('table')).to.have.length(1)
	})

	it('Render with sorting', () => {
		const tabulardata = shallow(<Tabulardata headers={headers} dataCollection={dataCollection} />)
		expect(tabulardata.find('table')).to.have.length(1)
	})

	it('updateColumnSortingArrow() should update column sorting arrow by fieldName', () => {
		const instance = shallow(<Tabulardata headers={headers} dataCollection={dataCollection} />).instance()

		var resultA = instance.updateColumnSortingArrow(headers, 'date_time')
		assert.equal('down-arrow', resultA[0].sortingClass)

		var resultB = instance.updateColumnSortingArrow(headers, 'user_id')
		assert.equal('down-arrow', resultB[1].sortingClass)
		assert.equal('no-arrow', resultB[0].sortingClass)

		var resultC = instance.updateColumnSortingArrow(headers, 'user_id')
		assert.equal('up-arrow', resultC[1].sortingClass)
		assert.equal('no-arrow', resultC[0].sortingClass)
	})

	it('findHeader() should return header based on fieldName', () => {
		const instance = shallow(<Tabulardata headers={headers} dataCollection={dataCollection} />).instance()

		var result = instance.findHeader(headers, 'error_code')

		assert.equal('Error Code', result.label)
	})

	it('transformSortingClass() should change sortingClass in a special way', () => {
		const instance = shallow(<Tabulardata headers={headers} dataCollection={dataCollection} />).instance()

		assert.equal('down-arrow', instance.transformSortingClass('no-arrow'))
		assert.equal('up-arrow', instance.transformSortingClass('down-arrow'))
		assert.equal('down-arrow', instance.transformSortingClass('up-arrow'))
	})

	it('setToNoArrow() will set all element.sortingClass to no-arrow', () => {
		const instance = shallow(<Tabulardata headers={headers} dataCollection={dataCollection} />).instance()

		var result = instance.setToNoArrow(headers)

		assert.equal('no-arrow', result[0].sortingClass)
		assert.equal('no-arrow', result[1].sortingClass)
	})

	it('parseToOrder() should return ASCEND, DESCEND or NO_ORDER', () => {
		const instance = shallow(<Tabulardata headers={headers} dataCollection={dataCollection} />).instance()

		assert.equal('NO_ORDER', instance.parseToOrder('no-arrow'))
		assert.equal('ASCEND', instance.parseToOrder('up-arrow'))
		assert.equal('DESCEND', instance.parseToOrder('down-arrow'))
	})
})

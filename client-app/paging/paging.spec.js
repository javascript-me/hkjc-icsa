import React from 'react'
import {shallow} from 'enzyme'
import {assert} from 'chai'
import Paging from './paging'
import PagingService from '../../server-simulator/API/auditlog/paging-service'
import AuditlogStore from '../auditlog/auditlog-store'

describe('<Paging />', () => {
	it('onItemClick() should be call when user clicking page number', () => {
		let onButtonClick = sinon.spy()
		let wrapper = shallow(
			<Paging pageData={sampleData} onChangePage={onButtonClick} />
		)

		assert.equal('1', wrapper.instance().currentSelectedPageNumber)

		var itemToBeClicked = wrapper.find('.paging ul li.selected')

		assert.equal(0, onButtonClick.callCount)
		itemToBeClicked.simulate('click', {target: {innerText: '3'}})
		assert.equal(1, onButtonClick.callCount)
		assert.equal('3', wrapper.instance().currentSelectedPageNumber)

		itemToBeClicked.simulate('click', {target: {innerText: '1'}})
		assert.equal(2, onButtonClick.callCount)
		assert.equal('1', wrapper.instance().currentSelectedPageNumber)

		itemToBeClicked.simulate('click', {target: {innerText: '<'}})
		assert.equal(2, onButtonClick.callCount)
		assert.equal('1', wrapper.instance().currentSelectedPageNumber)

		var items = wrapper.find('.paging ul li')
		assert.equal(10, items.length)

		items.at(3).simulate('click', {target: {innerText: '3'}})
	})

	it('renders a paging div', () => {
		let paging = shallow(<Paging pageData={sampleData} />)
		expect(paging.find('div.paging')).to.have.length(1)
		expect(paging.find('ul')).to.have.length(1)

		var items = paging.find('li')
		assert.equal(10, items.length)
	})

	it('getUserSelectedPageNumber() should return correct selected page number', () => {
		let instance = shallow(<Paging pageData={AuditlogStore.pageData} />).instance()

		assert.equal(11, instance.getUserSelectedPageNumber(10, 11, PagingService.DEFAULT_TOTAL_PAGES))

		assert.equal(9, instance.getUserSelectedPageNumber(10, '<', PagingService.DEFAULT_TOTAL_PAGES))
		assert.equal(11, instance.getUserSelectedPageNumber(10, '>', PagingService.DEFAULT_TOTAL_PAGES))
		assert.equal(1, instance.getUserSelectedPageNumber(1, '<', PagingService.DEFAULT_TOTAL_PAGES))
		assert.equal(PagingService.DEFAULT_TOTAL_PAGES, instance.getUserSelectedPageNumber(PagingService.DEFAULT_TOTAL_PAGES, '>', PagingService.DEFAULT_TOTAL_PAGES))

		assert.equal(50, instance.getUserSelectedPageNumber(50, '...', PagingService.DEFAULT_TOTAL_PAGES))
	})

	it('isValid() should return false if you are click < when you are already in page 1', () => {
		let instance = shallow(<Paging pageData={AuditlogStore.pageData} />).instance()
		assert.isNotOk(instance.isValid(1, '<', 100))
		assert.isNotOk(instance.isValid(100, '>', 100))

		assert.ok(instance.isValid(99, '>', 100))
	})

	it('getClassName() should return correct css name string', () => {
		assert.equal('grey-out', new Paging().getClassName({
			'label': '<',
			'selected': false,
			'hasHandCursor': false,
			'greyOut': true
		}))

		assert.equal('selected has-hand-cursor', new Paging().getClassName({
			'label': 1,
			'selected': true,
			'hasHandCursor': true,
			'greyOut': false
		}))

		assert.equal('', new Paging().getClassName({}))
	})
})

let sampleData = {
	'pages': [
		{
			'label': '<',
			'selected': false,
			'hasHandCursor': false,
			'greyOut': true
		},
		{
			'label': 1,
			'selected': true,
			'hasHandCursor': true,
			'greyOut': false
		},
		{
			'label': 2,
			'selected': false,
			'hasHandCursor': true,
			'greyOut': false
		},
		{
			'label': 3,
			'selected': false,
			'hasHandCursor': true,
			'greyOut': false
		},
		{
			'label': 4,
			'selected': false,
			'hasHandCursor': true,
			'greyOut': false
		},
		{
			'label': 5,
			'selected': false,
			'hasHandCursor': true,
			'greyOut': false
		},
		{
			'label': 6,
			'selected': false,
			'hasHandCursor': true,
			'greyOut': false
		},
		{
			'label': '...',
			'selected': false,
			'hasHandCursor': false,
			'greyOut': false
		},
		{
			'label': 39,
			'selected': false,
			'hasHandCursor': true,
			'greyOut': false
		},
		{
			'label': '>',
			'selected': false,
			'hasHandCursor': true,
			'greyOut': false
		}
	],
	'totalPages': 39
}

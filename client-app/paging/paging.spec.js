import React from 'react'
import { shallow } from 'enzyme'
import { assert } from 'chai'
import Paging from './paging'
import PagingService from './paging-service'
import AuditlogStore from '../auditlog/auditlog-store';

describe('<Paging />', () => {
	it('renders a paging div', () => {
		AuditlogStore.getDataByPageNumber = function (selectedPageNumber) {}
		const paging = shallow(<Paging />)
		expect(paging.find('div.paging')).to.have.length(1)
		expect(paging.find('ul')).to.have.length(1)

		var items = paging.find('li')
		expect(items).to.have.length(0)
	})

	it('should return correct selected page number', () => {
		const instance = shallow(<Paging />).instance()

		assert.equal(11, instance.getUserSelectedPageNumber(10, 11, PagingService.totalPages))

		assert.equal(9, instance.getUserSelectedPageNumber(10, "<", PagingService.totalPages))
		assert.equal(11, instance.getUserSelectedPageNumber(10, ">", PagingService.totalPages))
		assert.equal(1, instance.getUserSelectedPageNumber(1, "<", PagingService.totalPages))
		assert.equal(PagingService.totalPages, instance.getUserSelectedPageNumber(PagingService.totalPages, ">", PagingService.totalPages))

		assert.equal(50, instance.getUserSelectedPageNumber(50, "...", PagingService.totalPages))
	})
})

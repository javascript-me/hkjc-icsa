import PagingService from './paging-service'
import { assert } from 'chai'
import _ from 'underscore'

describe('PagingService', () => {
	it('should return NaN when parsing a non-number symbol', () => {
		assert.ok(isNaN(Number('<')))
	})

	it('should return page 1 data', () => {
		var dataOfPage1 = PagingService.getDataByPageNumber(1)
		assert.isNotOk(_.isEmpty(PagingService.getDataByPageNumber(1).pages))
		assert.equal(10, dataOfPage1.pages.length)

		assert.equal(1, dataOfPage1.pages[1].label)
		assert.ok(dataOfPage1.pages[1].selected)

		assert.equal(2, dataOfPage1.pages[2].label)
		assert.isNotOk(dataOfPage1.pages[2].selected)

		var dataOfPageNaN = PagingService.getDataByPageNumber(NaN)
		assert.ok(_.isEmpty(dataOfPageNaN.pages))
		assert.equal(PagingService.totalPages, dataOfPageNaN.totalPages)
	}),

	it('should return data by small paging number', () => {
		var dataOfPage2 = PagingService.getDataByPageNumber(2)
		assert.ok(dataOfPage2.pages[2].selected)
		assert.isNotOk(dataOfPage2.pages[3].selected)

		assert.ok(PagingService.getDataByPageNumber(3).pages[3].selected)

		assert.equal(10, PagingService.getDataByPageNumber(200).pages.length)

		assert.equal(1, PagingService.getDataByPageNumber(-10).pages[1].label)
		assert.equal(PagingService.totalPages, PagingService.getDataByPageNumber(200).pages[8].label)
	}),

	it('should return page 6 data', () => {
		var dataOfPage6 = PagingService.getDataByPageNumber(6)
		assert.equal('...', dataOfPage6.pages[2].label)
		assert.equal(6, dataOfPage6.pages[5].label)
		assert.ok(dataOfPage6.pages[5].selected)

		assert.equal('...', dataOfPage6.pages[8].label)
		assert.equal(PagingService.totalPages, dataOfPage6.pages[9].label)
	})

	it('should return last page data', () => {
		var dataOfPage100 = PagingService.getDataByPageNumber(PagingService.totalPages)
		assert.equal("...", dataOfPage100.pages[2].label)
		assert.equal(PagingService.totalPages - 5, dataOfPage100.pages[3].label)
		assert.equal(PagingService.totalPages, dataOfPage100.pages[8].label)
		assert.ok(dataOfPage100.pages[8].selected)
	})

	it('createPageListByRange() should return elements by range', () => {
		var pages = []
		PagingService.createPageListByRange(pages, 20, {startIndex: 20 - 2, endIndex: 20 + 2})

		assert.equal(5, pages.length)

		assert.isNotOk(pages[0].selected)
		assert.isNotOk(pages[1].selected)
		assert.ok(pages[2].selected)
		assert.isNotOk(pages[3].selected)
		assert.isNotOk(pages[4].selected)

		assert.equal(18, pages[0].label)
		assert.equal(19, pages[1].label)
		assert.equal(20, pages[2].label)
		assert.equal(21, pages[3].label)
		assert.equal(22, pages[4].label)
	})

	it('fixInvalidSelectedPageNumber() should return a valid selectedPageNumber', () => {
		assert.equal(1, PagingService.fixInvalidSelectedPageNumber(-2))
		assert.equal(PagingService.totalPages, PagingService.fixInvalidSelectedPageNumber(200))
	})

	it('hasHandCursor should be correct', () => {
		assert.isNotOk(PagingService.getDataByPageNumber(1).pages[0].hasHandCursor)
		assert.ok(PagingService.getDataByPageNumber(2).pages[0].hasHandCursor)

		assert.isNotOk(PagingService.getDataByPageNumber(PagingService.totalPages).pages[9].hasHandCursor)
		assert.ok(PagingService.getDataByPageNumber(99).pages[9].hasHandCursor)
	})

	it("10 pages case should be working fine. ", () => {
		PagingService.totalPages = 10
		assert.ok(PagingService.getDataByPageNumber(1).pages[9].hasHandCursor)
	})
})

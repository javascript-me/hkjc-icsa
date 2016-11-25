import PagingService from './paging-service'
import { assert } from 'chai'
import _ from 'underscore'

describe('PagingService', () => {
	it('should return NaN when parsing a non-number symbol', () => {
		assert.ok(isNaN(Number('<')))
	})

	it('should return page 1 data', () => {
		var pagingService = new PagingService()

		var dataOfPage1 = pagingService.getDataByPageNumber(1)
		assert.isNotOk(_.isEmpty(pagingService.getDataByPageNumber(1).pages))
		assert.equal(10, dataOfPage1.pages.length)

		assert.equal(1, dataOfPage1.pages[1].label)
		assert.ok(dataOfPage1.pages[1].selected)

		assert.equal(2, dataOfPage1.pages[2].label)
		assert.isNotOk(dataOfPage1.pages[2].selected)

		var dataOfPageNaN = pagingService.getDataByPageNumber(NaN)
		assert.ok(_.isEmpty(dataOfPageNaN.pages))
		assert.equal(pagingService.totalPages, dataOfPageNaN.totalPages)
	})

	it('should return data by small paging number', () => {
		var pagingService = new PagingService()

		var dataOfPage2 = pagingService.getDataByPageNumber(2)
		assert.ok(dataOfPage2.pages[2].selected)
		assert.isNotOk(dataOfPage2.pages[3].selected)

		assert.ok(pagingService.getDataByPageNumber(3).pages[3].selected)

		assert.equal(10, pagingService.getDataByPageNumber(200).pages.length)

		assert.equal(1, pagingService.getDataByPageNumber(-10).pages[1].label)
		assert.equal(pagingService.totalPages, pagingService.getDataByPageNumber(200).pages[8].label)
	})

	it('should return page 6 data', () => {
		var pagingService = new PagingService()

		var dataOfPage6 = pagingService.getDataByPageNumber(6)
		assert.equal('...', dataOfPage6.pages[2].label)
		assert.equal(6, dataOfPage6.pages[5].label)
		assert.ok(dataOfPage6.pages[5].selected)

		assert.equal('...', dataOfPage6.pages[8].label)
		assert.equal(pagingService.totalPages, dataOfPage6.pages[9].label)
	})

	it('should return last page data', () => {
		var pagingService = new PagingService()

		var dataOfPage100 = pagingService.getDataByPageNumber(pagingService.totalPages)
		assert.equal('...', dataOfPage100.pages[2].label)
		assert.equal(pagingService.totalPages - 5, dataOfPage100.pages[3].label)
		assert.equal(pagingService.totalPages, dataOfPage100.pages[8].label)
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
		var pagingService = new PagingService()

		assert.equal(1, pagingService.fixInvalidSelectedPageNumber(-2))
		assert.equal(pagingService.totalPages, pagingService.fixInvalidSelectedPageNumber(200))
	})

	it('hasHandCursor should be correct', () => {
		var pagingService = new PagingService()

		assert.isNotOk(pagingService.getDataByPageNumber(1).pages[0].hasHandCursor)
		assert.ok(pagingService.getDataByPageNumber(2).pages[0].hasHandCursor)

		assert.isNotOk(pagingService.getDataByPageNumber(pagingService.totalPages).pages[9].hasHandCursor)
		assert.ok(pagingService.getDataByPageNumber(99).pages[9].hasHandCursor)
	})

	it('10 pages case should be working fine', () => {
		assert.ok(new PagingService(10).getDataByPageNumber(1).pages[9].hasHandCursor)
	})

	it('2 pages case should be working fine', () => {
		assert.equal(4, new PagingService(2).getDataByPageNumber(1).pages.length)
	})

	it('0 page case should return no number label paging ui', () => {
		var pages = new PagingService(0).getDataByPageNumber(1).pages
		assert.equal(0, pages.length)
	})

	it('Page 5 with totalPages 8 should be OK', () => {
		var pages = new PagingService(8).getDataByPageNumber(5).pages
		assert.equal(10, pages.length)
		assert.equal('8', pages[8].label)
		assert.equal('...', pages[7].label)
	})

	it('Page 6 with totalPages 8 should be OK', () => {
		var pages = new PagingService(8).getDataByPageNumber(6).pages
		assert.equal(10, pages.length)
		assert.equal('1', pages[1].label)
		assert.equal('...', pages[2].label)
	})

	it('Page 5 with totalPages 9 should be OK', () => {
		var pages = new PagingService(9).getDataByPageNumber(5).pages
		assert.equal(10, pages.length)
		assert.equal('9', pages[8].label)
		assert.equal('...', pages[7].label)
	})

	it('Page 6 with totalPages 9 should be OK', () => {
		var pages = new PagingService(9).getDataByPageNumber(6).pages
		assert.equal(10, pages.length)
		assert.equal('1', pages[1].label)
		assert.equal('...', pages[2].label)
	})
})

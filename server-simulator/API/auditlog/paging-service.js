export default class PagingService {

	static get DEFAULT_TOTAL_PAGES () {
		return 150
	}

	constructor (totalPages) {
		this.totalPages = totalPages === undefined ? PagingService.DEFAULT_TOTAL_PAGES : totalPages
	}

	static createPageListByRange (pages, selectedPageNumber, range) {
		for (var i = range.startIndex; i <= range.endIndex; i++) {
			var selected = selectedPageNumber === i
			pages.push({label: i, selected: selected, hasHandCursor: true, greyOut: false})
		}
	}

	static setLeftHandSideSymbol (selectedPageNumber, pages) {
		if (selectedPageNumber > 5) {
			pages.push({label: 1, selected: false, hasHandCursor: true, greyOut: false})
			pages.push({label: '...', selected: false, hasHandCursor: false, greyOut: false})
		}
	}

	setRightHandSideSymbol (selectedPageNumber, pages) {
		if (selectedPageNumber < this.totalPages - 4) {
			pages.push({label: '...', selected: false, hasHandCursor: false, greyOut: false})
			pages.push({label: this.totalPages, selected: false, hasHandCursor: true, greyOut: false})
		}
	}

	fixInvalidSelectedPageNumber (selectedPageNumber) {
		if (selectedPageNumber > this.totalPages) {
			selectedPageNumber = this.totalPages
		}

		if (selectedPageNumber < 1) {
			selectedPageNumber = 1
		}
		return selectedPageNumber
	}

	handleTotalPageIsEightOrNight (selectedPageNumber) {
		var pages = []

		pages.push({
			label: '<',
			selected: false,
			hasHandCursor: selectedPageNumber !== 1,
			greyOut: selectedPageNumber === 1
		})

		if (selectedPageNumber <= 5) {
			PagingService.createPageListByRange(
				pages,
				selectedPageNumber,
				{startIndex: 1, endIndex: 6}
			)

			pages.push({label: '...', selected: false, hasHandCursor: false, greyOut: false})
			pages.push({label: this.totalPages, selected: false, hasHandCursor: true, greyOut: false})
		} else {
			pages.push({label: 1, selected: false, hasHandCursor: true, greyOut: false})
			pages.push({label: '...', selected: false, hasHandCursor: false, greyOut: false})

			PagingService.createPageListByRange(
				pages,
				selectedPageNumber,
				{startIndex: this.totalPages - 5, endIndex: this.totalPages}
			)
		}

		pages.push({
			label: '>',
			selected: false,
			hasHandCursor: selectedPageNumber !== this.totalPages,
			greyOut: selectedPageNumber === this.totalPages
		})

		return pages
	}

	handleTotalPageIsTenOrMore (selectedPageNumber) {
		var pages = []

		pages.push({
			label: '<',
			selected: false,
			hasHandCursor: selectedPageNumber !== 1,
			greyOut: selectedPageNumber === 1
		})

		PagingService.setLeftHandSideSymbol(selectedPageNumber, pages)

		if (selectedPageNumber >= 1 && selectedPageNumber <= 5) {
			PagingService.createPageListByRange(
                pages,
                selectedPageNumber,
                {startIndex: 1, endIndex: 6}
            )
		}

		if (selectedPageNumber > 5 && selectedPageNumber < this.totalPages - 4) {
			PagingService.createPageListByRange(
                pages,
                selectedPageNumber,
                {startIndex: selectedPageNumber - 2, endIndex: selectedPageNumber + 2}
            )
		}

		if (this.totalPages - 4 <= selectedPageNumber && selectedPageNumber <= this.totalPages) {
			PagingService.createPageListByRange(
                pages,
                selectedPageNumber,
                {startIndex: this.totalPages - 5, endIndex: this.totalPages}
            )
		}

		this.setRightHandSideSymbol(selectedPageNumber, pages)
		pages.push({
			label: '>',
			selected: false,
			hasHandCursor: selectedPageNumber !== this.totalPages,
			greyOut: selectedPageNumber === this.totalPages
		})
		return pages
	}

	handleTotalPageIsLessThanEight (selectedPageNumber) {
		var pages = []

		pages.push({
			label: '<',
			selected: false,
			hasHandCursor: selectedPageNumber !== 1,
			greyOut: selectedPageNumber === 1
		})

		PagingService.createPageListByRange(
            pages,
            selectedPageNumber,
            {startIndex: 1, endIndex: this.totalPages}
        )

		pages.push({
			label: '>',
			selected: false,
			hasHandCursor: selectedPageNumber !== this.totalPages,
			greyOut: selectedPageNumber === this.totalPages
		})

		return pages
	}

	getDataByPageNumber (selectedPageNumber) {
		if (isNaN(selectedPageNumber) || this.totalPages === 0) {
			return {
				pages: [],
				totalPages: this.totalPages
			}
		}

		selectedPageNumber = this.fixInvalidSelectedPageNumber(selectedPageNumber)

		var pages

		if (this.totalPages >= 10) {
			pages = this.handleTotalPageIsTenOrMore(selectedPageNumber)
		} else if (this.totalPages === 8 || this.totalPages === 9) {
			pages = this.handleTotalPageIsEightOrNight(selectedPageNumber)
		} else {
			pages = this.handleTotalPageIsLessThanEight(selectedPageNumber)
		}

		return {
			pages: pages,
			totalPages: this.totalPages
		}
	}

}

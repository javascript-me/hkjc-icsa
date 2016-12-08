import React, { Component, PropTypes } from 'react'
import PageButton from './PageButton.js'

const PAGE_START_INDEX = 1

class PaginationList extends Component {

	changePage (page) {
		const {
			pageStartIndex,
			prePage,
			currPage,
			nextPage,
			lastPage,
			firstPage,
			sizePerPage
		} = this.props

		if (page === prePage) {
			page = (currPage - 1) < pageStartIndex ? pageStartIndex : currPage - 1
		} else if (page === nextPage) {
			page = (currPage + 1) > this.lastPage ? this.lastPage : currPage + 1
		} else if (page === lastPage) {
			page = this.lastPage
		} else if (page === firstPage) {
			page = pageStartIndex
		} else {
			page = parseInt(page, 10)
		}

		if (page !== currPage) {
			this.props.changePage(page, sizePerPage)
		}
	}

	changeSizePerPage (e) {
		e.preventDefault()

		const selectSize = parseInt(e.currentTarget.getAttribute('data-page'), 10)
		let { currPage } = this.props
		if (selectSize !== this.props.sizePerPage) {
			this.totalPages = Math.ceil(this.props.dataSize / selectSize)
			this.lastPage = this.props.pageStartIndex + this.totalPages - 1
			if (currPage > this.lastPage) currPage = this.lastPage
			this.props.changePage(currPage, selectSize)
			if (this.props.onSizePerPageList) {
				this.props.onSizePerPageList(selectSize)
			}
		}
	}

	render () {
		const {
      currPage,
      dataSize,
      sizePerPage,
      sizePerPageList,
      paginationShowsTotal,
      pageStartIndex,
      hideSizePerPage,
      paginationClassContainer
    } = this.props
		let sizePerPageText = ''
		this.totalPages = Math.ceil(dataSize / sizePerPage)
		this.lastPage = this.props.pageStartIndex + this.totalPages - 1
		const pageBtns = this.makePage()
		const pageListStyle = {
			// override the margin-top defined in .pagination class in bootstrap.
			marginTop: '0px'
		}

		const sizePerPageOptions = sizePerPageList.map((_sizePerPage) => {
			const pageText = _sizePerPage.text || _sizePerPage
			const pageNum = _sizePerPage.value || _sizePerPage
			if (sizePerPage === pageNum) sizePerPageText = pageText
			return (
				<li key={pageText} role='presentation'>
					<a role='menuitem' tabIndex='-1' href='#' data-page={pageNum} onClick={this.changeSizePerPage}>{ pageText }</a>
				</li>
			)
		})

		const offset = Math.abs(PAGE_START_INDEX - pageStartIndex)
		let start = ((currPage - pageStartIndex) * sizePerPage)
		start = dataSize === 0 ? 0 : start + 1
		let to = Math.min((sizePerPage * (currPage + offset) - 1), dataSize)
		if (to >= dataSize) to--
		let total = paginationShowsTotal ? <span> Showing rows { start } to&nbsp;{ to + 1 } of&nbsp;{ dataSize }</span> : null

		if (typeof paginationShowsTotal === 'function') {
			total = paginationShowsTotal(start, to + 1, dataSize)
		}

		const dropDownStyle = {
			visibility: hideSizePerPage ? 'hidden' : 'visible'
		}

		return (
			<div className='row' style={{ marginTop: 15 }}> {
				sizePerPageList.length > 1 ? <div className='col-md-12'>
					<div className='extra'>
						{ total }{ ' ' }
						<span className='dropdown' style={dropDownStyle}>
							<button className='btn btn-default dropdown-toggle'
								type='button' id='pageDropDown' data-toggle='dropdown'
								aria-expanded='true'>
								{ sizePerPageText }
								<span>
									{ ' ' }
									<span className='caret' />
								</span>
							</button>
							<ul className='dropdown-menu' role='menu' aria-labelledby='pageDropDown'>
								{ sizePerPageOptions }
							</ul>
						</span>
					</div>
					<div className={paginationClassContainer}>
						<ul className='pagination' style={pageListStyle}>
							{ pageBtns }
						</ul>
					</div>
				</div>
				: <div className='col-md-12'>
					<div className='extra'>
						{ total }
					</div>
					<div className='{paginationClassContainer}'>
						<ul className='pagination' style={pageListStyle}>
							{ pageBtns }
						</ul>
					</div>
				</div>
			}
			</div>
		)
	}

	makePage () {
		const pages = this.props.showMinimalView ? this.getMinimalPages() : this.getPages()
		return pages.map((page, i) => {
			const isActive = page === this.props.currPage
			let disabled = false
			let hidden = false
			if (this.props.currPage === this.props.pageStartIndex && (page === this.props.firstPage || page === this.props.prePage)) {
				disabled = true
				hidden = this.props.hideDisable
			}
			if (this.props.currPage === this.lastPage && (page === this.props.nextPage || page === this.props.lastPage)) {
				disabled = true
				hidden = this.props.hideDisable
			}

			if (page === this.props.currPage) {
				disabled = true
			}

			const event = disabled === false ? { changePage: this.changePage } : {}
			return (
				<PageButton key={i} active={isActive} withoutLink={page === '...' || disabled} hidden={hidden} {...event}>{ page }</PageButton>
			)
		}, this)
	}

	getPages () {
		let pages
		let endPage = this.totalPages
		if (endPage <= 0) return []
		let startPage = Math.max(
			this.props.currPage - Math.floor(this.props.paginationSize / 2),
			this.props.pageStartIndex
		)
		endPage = startPage + this.props.paginationSize - 1

		if (endPage > this.lastPage) {
			endPage = this.lastPage
			startPage = endPage - this.props.paginationSize + 1
		}

		if (startPage !== this.props.pageStartIndex && this.totalPages > this.props.paginationSize) {
			pages = [ this.props.firstPage, this.props.prePage ]
		} else if (this.totalPages > 1) {
			pages = [ this.props.prePage ]
		} else {
			pages = []
		}

		for (let i = startPage; i <= endPage; i++) {
			if (i >= this.props.pageStartIndex) pages.push(i)
		}

		if (endPage < this.lastPage) {
			pages.push(this.props.nextPage)
			pages.push(this.props.lastPage)
		} else if (endPage === this.lastPage && this.props.currPage !== this.lastPage) {
			pages.push(this.props.nextPage)
		}

		return pages
	}

	getMinimalPages () {
		let pages
		let endPage = this.totalPages
		if (endPage <= 0) return []
		let startPage = this.props.currPage < 6 ? 1 : this.props.currPage - 2

		endPage = this.props.currPage < 6 ? 6 : this.props.currPage + 2

		if (endPage > this.lastPage) {
			endPage = this.lastPage
			startPage = endPage - this.props.paginationSize + 2
		} else if (this.props.currPage > (this.lastPage - 5)) {
			endPage = this.lastPage
			startPage = this.lastPage - 5
		}

		if (startPage !== this.props.pageStartIndex && this.totalPages > this.props.paginationSize) {
			pages = [ this.props.prePage, '1', '...' ]
		} else if (this.totalPages > 1) {
			pages = [ this.props.prePage ]
		} else {
			pages = []
		}

		for (let i = startPage; i <= endPage; i++) {
			if (i >= this.props.pageStartIndex) pages.push(i)
		}

		if (endPage < this.lastPage) {
			pages.push('...')
			pages.push(this.lastPage)
			pages.push(this.props.nextPage)
		} else if (endPage === this.lastPage) {
			pages.push(this.props.nextPage)
		}

		return pages
	}
}
PaginationList.propTypes = {
	currPage: PropTypes.number,
	sizePerPage: PropTypes.number,
	dataSize: PropTypes.number,
	changePage: PropTypes.func,
	sizePerPageList: PropTypes.array,
	paginationShowsTotal: PropTypes.oneOfType([ PropTypes.bool, PropTypes.func ]),
	paginationSize: PropTypes.number,
	remote: PropTypes.bool,
	onSizePerPageList: PropTypes.func,
	prePage: PropTypes.string,
	pageStartIndex: PropTypes.number,
	hideSizePerPage: PropTypes.bool,
	showMinimalView: PropTypes.bool,
	paginationClassContainer: PropTypes.string,
	hideDisable: PropTypes.bool,
	nextPage: PropTypes.string,
	lastPage: PropTypes.string,
	firstPage: PropTypes.string
}

PaginationList.defaultProps = {
	sizePerPage: 10,
	pageStartIndex: 1,
	showMinimalView: true,
	hideDisable: false
}

export default PaginationList

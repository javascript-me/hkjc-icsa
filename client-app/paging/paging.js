import React from 'react'

export default React.createClass({

	currentSelectedPageNumber: 1,

	propTypes: {
		onChangePage: React.PropTypes.func,
		pageData: React.PropTypes.object
	},

	getUserSelectedPageNumber (currentSelectedPageNumber, innerText, totalPages) {
		var value = Number(innerText)

		if (!isNaN(value)) {
			return value
		}

		if (innerText === '<') {
			if (currentSelectedPageNumber > 1) {
				return currentSelectedPageNumber - 1
			}
		}

		if (innerText === '>') {
			if (currentSelectedPageNumber < totalPages) {
				return currentSelectedPageNumber + 1
			}
		}

		return currentSelectedPageNumber
	},

	isValid (currentSelectedPageNumber, innerText, totalPages) {
		if (currentSelectedPageNumber === 1 && innerText === '<') return false
		if (currentSelectedPageNumber === totalPages && innerText === '>') return false

		return true
	},

	onItemClick (event) {
		if (!this.isValid(this.currentSelectedPageNumber, event.target.innerText, this.props.pageData.totalPages)) return

		this.currentSelectedPageNumber = this.getUserSelectedPageNumber(
			this.currentSelectedPageNumber,
			event.target.innerText,
			this.props.pageData.totalPages
		)

		this.props.onChangePage(this.currentSelectedPageNumber, null, null)
	},

	getClassName (page) {
		var result = []
		if (page.selected) result.push('selected')
		if (page.hasHandCursor) result.push('has-hand-cursor')
		if (page.greyOut) result.push('grey-out')
		return result.join(' ')
	},

	render () {
		return (
			<div className='paging col-md-8'>
				<ul>
					{
						this.props.pageData.pages.map((page, i) => {
							return <li key={i} className={this.getClassName(page)} onClick={this.onItemClick}>{page.label}</li>
						})
					}
				</ul>
			</div>
        )
	}
})

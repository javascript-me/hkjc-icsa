import React from 'react'
import AuditlogStore from '../auditlog/auditlog-store'


export default React.createClass({

	currentSelectedPageNumber: 1,

    getInitialState () {
        return {
            pages: [],
            totalPages: 0
        }
    },
	componentDidMount () {
		AuditlogStore.addChangeListener(this.onChange.bind(this))
	},

	componentWillUnmount () {
		AuditlogStore.removeChangeListener(this.onChange.bind(this))
	},

	onChange () {
		this.setState(AuditlogStore.pageData)
	},

	getUserSelectedPageNumber (currentSelectedPageNumber, innerText, totalPages) {
		var value = Number(innerText)

		if (!isNaN(value)) {
			return value
		}

		if (innerText == '<') {
			if (currentSelectedPageNumber > 1) {
				return currentSelectedPageNumber - 1
			}
		}

		if (innerText == '>') {
			if (currentSelectedPageNumber < totalPages) {
				return currentSelectedPageNumber + 1
			}
		}

		return currentSelectedPageNumber
	},
	onItemClick (event) {
		this.currentSelectedPageNumber = this.getUserSelectedPageNumber(
            this.currentSelectedPageNumber,
            event.target.innerText,
            this.state.totalPages
        )

        var sortingObject = {fieldName: "date_time", order: "NO_ORDER"}
        AuditlogStore.getDataByPageNumber(this.currentSelectedPageNumber, sortingObject)
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
            <div className='paging'>
                <ul>
                    {
                        this.state.pages.map((page, i) => {
							return <li key={i} className={this.getClassName(page)} onClick={this.onItemClick}>{page.label}</li>
						})
                    }
                </ul>
            </div>
        )
	}
})

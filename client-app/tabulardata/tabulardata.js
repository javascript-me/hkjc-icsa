import React from 'react'
import NoData from '../nodata/nodata'

export default React.createClass({
	propTypes: {
		onChange: React.PropTypes.func,
		displayCheckBox: React.PropTypes.bool,
		headers: React.PropTypes.array,
		dataCollection: React.PropTypes.array,
		onClickSorting: React.PropTypes.func
	},

	getInitialState () {
		/* Checks whether check box needs to be add in headers array */
		// TODO: This code should be moved somewhere.
		if (this.props.displayCheckBox  && this.props.headers[0].fieldName !== "") {
			this.props.headers.splice(0, 0, {'id': 0, label: '', fieldName: '', sortingClass: '', addCheckBox: true})
		}
		return {}
	},

	setToNoArrow (headers) {
		for (var i = 0; i < headers.length; i++) {
			headers[i].sortingClass = 'no-arrow'
		}

		return headers
	},

	updateColumnSortingArrow (headers, fieldName) {
		var element = this.findHeader(headers, fieldName)

		var oldSortingClass = element.sortingClass

		headers = this.setToNoArrow(headers)

		element.sortingClass = this.transformSortingClass(oldSortingClass)

		return headers
	},

	transformSortingClass (value) {
		if (value === 'no-arrow') return 'down-arrow'
		if (value === 'down-arrow') return 'up-arrow'
		if (value === 'up-arrow') return 'down-arrow'
		return ''
	},

	findHeader (headers, fieldName) {
		for (var i = 0; i < headers.length; i++) {
			var element = headers[i]

			if (element.fieldName === fieldName) {
				return element
			}
		}

		return null
	},

	parseToOrder (value) {
		// TODO: these names should be extract somewhere.

		if (value === 'no-arrow') return 'NO_ORDER'
		if (value === 'up-arrow') return 'ASCEND'
		if (value === 'down-arrow') return 'DESCEND'
		return ''
	},

	onItemClick (event) {
		var fieldName = event.target.id

		this.setState({
			headers: this.updateColumnSortingArrow(this.props.headers, fieldName)
		})

		var header = this.findHeader(this.props.headers, fieldName)

		var order = this.parseToOrder(header.sortingClass)

		var sortingObject = {fieldName: fieldName, order: order}

		this.props.onClickSorting(1, sortingObject, null)
	},

	formatColumnVal (columnVal) {
		return columnVal || 'N / A'
	},

	// TODO: below long HTML should be extracted to a method.
	// TODO: fieldName like date_time is appeared in 2 places. Need to combine.

	renderRows () {
		if (this.props.dataCollection.length === 0) {
			return <NoData colNum={this.props.headers.length} />
		}
		return <tbody>
			{this.props.dataCollection.map(
				(row) => {
					return <tr>
						{this.props.displayCheckBox ? <td><input type='checkbox' className='checkbox' name='user-profile' /></td> : null}
						{this.props.headers.map(
							(header, i) => {
								if (header.fieldName !== '') {
									return <td>{this.formatColumnVal(row[header.fieldName])}</td>
								}
							}
						)}
					</tr>
				}
			)}
		</tbody>
	},
	checkAll (event) {
		var checkboxes = document.getElementsByTagName('input')
		if (event.target.checked) {
			var i = 0
			for (i = 0; i < checkboxes.length; i++) {
				if (checkboxes[i].type === 'checkbox') {
					checkboxes[i].checked = true
				}
			}
		} else {
			for (i = 0; i < checkboxes.length; i++) {
				if (checkboxes[i].type === 'checkbox') {
					checkboxes[i].checked = false
				}
			}
		}
	},

	render () {
		return <table className='table-striped table auditlog-table'>
			<thead className='table-header'>
				<tr>
					{
					this.props.headers.map(
						(header) => {
							return <th>
								{ this.props.displayCheckBox && header.addCheckBox ? <input type='checkbox' className='checkbox pull-right' id='checkall' onChange={(e) => this.checkAll(e)} /> : null }
								<span id={header.fieldName} className={header.sortingClass} onClick={this.onItemClick}>{header.label}</span>
							</th>
						}
					)
					}
				</tr>
			</thead>
			{this.renderRows()}
		</table>
	}
})

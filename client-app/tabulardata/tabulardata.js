import React from 'react'
import AuditlogStore from '../auditlog/auditlog-store'

export default React.createClass({
	propTypes: {
		onChange: React.PropTypes.func
	},

	getInitialState () {
		if(this.props.displayCheckBox) {
			this.props.headers.splice(0, 0, {'id': 0, label: '', fieldName: '', sortingClass: '', addCheckBox: true})
		}

		return {
			auditlogs: [
				{
					'date_time': '23 September 2016',
					'user_id': 'candy.crush',
					'user_name': 'Candy Crush',
					'Type': 'Odds',
					'function_module': 'Master Risk Limit Log',
					'function_event_detail': 'Update Odds',
					'user_role': 'Role1, Role2',
					'ip_address': '182.34.2.192'
				},
				{
					'date_time': '23 September 2016',
					'user_id': 'candy.crush',
					'user_name': 'Candy Crush',
					'Type': 'Odds',
					'function_module': 'Master Risk Limit Log',
					'function_event_detail': 'Update Odds',
					'user_role': 'Role1, Role2',
					'ip_address': '182.34.2.192'
				}
			]
		}
	},

	componentDidMount () {
		AuditlogStore.addChangeListener(this.onChange)
	},

	componentWillUnmount () {
		AuditlogStore.removeChangeListener(this.onChange)
	},

	onChange () {
		this.setState({
			auditlogs: AuditlogStore.auditlogs
		})

		if (this.props.onChange) {
			this.props.onChange(AuditlogStore.auditlogs)
		}
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

		AuditlogStore.searchAuditlogs(1, sortingObject, null)
	},

	formatColumnVal (columnVal) {
		return columnVal || 'N / A'
	},

	// TODO: below long HTML should be extracted to a method.
	// TODO: fieldName like date_time is appeared in 2 places. Need to combine.

	renderRows () {
		if (this.state.auditlogs.length === 0) {
			let rowArr = [<div className='nodata'>NO Results</div>]
			let tdDom = []
			for (let j = 0; j < 18; j++) {
				tdDom.push(<td />)
			}
			for (let i = 0; i < 10; i++) {
				rowArr.push(<tr className='nodata-tr'>{tdDom}</tr>)
			}
			return rowArr
		}
		return this.state.auditlogs.map((row) => {
			return <tr>
				{ this.props.displayCheckBox ? <td><input type="checkbox" className="checkbox" name="user-profile"/></td> : null }
				<td>{this.formatColumnVal(row.date_time)}</td>
				<td>{this.formatColumnVal(row.user_id)}</td>
				<td>{this.formatColumnVal(row.user_name)}</td>
				<td>{this.formatColumnVal(row.Type)}</td>
				<td>{this.formatColumnVal(row.function_module)}</td>
				<td>{this.formatColumnVal(row.function_event_detail)}</td>
				<td>{this.formatColumnVal(row.user_role)}</td>
				<td>{this.formatColumnVal(row.ip_address)}</td>
				<td>{this.formatColumnVal(row.backend_id)}</td>
				<td>{this.formatColumnVal(row.frontend_id)}</td>
				<td>{this.formatColumnVal(row.home)}</td>
				<td>{this.formatColumnVal(row.away)}</td>
				<td>{this.formatColumnVal(row.ko_time_game_start_game)}</td>
				<td>{this.formatColumnVal(row.bet_type)}</td>
				<td>{this.formatColumnVal(row.event_name)}</td>
				<td>{this.formatColumnVal(row.error_code)}</td>
				<td>{this.formatColumnVal(row.error_message_content)}</td>
				<td>{this.formatColumnVal(row.device)}</td>
			</tr>
		})
	},
	checkAll(event) {
		var checkboxes = document.getElementsByTagName('input')
		if (event.target.checked) {
			for (var i = 0; i < checkboxes.length; i++) {
				if (checkboxes[i].type == 'checkbox') {
					checkboxes[i].checked = true;
				}
			}
		} else {
			for (var i = 0; i < checkboxes.length; i++) {
				console.log(checkboxes[i].type)
				if (checkboxes[i].type == 'checkbox') {
					checkboxes[i].checked = false;
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
							(header, i) => {
								return <th>
									{ this.props.displayCheckBox && header.addCheckBox ? <input type="checkbox" className="checkbox pull-right" id="checkall"  onChange={(e) => this.checkAll(e)}/> : null }
									<span id={header.fieldName} className={header.sortingClass} onClick={this.onItemClick}>{header.label}</span>
								</th>
							}
						)
					}
				</tr>
			</thead>
			<tbody>
				{this.renderRows()}
			</tbody>
		</table>
	}
})

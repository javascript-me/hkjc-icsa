import React, { PropTypes } from 'react'
import _ from 'underscore'

import UserProfileService from './userprofile-service'

const TableHeader = (props) => (<thead className='table-header'>
	<tr>
		{props.header && props.header.map((item, idx) => (
			<th key={item.label}>{item.label}</th>
		))}
	</tr>
</thead>)

TableHeader.propTypes = {
	header: React.PropTypes.array
}

const TableRow = (props) => {
	return (<tbody>
		{props.data && props.data.map((item, idx) => (<tr key={idx + 'row'}>
			{props.fields.map((rol, idx) => (<td key={rol}>{idx >= 1 ? <i className={item[rol] === 'Yes' ? 'tick' : 'cross'} /> : <span>{item[rol]}</span>}</td>))}
		</tr>))}
	</tbody>)
}

TableRow.propTypes = {
	data: React.PropTypes.array,
	fields: React.PropTypes.array
}

export { TableHeader, TableRow }

const header = [
	{label: 'Functions', field: 'functionName'},
	{label: 'Create', field: 'create'},
	{label: 'Read', field: 'read'},
	{label: 'Update', field: 'update'},
	{label: 'Delete', field: 'delete'}
]

export default React.createClass({
	displayName: 'RolesPermission',
	propTypes: {
		header: PropTypes.array,
		inputSelected: PropTypes.array
	},
	getDefaultProps () {
		return {
			header
		}
	},
	getInitialState () {
		this.tableData = []
		this.fields = _.map(this.props.header, item => item.field)
		return {
			showItems: []
		}
	},
	componentDidMount () {
		this.getRoles()
	},
	render () {
		return (
			<div ref='root' className='roles-detail'>
				<table className='table sm-table'>
					<TableHeader header={this.props.header} />
					<TableRow data={this.state.showItems} fields={this.fields} />
				</table>
			</div>
		)
	},
	async getRoles () {
		let roles = []
		roles = await UserProfileService.getRoles()
		this.tableData = roles
		this.tableData.forEach((item) => {
			_.find(this.props.inputSelected, (selected) => {
				if (selected.assignedUserRole === item.roleName) {
					this.tableData = item
				}
			})
		})

		let showItems = this.tableData.functionNames
		this.setState({showItems})
	}
})

import React, { PropTypes } from 'react'
// import classNames from 'classnames'

import { TableComponent, TableHeaderColumn } from '../table'

export default React.createClass({
	displayName: 'ActionReassignment',
	propTypes: {
		task: PropTypes.object,
		users: PropTypes.array,
		roles: PropTypes.array
	},
	getInitialState () {
		return {
			keyword: '',
			radioValue: 'user'
		}
	},
	componentDidMount () {
	},
	handleInputChange (e) {
		let keyword = e.target.value
		this.setState({keyword})
	},
	onRadioChange () {
		this.setState({radioValue: this.state.radioValue === 'user' ? 'role' : 'user'})
	},
	render () {
		// const task = this.props.task
		return (
			<div ref='root' className='action-reassignment'>
				<div className='serch-header'>
					<input type='text' maxLength='100' placeholder='keywords' onChange={this.handleInputChange} />
					<img className='search-icon' src='common/search.svg' />

					<label className='radio-inline'>
						<input type='radio' name='reassignment' value='user' checked={this.state.radioValue === 'user'} onChange={this.onRadioChange} /> User
					</label>
					<label className='radio-inline'>
						<input type='radio' name='reassignment' value='role' checked={this.state.radioValue === 'role'} onChange={this.onRadioChange} /> User Role
					</label>
				</div>

				<div className='tableComponent-container'>
					{this.renderTable()}
				</div>
			</div>
		)
	},
	renderTable () {
		let radioValue = this.state.radioValue
		let keyword = this.state.keyword.toLowerCase()
		let retTable
		let tableData

		if (radioValue === 'user') {
			tableData = this.props.users.filter((item) => {
				return !keyword || item.displayName.toLowerCase().indexOf(keyword) > -1
			})
			retTable = (
				<TableComponent
					data={tableData}
					selectRow={{clickToSelect: true, bgColor: '#FCF6C8'}}
					striped
					keyField='userID'
					tableHeaderClass='table-header'
					tableContainerClass='base-table'
					tableStyle={{maxHeight: 255}}
					bodyStyle={{maxHeight: 212}}
				>
					<TableHeaderColumn dataField='displayName' dataSort>Display Name</TableHeaderColumn>
					<TableHeaderColumn dataField='userID' dataSort>User ID</TableHeaderColumn>
					<TableHeaderColumn dataField='position' dataSort>Position/Title</TableHeaderColumn>
				</TableComponent>
			)
		} else {
			tableData = this.props.roles.filter((item) => {
				return !keyword || item.roleName.toLowerCase().indexOf(keyword) > -1
			})
			retTable = (
				<TableComponent
					data={tableData}
					selectRow={{mode: 'checkbox', clickToSelect: true, bgColor: '#FCF6C8'}}
					striped
					keyField='roleId'
					tableHeaderClass='table-header'
					tableContainerClass='base-table'
					tableStyle={{maxHeight: 255}}
					bodyStyle={{maxHeight: 212}}
				>
					<TableHeaderColumn dataField='roleName' dataSort>User Role</TableHeaderColumn>
				</TableComponent>
			)
		}

		return retTable
	}
})

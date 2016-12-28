import React, { PropTypes } from 'react'
// import classNames from 'classnames'

import { TableComponent, TableHeaderColumn } from '../table'
import API from '../api-service'
import LoginService from '../login/login-service'

const RADIO_USER = 0
const RADIO_ROLE = 1

export {
	RADIO_USER,
	RADIO_ROLE
}

export default React.createClass({
	displayName: 'ActionReassignment',
	propTypes: {
		task: PropTypes.object
	},
	getInitialState () {
		return {
			keyword: '',
			radioValue: RADIO_USER,
			usersData: [],
			rolesData: []
		}
	},
	componentDidMount () {
		API.addListener('change', this.APIChange)

		let profile = LoginService.getProfile()
		this.userID = ''
		if (profile) {
			this.userID = profile.userID
		}
		this.getData()
	},
	componentWillUnmount () {
		API.unsubscribeListener('change', this.APIChange)
	},
	APIChange (error, promise, extra) {
		if (error) {
			// TODO: Show Errors?
		}

		switch (extra) {
		case 'usersList':
			promise.done(response => {
				this.setState({ usersData: response })
			})
			break
		case 'rolesList':
			promise.done(response => {
				this.setState({ rolesData: response })
			})
			break
		default:
			break
		}
	},
	getData () {
		API.request('GET', 'api/userprofile/getDelegation', {
			userID: this.userID
		}, 'usersList')

		API.request('GET', 'api/roles/list', {
			userID: this.userID
		}, 'rolesList')
	},
	handleInputChange (e) {
		let keyword = e.target.value
		this.setState({keyword})
	},
	onRadioChange () {
		this.setState({radioValue: this.state.radioValue === RADIO_USER ? RADIO_ROLE : RADIO_USER, keyword: ''})
	},
	getSelectData () {
		const retObj = {
			type: this.state.radioValue,
			task: this.props.task,
			data: []
		}

		if (this.state.radioValue === RADIO_USER) {
			if (this.refs.tableCmpUser) {
				retObj.data = this.refs.tableCmpUser.store.getSelectedRowKeys()
			}
		} else {
			if (this.refs.tableCmpRole) {
				retObj.data = this.refs.tableCmpRole.store.getSelectedRowKeys()
			}
		}

		return retObj
	},
	render () {
		return (
			<div ref='root' className='action-reassignment'>
				<div className='serch-header'>
					<input type='text' maxLength='100' placeholder='keywords' value={this.state.keyword} onChange={this.handleInputChange} />
					<img className='search-icon' src='common/search.svg' />

					<label className='radio-inline'>
						<input type='radio' name='reassignment' value={RADIO_USER} checked={this.state.radioValue === RADIO_USER} onChange={this.onRadioChange} /> User
					</label>
					<label className='radio-inline'>
						<input type='radio' name='reassignment' value={RADIO_ROLE} checked={this.state.radioValue === RADIO_ROLE} onChange={this.onRadioChange} /> User Role
					</label>
				</div>

				<div className='tableComponent-container'>
					{this.renderTable()}
				</div>
			</div>
		)
	},
	renderTable () {
		const task = this.props.task
		let radioValue = this.state.radioValue
		let keyword = this.state.keyword.toLowerCase()
		let selected = []
		let retTable
		let tableData

		if (radioValue === RADIO_USER) {
			if (task.assigneeUserID) {
				selected.push(task.assigneeUserID)
			}
			tableData = this.state.usersData.filter((item) => {
				return !keyword || item.displayName.toLowerCase().indexOf(keyword) > -1
			})
			retTable = (
				<TableComponent
					ref='tableCmpUser'
					data={tableData}
					selectRow={{clickToSelect: true, bgColor: '#FCF6C8', selected}}
					striped
					keyField='userID'
					tableHeaderClass='table-header'
					tableContainerClass='base-table'
					tableStyle={{height: 255}}
					bodyStyle={{height: 212}}
				>
					<TableHeaderColumn dataField='displayName' dataSort>Display Name</TableHeaderColumn>
					<TableHeaderColumn dataField='userID' dataSort>User ID</TableHeaderColumn>
					<TableHeaderColumn dataField='position' dataSort>Position/Title</TableHeaderColumn>
				</TableComponent>
			)
		} else {
			if (task.assigneeUserRoles) {
				selected = task.assigneeUserRoles.split(',')
			}
			tableData = this.state.rolesData.filter((item) => {
				return !keyword || item.roleName.toLowerCase().indexOf(keyword) > -1
			})
			retTable = (
				<TableComponent
					ref='tableCmpRole'
					data={tableData}
					selectRow={{mode: 'checkbox', clickToSelect: true, bgColor: '#FCF6C8', selected, onSelect: this.onSelectRole}}
					striped
					keyField='roleName'
					tableHeaderClass='table-header'
					tableContainerClass='base-table'
					tableStyle={{height: 255}}
					bodyStyle={{height: 212}}
				>
					<TableHeaderColumn dataField='roleId' autoValue hidden>ID</TableHeaderColumn>
					<TableHeaderColumn dataField='roleName' dataSort>User Role</TableHeaderColumn>
				</TableComponent>
			)
		}

		return retTable
	}
	// renderRoles () {
	// 	const rowKeys = this.refs.tableCmpRole ? this.refs.tableCmpRole.store.getSelectedRowKeys() : []
	// 	return (
	// 		<div className="roles">
	// 			<div className="header">Selected User Role</div>
	// 			<div className="body">
	// 				{rowKeys.map((item, index) => {
	// 					return <span key={index} className="role">{item}</span>
	// 				})}
	// 			</div>
	// 		</div>
	// 	)
	// },
	// onSelectRole () {
	// 	this.setState({})
	// }
})

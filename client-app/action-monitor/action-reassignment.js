import React, { PropTypes } from 'react'
import PubSub from '../pubsub'
import Popup from '../popup'
import { TableComponent, TableHeaderColumn } from '../table'
import API from '../api-service'
import LoginService from '../login/login-service'

const RADIO_USER = 0
const RADIO_ROLE = 1

export default React.createClass({
	displayName: 'ActionReassignment',
	propTypes: {
		task: PropTypes.object
	},
	getInitialState () {
		return {
			keyword: '',
			radioValue: RADIO_USER,
			loadingUser: true,
			loadingRole: true,
			usersData: [],
			rolesData: [],
			tableChangeFlag: false
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
				this.setState({ usersData: response, loadingUser: false })
			})
			break
		case 'rolesList':
			promise.done(response => {
				this.setState({ rolesData: response, loadingRole: false })
			})
			break
		case 'reassignmentUser':
			promise.done(response => {
				PubSub.publish(PubSub['REFRESH_ACTIONS'])
			})
			break
		case 'reassignmentUserRole':
			promise.done(response => {
				PubSub.publish(PubSub['REFRESH_ACTIONS'])
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
	reassignmentUser (taskID, assigneeUserID) {
		API.request('POST', 'api/actions/reassignmentUser', {
			userID: this.userID,
			taskID,
			assigneeUserID
		}, 'reassignmentUser')
	},

	reassignmentUserRole (taskID, assigneeUserRoles) {
		API.request('POST', 'api/actions/reassignmentUserRole', {
			userID: this.userID,
			taskID,
			assigneeUserRoles
		}, 'reassignmentUserRole')
	},
	handleInputChange (e) {
		let keyword = e.target.value
		this.setState({keyword, tableChangeFlag: true})
	},
	onRadioChange () {
		this.setState({radioValue: this.state.radioValue === RADIO_USER ? RADIO_ROLE : RADIO_USER, keyword: '', tableChangeFlag: false})
	},
	hasNoSelectData () {
		let selected = []
		if (this.state.radioValue === RADIO_USER) {
			selected = this.getSelectUser()
		} else {
			selected = this.getSelectRoles()
		}
		return selected.length === 0
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
	confirmRessignment () {
		const reassignment = this.getSelectData()
		if (reassignment.data.length === 0) {
			return
		}

		const task = reassignment.task
		if (reassignment.type === RADIO_USER) {
			let assigneeUserID = reassignment.data[0]
			this.reassignmentUser(task.taskID, assigneeUserID)
		} else {
			let assigneeUserRoles = reassignment.data.join(',')
			this.reassignmentUserRole(task.taskID, assigneeUserRoles)
		}
	},
	render () {
		return (
			<Popup hideOnOverlayClicked ref='popupReassignment' title='Action Reassignment' onConfirm={this.confirmRessignment} confirmBtnDisabled={this.hasNoSelectData()} >
				<div ref='root' className='action-reassignment'>
					<div className='serch-header'>
						<input type='text' maxLength='100' placeholder='Keywords' value={this.state.keyword} onChange={this.handleInputChange} />
						<img className='search-icon' src='common/search.svg' />

						<label className='radio-inline'>
							<input type='radio' name='reassignment' value={RADIO_USER} checked={this.state.radioValue === RADIO_USER} onChange={this.onRadioChange} /> User
						</label>
						<label className='radio-inline'>
							<input type='radio' name='reassignment' value={RADIO_ROLE} checked={this.state.radioValue === RADIO_ROLE} onChange={this.onRadioChange} /> User Role
						</label>
					</div>

					<div className='tableComponent-container'>
						{this.props.task && this.renderTable()}
					</div>

					{this.state.radioValue === RADIO_ROLE && this.renderRoles()}
				</div>
			</Popup>
		)
	},
	renderTable () {
		let radioValue = this.state.radioValue
		let keyword = this.state.keyword.toLowerCase()
		let selected = []
		let retTable
		let tableData

		if (radioValue === RADIO_USER) {
			selected = this.getSelectUser()
			tableData = this.state.usersData.filter((item) => {
				return !keyword || item.displayName.toLowerCase().indexOf(keyword) > -1
			})
			retTable = (
				<TableComponent
					loading={this.state.loadingUser}
					ref='tableCmpUser'
					data={tableData}
					selectRow={{clickToSelect: true, bgColor: '#FCF6C8', selected, onAfterSelect: this.onAfterSelectRole}}
					striped
					keyField='userID'
					tableHeaderClass='table-header'
					tableContainerClass='base-table'
					tableStyle={{height: 255}}
					bodyStyle={{height: 212}}
				>
					<TableHeaderColumn dataField='displayName' dataSort>Display Name</TableHeaderColumn>
					<TableHeaderColumn dataField='userID' dataSort>User ID</TableHeaderColumn>
					<TableHeaderColumn dataField='position' dataSort>Position / Title</TableHeaderColumn>
				</TableComponent>
			)
		} else {
			selected = this.getSelectRoles()
			tableData = this.state.rolesData.filter((item) => {
				return !keyword || item.roleName.toLowerCase().indexOf(keyword) > -1
			})
			retTable = (
				<TableComponent
					loading={this.state.loadingRole}
					ref='tableCmpRole'
					data={tableData}
					selectRow={{mode: 'checkbox', clickToSelect: true, bgColor: '#FCF6C8', selected, onSelect: this.onSelectRole, onAfterSelect: this.onAfterSelectRole, onAfterSelectAll: this.onAfterSelectRole}}
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
	},
	renderRoles () {
		const selected = this.getSelectRoles()
		return (
			<div className='roles'>
				<div className='header'>Selected User Role</div>
				<div className='body'>
					{selected.map((item, index) => {
						return <span key={index} className='role'>{item}</span>
					})}
				</div>
			</div>
		)
	},
	onAfterSelectRole () {
		this.setState({tableChangeFlag: true})
	},
	getSelectUser () {
		const task = this.props.task
		let tableChangeFlag = this.state.tableChangeFlag
		let selected = []
		if (tableChangeFlag) {
			if (this.refs.tableCmpUser) {
				selected = this.refs.tableCmpUser.store.getSelectedRowKeys()
			}
		} else if (task && task.assigneeUserID) {
			selected.push(task.assigneeUserID)
		}
		return selected
	},
	getSelectRoles () {
		const task = this.props.task
		let tableChangeFlag = this.state.tableChangeFlag
		let selected = []
		if (tableChangeFlag) {
			if (this.refs.tableCmpRole) {
				selected = this.refs.tableCmpRole.store.getSelectedRowKeys()
			}
		} else if (task.assigneeUserRoles) {
			selected = task.assigneeUserRoles.split(',')
		}
		return selected
	},
	show () {
		this.refs.popupReassignment.show()
	}
})

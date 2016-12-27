import React from 'react'
import classNames from 'classnames'
import TaskDetail from '../task-detail'
import LoginService from '../login/login-service'
import API from '../api-service'
import { TableComponent, TableHeaderColumn } from '../table'
import Popup from '../popup'
import ActionReassignment from './action-reassignment'

export default React.createClass({
	displayName: 'ActionMonitor',
	getInitialState () {
		return {
			reassignTask: null,
			keyword: '',
			usersData: null,
			rolesData: null,
			tableData: null,
			tableOptions: {
				defaultSortName: 'distributionDateTime',  // default sort column name
				defaultSortOrder: 'desc', // default sort order
				hideSizePerPage: true,
				paginationClassContainer: 'text-center',
				onRowClick: this.onRowClick
			},
			data: null,
			hasData: false,
			currentTask: {}
		}
	},
	componentDidMount () {
		API.addListener('change', this.APIChange)
		this.pageTitle = 'Home \\ Global Tools & Adminstration \\ Communication '
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
	getData () {
		API.request('POST', 'api/actions/list', {
			userID: this.userID
		}, 'actionList')

		API.request('GET', 'api/userprofile/getDelegation', {
			userID: this.userID
		}, 'usersList')

		API.request('GET', 'api/roles/list', {
			userID: this.userID
		}, 'rolesList')
	},
	APIChange (error, promise, extra) {
		if (error) {
			// TODO: Show Errors?
		}

		switch (extra) {
		case 'actionList':
			promise.done(response => {
				this.setState({ tableData: response })
			})
			break
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
	onTaskApprove (data) {
		$.post('api/actions/edit', {
			data: data
		}).then((data) => {
			if (data.status) {
				this.getData()
			}
		})
	},

	onRowClick (taskData) {
		this.setState({currentTask: taskData}, () => {
			this.refs.task.showTask()
		})
	},
	render () {
		return (
			<div ref='root' className='row conatainer-alert action-monitor'>
				<Popup hideOnOverlayClicked ref='popupReassignment' title='Action Reassignment' onConfirm={() => { }} >
					<ActionReassignment ref='actionReassignment' task={this.state.reassignTask} users={this.state.usersData} roles={this.state.rolesData} />
				</Popup>

				<div className='row page-header'>
					<p className='hkjc-breadcrumb'>{this.pageTitle}</p>
					<h1>Action Monitor</h1>
				</div>

				<div className='row page-content' />
				<div>
					<div className='tableComponent-container'>
						<TableComponent
							data={this.state.tableData}
							options={this.state.tableOptions}
							pagination
							striped
							keyField='taskID'
							tableHeaderClass='table-header'
							tableContainerClass='base-table'
						>
							<TableHeaderColumn dataField='taskID' autoValue hidden>ID</TableHeaderColumn>
							<TableHeaderColumn dataField='priority' dataSort dataFormat={this.priorityFormatter}>Priority</TableHeaderColumn>
							<TableHeaderColumn dataField='distributionDateTime' dataSort>Distribution Date & Time</TableHeaderColumn>
							<TableHeaderColumn dataField='taskDescription' dataSort dataFormat={this.detailFormatter}>Task Description</TableHeaderColumn>
							<TableHeaderColumn dataField='targetCompletionDateTime' dataSort>Target completion Time</TableHeaderColumn>
							<TableHeaderColumn dataField='category' dataSort>Category</TableHeaderColumn>
							<TableHeaderColumn dataField='taskStatus' dataSort>Status</TableHeaderColumn>
							<TableHeaderColumn dataField='assigneeUserID' dataFormat={this.assigneeFormatter}>Assignee</TableHeaderColumn>
						</TableComponent>
					</div>
					<div className='vertical-gap'>
						<div className='pull-right'>
							<button className={classNames('btn btn-primary pull-right', {disabled: !this.state.tableData || this.state.tableData.length === 0})}>Export</button>
						</div>
					</div>
				</div>
				<TaskDetail taskInfo={this.state.currentTask} ref='task' onApprove={this.onTaskApprove} />
			</div>
		)
	},
	priorityFormatter (cell, row) {
		if (cell === 'Critical') return <span><img src='notice-board/Critical.svg' title='Critical' /></span>
		if (cell === 'High') return <span><img src='notice-board/High.svg' title='High' /></span>
		if (cell === 'Medium') return <span><img src='notice-board/Medium.svg' title='Medium' /></span>
		if (cell === 'Low') return <span><img src='notice-board/Low.svg' title='Low' /></span>
	},
	detailFormatter (cell, row) {
		if (row.priority === 'Critical') return <span className='critical-message-detail'>{cell}</span>
		return <span>{cell}</span>
	},
	assigneeFormatter (cell, row) {
		let assigneeText = ''
		if (row.assigneeUserName) assigneeText = row.assigneeUserName
		if (row.assigneeUserRoles) assigneeText = row.assigneeUserRoles
		if (row.assigneeDepartmentId) assigneeText = row.assigneeDepartmentId
		return (
			<span>
				<span className='assignee'>
					{assigneeText}
				</span>
				{ row.taskStatus === 'new' && <img src='icon/reassign.svg' onClick={e => this.clickReassign(row)} /> }
			</span>
		)
	},
	clickReassign (row) {
		this.setState({reassignTask: row})
		this.refs.popupReassignment.show()
	}
})

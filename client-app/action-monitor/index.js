import React from 'react'
import {TableHeaderColumn} from '../table'
import { PageComponent, PageLayer } from '../page-component'
import LoginService from '../login/login-service'
import TaskDetail from '../task-detail'
// import config from '../config'
import API from '../api-service'
import ActionReassignment from './action-reassignment'
import Popup from '../popup'

export default React.createClass({
	displayName: 'Audit',

	getInitialState () {
		return {
			categories: [],
			inplay: [],
			tableData: [],
			version: 0,
			options: {
				table: {
					tableHeaderClass: 'table-header',
					tableContainerClass: 'base-table',
					striped: true,
					pagination: true,

					options: {
						defaultSortName: 'system_distribution_time',  // default sort column name
						defaultSortOrder: 'desc', // default sort order
						hideSizePerPage: true,
						paginationClassContainer: 'text-center',
						onRowClick: this.onRowClick
					}

				},
				dateRange: {
					fieldFrom: 'ReceiveFrom',
					fieldFromTitle: 'Receive Time From',
					fieldTo: 'ReceiveTo',
					fieldToTitle: 'Receive Time To'
				}
			}

		}
	},

	componentWillMount () {
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

	getData () {
		API.request('POST', 'api/actions/list', {
			userID: this.userID
		}, 'actionList')
		API.request('GET', 'api/actions/priorities', {}, 'priorities')
		API.request('GET', 'api/actions/categories', {}, 'categories')
		API.request('GET', 'api/actions/status', {}, 'status')
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
	onReAssign (taskItem) {
		this.setState({reassignTask: taskItem})
		this.refs.popupReassignment.show()
	},

	onRowClick (taskData) {
		this.setState({currentTask: taskData}, () => {
			this.refs.task.showTask()
		})
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
		default:
			promise.done(response => {
				const version = { version: this.state.version + 1 }
				let newState = {}
				newState[extra] = response[extra] ? response[extra] : response
				this.setState(Object.assign(newState, version))
			})
			break
		}
	},

	boolFormat (cell, row) {
		return cell ? 'Yes' : 'No'
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
				{ row.taskStatus === 'New' && <img src='icon/reassign.svg' onClick={e => this.clickReassign(e, row)} /> }
			</span>
		)
	},
	onSearch (params) {
		const filters = API.cleanParams(params)
		filters.userID = this.userID
		API.request('POST', 'api/actions/list', filters, 'actionList')
	},

	render () {
		return this.state.version > 2 ? (
			<div className='action-monitor'>
				<Popup hideOnOverlayClicked ref='popupReassignment' title='Action Reassignment' onConfirm={this.confirmRessignment} >
					<ActionReassignment ref='actionReassignment' task={this.state.reassignTask} refresh={this.getData} />
				</Popup>
				<TaskDetail taskInfo={this.state.currentTask} ref='task' onApprove={this.onTaskApprove} onReAssign={this.onReAssign} />
				<PageComponent key={this.state.version} tableData={this.state.tableData} onSearch={this.onSearch} filtersPerRow={4} options={this.state.options} pageTitle='Actions' pageClassName='auditlog conatainer-alert action-monitor' pageBreadcrum='Home \ Global Tools & Adminstration \ Action(Task)'>

					<PageLayer typeLayer='body'>
						<TableHeaderColumn dataField='taskID' autoValue hidden isKey>ID</TableHeaderColumn>
						<TableHeaderColumn dataField='priority' dataSort dataFormat={this.priorityFormatter} isFilter filterOptions={{ctrlType: 'multi-select', dataSource: this.state.priorities}}>Priority</TableHeaderColumn>
						<TableHeaderColumn dataField='distributionDateTime' dataSort isFilter dateRange>Distribution Date & Time</TableHeaderColumn>
						<TableHeaderColumn dataField='taskDescription' dataSort dataFormat={this.detailFormatter}>Task Description</TableHeaderColumn>
						<TableHeaderColumn dataField='targetCompletionDateTime' dataSort isFilter filterOptions={{ctrlType: 'calendar'}}>Target completion Time</TableHeaderColumn>
						<TableHeaderColumn dataField='category' dataSort isFilter filterOptions={{ctrlType: 'multi-select', dataSource: this.state.categories}} hidden>Category</TableHeaderColumn>
						<TableHeaderColumn dataField='taskStatus' dataSort isFilter filterOptions={{ctrlType: 'multi-select', dataSource: this.state.status}}>Status</TableHeaderColumn>
						<TableHeaderColumn dataField='assigneeUserID' width='224' dataFormat={this.assigneeFormatter} isFilter >Assignee</TableHeaderColumn>
					</PageLayer>
				</PageComponent>
			</div>
		) : null
	},
	clickReassign (e, row) {
		e.stopPropagation()
		this.setState({reassignTask: row})
		this.refs.popupReassignment.show()
	},
	confirmRessignment () {
		this.refs.actionReassignment.confirmRessignment()
	}
})

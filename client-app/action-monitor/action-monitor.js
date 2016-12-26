import React from 'react'
import classNames from 'classnames'

import LoginService from '../login/login-service'
import { AsyncRequest } from '../utility'
import { TableComponent, TableHeaderColumn } from '../table'

export default React.createClass({
	displayName: 'ActionMonitor',
	getInitialState () {
		return {
			tableOptions: {
				defaultSortName: 'system_distribution_time',  // default sort column name
				defaultSortOrder: 'desc', // default sort order
				hideSizePerPage: true,
				paginationClassContainer: 'text-center',
				onRowClick: this.onRowClick
			},
			data: null,
			hasData: false
		}
	},
	componentDidMount () {
		let profile = LoginService.getProfile()
		this.userID = ''
		if (profile) {
			this.userID = profile.userID
		}

		this.getActionList()
	},
	getActionList () {
		AsyncRequest.postData(AsyncRequest.urls.ACTIONS_LIST, {
			userID: this.userID
		}).then((result) => {
			if (result.data) {
				this.setState({
					data: result.data
				})
			}
		})
	},
	onRowClick () {
	},
	render () {
		return (
			<div ref='root' className='row conatainer-alert action-monitor'>
				<div className='row page-header'>
					<p className='hkjc-breadcrumb'>Home \\ Global Tools & Adminstration \\ Communication</p>
					<h1>Action Monitor</h1>
				</div>

				<div className='row page-content'>
					<div className='tableComponent-container'>
						<TableComponent
							data={this.state.data}
							options={this.state.tableOptions}
							pagination
							striped
							keyField='taskID'
							tableHeaderClass='table-header'
							tableContainerClass='base-table'
						>
							<TableHeaderColumn dataField='taskID' autoValue hidden>ID</TableHeaderColumn>
							<TableHeaderColumn dataField='priority' dataSort>Priority</TableHeaderColumn>
							<TableHeaderColumn dataField='distributionDateTime' dataSort>Distribution Date & Time</TableHeaderColumn>
							<TableHeaderColumn dataField='taskDescription' dataSort>Task Description</TableHeaderColumn>
							<TableHeaderColumn dataField='targetCompletionDateTime' dataSort>Target completion Time</TableHeaderColumn>
							<TableHeaderColumn dataField='category' dataSort>Category</TableHeaderColumn>
							<TableHeaderColumn dataField='taskStatus' dataSort>Status</TableHeaderColumn>
							<TableHeaderColumn dataField='assigneeUserID' className='nosort-column'>Assignee</TableHeaderColumn>
						</TableComponent>
					</div>
					<div className='vertical-gap'>
						<div className='pull-right'>
							<button className={classNames('btn btn-primary pull-right', {disabled: !this.state.hasData})}>Export</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
})

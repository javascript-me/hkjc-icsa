import React from 'react'
import classNames from 'classnames'

import LoginService from '../login/login-service'
import API from '../api-service'
import { TableComponent, TableHeaderColumn } from '../table'

export default React.createClass({
	displayName: 'ActionMonitor',
	getInitialState () {
		return {
			tableData: null,
			tableOptions: {
				defaultSortName: 'system_distribution_time',  // default sort column name
				defaultSortOrder: 'desc', // default sort order
				hideSizePerPage: true,
				paginationClassContainer: 'text-center',
				onRowClick: this.onRowClick
			}
		}
	},
	componentDidMount () {
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
		API.addListener('change', this.APIChange)
		API.request('POST', 'api/actions/list', {
			userID: this.userID
		}, 'actionList')
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
			break
		}
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
							data={this.state.tableData}
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
							<button className={classNames('btn btn-primary pull-right', {disabled: !this.state.tableData || 0 === this.state.tableData.length})}>Export</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
})

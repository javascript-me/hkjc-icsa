import React from 'react'
import TabularData from '../tabulardata/tabulardata'

export default React.createClass({
	displayName: 'UserProfileList',

	headers: [
		{'id': 1, label: 'User Display Name', fieldName: 'date_time', sortingClass: 'down-arrow', addCheckBox: true},
		{'id': 2, label: 'User ID', fieldName: 'user_id', sortingClass: 'no-arrow', addCheckBox: true},
		{'id': 3, label: 'User Name', fieldName: 'user_name', sortingClass: 'no-arrow', addCheckBox: true},
		{'id': 4, label: 'Staff ID', fieldName: 'Type', sortingClass: 'no-arrow', addCheckBox: true},
		{'id': 5, label: 'Position / Title', fieldName: 'function_module', sortingClass: 'no-arrow', addCheckBox: true},
		{'id': 6, label: 'User Roles', fieldName: 'function_event_detail', sortingClass: 'no-arrow', addCheckBox: true},
		{'id': 7, label: 'Account Status', fieldName: 'user_role', sortingClass: 'no-arrow', addCheckBox: true},
		{'id': 8, label: 'Date of Activation', fieldName: 'ip_address', sortingClass: 'no-arrow', addCheckBox: true},
		{'id': 9, label: 'Date of Inactivation', fieldName: 'backend_id', sortingClass: 'no-arrow', addCheckBox: true}
	],

	getInitialState () {
		return {
			auditlogs: []
		}
	},

	render () {
		return <div className="row userlist-page">
			<div className="page-header">
				<p>Home \ Tool & Administration \ User</p>
				<h1>User Account Profile List</h1>
			</div>
			<div className="page-content">
				<div className="content-header">
					<div className="content-header-left">
						<i className="icon icon-search"></i>
						<input className="input-search" type="text" placeholder="Search with keywords & filters" />
					</div>
					<div className="content-header-right">
						add user
					</div>
				</div>
				<div className="content-table">
					<TabularData displayCheckBox={false} headers={this.headers} dataCollection={this.state.auditlogs} />
				</div>
				<div className="content-footer">
					<div className="content-footer-left">
						<button className="btn btn-primary btn-disable">Delete</button>
					</div>
					<div className="content-footer-center">
						Page Component
					</div>
					<div className="content-footer-right">
						<button className="btn btn-primary">Update</button>
					</div>
				</div>
			</div>
		</div>;
	}
})

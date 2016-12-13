
=== Example ===

tableOptions: {
	defaultSortName: 'date_time',  // default sort column name
	defaultSortOrder: 'desc', // default sort order
	hideSizePerPage: true, //Hide the selector for number of rows per page
	paginationSize: 7, // number of pages to show plus first and last
	paginationClassContainer: 'text-center' // class for the pagination container
},


<TableComponent data={this.state.data} pagination options={this.state.tableOptions} striped keyField='id'
	tableHeaderClass='table-header' tableContainerClass='base-table' >
	<TableHeaderColumn dataField='id' autoValue hidden>ID</TableHeaderColumn>
	<TableHeaderColumn dataField='date_time' dataSort>Date/Time</TableHeaderColumn>
	<TableHeaderColumn dataField='user_id' dataSort>User ID</TableHeaderColumn>
	<TableHeaderColumn dataField='user_name' dataSort>User Name</TableHeaderColumn>
	<TableHeaderColumn dataField='Type' dataSort>Type</TableHeaderColumn>
	<TableHeaderColumn dataField='function_module' dataSort>Function/Module</TableHeaderColumn>
	<TableHeaderColumn dataField='function_event_detail' dataSort>Function Event Detail</TableHeaderColumn>
	<TableHeaderColumn dataField='user_role' dataSort>User Role</TableHeaderColumn>
	<TableHeaderColumn dataField='ip_address' dataSort>IP Address</TableHeaderColumn>
	<TableHeaderColumn dataField='backend_id' dataSort>Back End ID</TableHeaderColumn>
	<TableHeaderColumn dataField='frontend_id' dataSort>Front End ID</TableHeaderColumn>
	<TableHeaderColumn dataField='home' dataSort>Home</TableHeaderColumn>
	<TableHeaderColumn dataField='away' dataSort>Away</TableHeaderColumn>
	<TableHeaderColumn dataField='ko_time_game_start_game' dataSort>K.O. Time/ Game Start Time</TableHeaderColumn>
	<TableHeaderColumn dataField='bet_type' dataSort>Bet Type</TableHeaderColumn>
	<TableHeaderColumn dataField='event_name' dataSort>Event Name</TableHeaderColumn>
	<TableHeaderColumn dataField='error_code' dataSort>Error Code</TableHeaderColumn>
	<TableHeaderColumn dataField='error_message_content' dataSort>Error Message Content</TableHeaderColumn>
	<TableHeaderColumn dataField='device' dataSort>Device</TableHeaderColumn>
</TableComponent>

=== Style ===

To use the default style for table you must use one div container and one class for the tableContainerClass as the example before. i.e:

<div className='tableComponent-container'>
	<TableComponent tableContainerClass='base-table' />
</div>

With this you will get the default blue style table component.

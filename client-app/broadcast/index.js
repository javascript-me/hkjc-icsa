import React from 'react'
import Moment from 'moment'
import Popup from '../popup'
import {TableHeaderColumn} from '../table'
import { PageComponent, PageLayer } from '../Page-component'
import config from '../config'
import API from '../api-service'

//Options array for the Page-Component
const SEARCH_API = config.get('API_BROADCAST_SEARCH')
const options = {
	table: {
		method: SEARCH_API.method,
		endpoint: SEARCH_API.endpoint,
		tableHeaderClass:'table-header',
		tableContainerClass:'base-table',
		striped:true,
		pagination: true,
		options: {
			defaultSortName: 'distribution_date',  // default sort column name
			defaultSortOrder: 'desc', // default sort order
			hideSizePerPage: true,
			paginationClassContainer: 'text-center'
		}
	},
	dateRange: {
		fieldFrom: 'ReceiveFrom',
		fieldFromTitle: 'Receive From',
		fieldTo: 'ReceiveTo',
		fieldToTitle: 'Receive To',
	}
}

export default React.createClass({
	displayName: 'Audit',

	getInitialState() {
		return { 
			categories: [],
			inplay: [],
			tableData: [],
			version: 0
		}
	},

	componentWillMount() {
		this.getData()
	},

	componentWillUnmount() {
		API.unsubscribeListener('change', this.APIChange)
	},

	getData() {
		API.addListener('change', this.APIChange)
		API.request(config.get('API_BROADCAST_CATEGORIES').method, config.get('API_BROADCAST_CATEGORIES').endpoint, {}, 'category')
		API.request(config.get('API_BROADCAST_INPLAY').method, config.get('API_BROADCAST_INPLAY').endpoint, {}, 'inplay')
	},

	APIChange(error, promise, extra) {
		
		if(error) {
			//TODO: Show Errors?
		}

		switch(extra) {
			case 'category':
				promise.done(response => {
					const version = { version : this.state.version + 1 }
					const newState = Object.assign({ categories: response.data }, version)

					this.setState(newState)
				})
			break
			case 'inplay':
				promise.done(response => {
					const version = { version : this.state.version + 1 }
					const newState = Object.assign({ inplay: response.data }, version)

					this.setState(newState)
				})
			break
			case 'table':
				promise.done(response => { 
					this.setState({ tableData: response.data })
				})
			break
		}
	},

	onSearch(params) {
		API.request(options.table.method, options.table.endpoint, params, 'table')
	},

	render() {
		return this.state.version > 1 ? (
			<PageComponent key={this.state.version} tableData={this.state.tableData} onSearch={this.onSearch} filtersPerRow={2} options={options} pageTitle="Broadcast" pageClassName="auditlog" pageBreadcrum="Home \ Global Tools & Adminstration \ Communication \ Broadcast">
				<PageLayer typeLayer="body">
					<TableHeaderColumn dataField='id' autoValue={true} isKey={true} hidden={true}>ID</TableHeaderColumn>
					<TableHeaderColumn dataField='distribution_date' dataSort dateRange={true} isFilter={true}>Distribution Date & Time</TableHeaderColumn>
					<TableHeaderColumn dataField='name' dataSort>Name</TableHeaderColumn>
					<TableHeaderColumn dataField='category' dataSort  isFilter={true} filterOptions={ {ctrlType:'select', dataSource:this.state.categories} }>Category</TableHeaderColumn>
					<TableHeaderColumn dataField='details' dataSort>Detail</TableHeaderColumn>
					<TableHeaderColumn dataField='in_play' dataSort isFilter={true} filterOptions={ {ctrlType:'select', dataSource:this.state.inplay} }>In Play Event</TableHeaderColumn>
				</PageLayer>
			</PageComponent>
		) : null
	}
})

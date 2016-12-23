import React from 'react'
import {TableHeaderColumn} from '../table'
import { PageComponent, PageLayer } from '../Page-component'
import config from '../config'
import API from '../api-service'

// Options array for the Page-Component
const SEARCH_API = config.get('API_BROADCAST_SEARCH')
const options = {
	table: {
		method: SEARCH_API.method,
		endpoint: SEARCH_API.endpoint,
		tableHeaderClass: 'table-header',
		tableContainerClass: 'base-table',
		striped: true,
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
		fieldToTitle: 'Receive To'
	}
}

export default React.createClass({
	displayName: 'Audit',

	getInitialState () {
		return {
			categories: [],
			inplay: [],
			tableData: [],
			version: 0
		}
	},

	componentWillMount () {
		this.getData()
	},

	componentWillUnmount () {
		API.unsubscribeListener('change', this.APIChange)
	},

	getData () {
		API.addListener('change', this.APIChange)
		API.request(config.get('API_BROADCAST_CATEGORIES').method, config.get('API_BROADCAST_CATEGORIES').endpoint, {}, 'categories')
		API.request(config.get('API_BROADCAST_INPLAY').method, config.get('API_BROADCAST_INPLAY').endpoint, {}, 'inplay')
		API.request(config.get('API_BROADCAST_SPORTS').method, config.get('API_BROADCAST_SPORTS').endpoint, {}, 'sports')
		API.request(config.get('API_BROADCAST_CONTINENTS').method, config.get('API_BROADCAST_CONTINENTS').endpoint, {}, 'continents')
		API.request(config.get('API_BROADCAST_COUNTRIES').method, config.get('API_BROADCAST_COUNTRIES').endpoint, {}, 'countries')
		API.request(config.get('API_BROADCAST_COMPETITIONS').method, config.get('API_BROADCAST_COMPETITIONS').endpoint, {}, 'competitions')
		API.request(config.get('API_BROADCAST_MATCHES').method, config.get('API_BROADCAST_MATCHES').endpoint, {}, 'matches')
	},

	APIChange (error, promise, extra) {
		if (error) {
			// TODO: Show Errors?
		}

		switch (extra) {

		case 'table':
			promise.done(response => {
				this.setState({ tableData: response.data })
			})
			break
		default:
			promise.done(response => {
				const version = { version: this.state.version + 1 }
				let newState = {}
				newState[extra] = response.data ? response.data : response

				this.setState(Object.assign(newState, version))
			})
			break
		}
	},

	boolFormat (cell, row) {
		return cell ? 'Yes' : 'No'
	},

	onSearch (params) {
		const filters = API.cleanParams(params)
		API.request(options.table.method, options.table.endpoint, filters, 'table')
	},

	render () {
		return this.state.version > 6 ? (
			<PageComponent key={this.state.version} tableData={this.state.tableData} onSearch={this.onSearch} filtersPerRow={4} options={options} pageTitle='Broadcast' pageClassName='auditlog' pageBreadcrum='Home \ Global Tools & Adminstration \ Communication \ Broadcast'>
				<PageLayer typeLayer='body'>
					<TableHeaderColumn dataField='id' autoValue isKey hidden>ID</TableHeaderColumn>
					<TableHeaderColumn dataField='distribution_date' dataSort dateRange isFilter>Distribution Date & Time</TableHeaderColumn>
					<TableHeaderColumn dataField='name' dataSort isFilter>Name</TableHeaderColumn>
					<TableHeaderColumn dataField='category' dataSort isFilter filterOptions={{ctrlType: 'multi-select', dataSource: this.state.categories}}>Category</TableHeaderColumn>
					<TableHeaderColumn dataField='details' dataSort>Detail</TableHeaderColumn>
					<TableHeaderColumn dataField='in_play' dataSort dataFormat={this.boolFormat} isFilter filterOptions={{ctrlType: 'multi-select', dataSource: this.state.inplay}}>In Play Event</TableHeaderColumn>
					<TableHeaderColumn dataField='sports_type' isFilter filterOptions={{ctrlType: 'multi-select', dataSource: this.state.sports}} hidden>Sports Type</TableHeaderColumn>
					<TableHeaderColumn dataField='continent' isFilter filterOptions={{ctrlType: 'multi-select', dataSource: this.state.continents}} hidden>Continent</TableHeaderColumn>
					<TableHeaderColumn dataField='country' isFilter filterOptions={{ctrlType: 'multi-select', dataSource: this.state.countries}} hidden>Country</TableHeaderColumn>
					<TableHeaderColumn dataField='event_level1' isFilter filterOptions={{ctrlType: 'multi-select', dataSource: this.state.competitions}} hidden>Competition(Event Level1)</TableHeaderColumn>
					<TableHeaderColumn dataField='event_level2' isFilter filterOptions={{ctrlType: 'multi-select', dataSource: this.state.matches}} hidden>Match (Race for HR )</TableHeaderColumn>
				</PageLayer>
			</PageComponent>
		) : null
	}
})

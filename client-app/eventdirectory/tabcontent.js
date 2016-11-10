import React, { PropTypes } from 'react'

import SearchFilter from './searchfilter'
import SearchResult from './searchresult'

import EventDirectoryService from './eventdirectory-service'

export const EDTYPES = {
	FOOTBAL: 0,
	BASEKETBALL: 1,
	HORSERACING: 2
}

export default React.createClass({
	displayName: 'TabContent',
	propTypes: {
		type: PropTypes.number
	},
	getInitialState () {
		return {
			filter: null,
			result: null
		}
	},
	componentDidMount () {
		this.getFilter()
		this.getResult()
	},
	componentWillUnmount: function () {
	},
	render () {
		return (
			<div ref='root'>
				<SearchFilter data={this.state.filter} />
				<SearchResult data={this.state.result} />
			</div>
			)
	},
	async getFilter () {
		const filter = await EventDirectoryService.getEventDirectoryFilter()
		if (filter) {
			this.setState({filter})
		}
	},
	async getResult () {
		const result = await EventDirectoryService.getEventDirectoryResult()
		if (result) {
			this.setState({result})
		}
	}
})

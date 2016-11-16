import React, { PropTypes } from 'react'

import SearchFilter from './searchfilter'
import SearchTree from './searchtree'

import EventDirectoryService from './eventdirectory-service'

export const EDTYPES = {
	FOOTBAL: 0,
	BASEKETBALL: 1,
	HORSERACING: 2
}

export default React.createClass({
	displayName: 'SearchContainer',
	propTypes: {
		type: PropTypes.number.isRequired
	},
	getInitialState () {
		return {
			filter: null,
			result: null
		}
	},
	componentDidMount () {
		this.getFilter()
	},
	componentWillUnmount () {
	},
	onSearch (searchParam) {
		searchParam.type = this.props.type
		this.getResult(searchParam)
	},
	render () {
		return (
			<div ref='root' className='ed-container'>
				<SearchFilter filter={this.state.filter} onSearch={this.onSearch} />
				<SearchTree result={this.state.result} />
			</div>
			)
	},
	async getFilter () {
		const filter = await EventDirectoryService.getEventDirectoryFilter()
		if (filter) {
			this.setState({filter})
		}
	},
	async getResult (searchParam) {
		const result = await EventDirectoryService.getEventDirectoryResult(searchParam)
		if (result) {
			console.log(result)
			this.setState({result: result.result})
		}
	}
})

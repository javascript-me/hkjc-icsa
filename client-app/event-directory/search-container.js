import React, { PropTypes } from 'react'

import SearchFilter from './search-filter'
import SearchTree from './search-tree'

import EventDirectoryService from './event-directory-service'

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
			result: null
		}
	},
	async onSearch (searchParam) {
		searchParam.type = this.props.type
		this.setState({result: null})
		await this.getResult(searchParam)
	},
	render () {
		return (
			<div ref='root' className='ed-container'>
				<SearchFilter onSearch={this.onSearch} />
				<SearchTree result={this.state.result} />
			</div>
			)
	},
	async getResult (searchParam) {
		const result = await EventDirectoryService.getEventDirectoryResult(searchParam)
		if (result) {
			this.setState({result})
		}
	}
})

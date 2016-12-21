import React from 'react'
import FilterBlock from './index'
import ClassNames from 'classnames'
import _ from 'lodash'

const emptyFn = () => {}

export default React.createClass({
	displayName: 'FilterBlocksContainer',

	propTypes: {
		filters: React.PropTypes.array,
		onRemoveOneFilter: React.PropTypes.func
	},
	getDefaultProps: function () {
		return {
			filters: [],
			onRemoveOneFilter: emptyFn
		}
	},

	getInitialState () {
		return {
			filtersOverflow: false,
			showingMore: false
		}
	},
	componentDidMount: function () {

	},
	componentWillUpdate: function (nextProps, nextState) {
		
	},
	componentDidUpdate: function (prevProps, prevState) {
		let currentProps = this.props
		
		if (_.isEqual(currentProps, prevProps)) {
			return false
		}

		this.setState({
			filtersOverflow: this.anyFiltersOverflow()
		})
	},
	componentWillUnmount: function () {

	},
	anyFiltersOverflow: function() {
		let container = this.refs.filterBlocksContainer
		let filterCount = container.children.length
		let firstFilter = container.firstChild
		let lastFilter = container.lastChild

		return filterCount > 0 && firstFilter.offsetTop !== lastFilter.offsetTop
	},
	getFilterBlocks: function (filters, onRemoveOneFilter) {
		let filterDoms = []

		return filters.map((f, index) => {
			return <FilterBlock
				key={index}
				dataText={f.text}
				dataValue={f.value}
				removeEvent={onRemoveOneFilter} />
		}) || []
	},
	toggleMoreFilterPanel: function() {

	},
	render: function () {
		let filterBlocks = this.getFilterBlocks(this.props.filters, this.props.onRemoveOneFilter)
		let filterBlocksContainerClassName = ClassNames('filter-block-container',
			{'short': this.state.filtersOverflow})
		let showMoreBtnClassName = ClassNames('btn-show-more-filter',
			{'showing': this.state.showingMore})

		return <div>
			<div className='filter-block-container' ref="filterBlocksContainer">
				{filterBlocks}
			</div>
			{ this.state.filtersOverflow ? <span className={showMoreBtnClassName} onClick={this.toggleMoreFilterPanel}>
				More
			</span> : '' }
		</div>
	}
})
import React from 'react'
import FilterBlock from './index'
import OverflowFilter from './overflow-filter'
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
			isLoading: true,
			doesAnyFiltersOverflow: false,
			showingMore: false,
			overflowFilters: [],
			clickingOnMoreFilterPanel: false
		}
	},
	componentWillMount: function () {

	},
	componentDidMount: function () {
		document.addEventListener('click', this.pageClickedOrResized, false)
		window.addEventListener('resize', this.pageClickedOrResized, false)
	},
	componentWillUpdate: function (nextProps, nextState) {
		let currentProps = this.props

		if (_.isEqual(currentProps, nextProps)) {
			return false
		}

		this.setState({
			isLoading: true
		})
	},
	componentDidUpdate: function (prevProps, prevState) {
		let me = this
		let currentProps = me.props

		if (_.isEqual(currentProps, prevProps)) {
			return false
		}

		this.refreshedOverflowFilters()
	},
	componentWillUnmount: function () {
		document.removeEventListener('click', this.pageClickedOrResized, false)
		window.removeEventListener('resize', this.pageClickedOrResized, false)
	},
	refreshedOverflowFilters: function () {
		let me = this
		let pureFilters = this.refs.pureFilterBlocksContainer
		let filterCount = pureFilters.children.length
		let overflowFilters = []
		let firstFilter
		let firstFilterOffset

		if (filterCount) {
			firstFilter = pureFilters.firstChild
			firstFilterOffset = firstFilter.offsetTop

			Array.prototype.forEach.call(pureFilters.children, (filterDOM, i) => {
				if (filterDOM.offsetTop > firstFilterOffset) {
					overflowFilters.push(me.props.filters[i])
				}
			})
		}

		this.setState({
			overflowFilters: overflowFilters,
			doesAnyFiltersOverflow: overflowFilters.length > 0,
			isLoading: false
		})
	},
	pageClickedOrResized: function (event) {
		if (this.state.clickingOnMoreFilterPanel) {
			this.setState({clickingOnMoreFilterPanel: false})
			return
		}

		this.hideMoreFilterPanel()
	},
	getFilterBlocks: function (filters, onRemoveOneFilter) {
		return filters.map((f, index) => {
			return <FilterBlock
				key={index}
				dataText={f.text}
				dataValue={f.value}
				removeEvent={onRemoveOneFilter} />
		}) || []
	},
	getOverflowFilters: function (filters, onRemoveOneFilter) {
		return Array.prototype.map.call(filters, (f, index) => {
			return <OverflowFilter
				key={index}
				dataText={f.text}
				dataValue={f.value}
				removeEvent={onRemoveOneFilter} />
		})
	},
	toggleMoreFilterPanel: function () {
		this.setState({
			showingMore: !this.state.showingMore
		})
	},
	hideMoreFilterPanel: function () {
		this.setState({
			showingMore: false
		})
	},
	clickOnMoreFilterPanel: function (event) {
		this.setState({
			clickingOnMoreFilterPanel: true
		})
	},
	render: function () {
		let contianerClassName = ClassNames('filter-block-container',
			{'loading': this.state.isLoading})
		let pureFilterBlocksClassName = ClassNames('pure-filter-block',
			{'short': this.state.doesAnyFiltersOverflow})
		let showMoreBtnClassName = ClassNames('btn-show-more-filter',
			{'showing': this.state.showingMore})

		let filterBlocks = this.getFilterBlocks(this.props.filters, this.props.onRemoveOneFilter)
		let overflowFilters = this.getOverflowFilters(this.state.overflowFilters, this.props.onRemoveOneFilter)

		return <div className={contianerClassName}>
			<div className={pureFilterBlocksClassName} ref='pureFilterBlocksContainer'>
				{filterBlocks}
			</div>
			{ this.state.doesAnyFiltersOverflow
				? <div className='show-more-ctrl-panel' onClick={this.clickOnMoreFilterPanel}>
					<span className={showMoreBtnClassName} onClick={this.toggleMoreFilterPanel}>
						More
					</span>
					{ this.state.showingMore
						? <div className='more-filters-panel'>
							<ul>{overflowFilters}</ul>
						</div>
						: ''
					}
				</div>
				: ''
			}
		</div>
	}
})

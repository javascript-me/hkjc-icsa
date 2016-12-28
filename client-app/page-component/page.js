import React, { PropTypes } from 'react'
import moment from 'moment'
import ClassNames from 'classnames'
import BetType from '../bet-type'
import FilterBlocksContainer from '../filter-block/filter-blocks-container'
import FilterPanel from '../filter-panel'
import FilterPanelRow from '../filter-panel/filter-panel-row'
import FilterPanelColumn from '../filter-panel/filter-panel-column'
import API from '../api-service'
import ExportService from '../auditlog/export-service'
import {TableHeaderColumn, TableComponent} from '../table'

const originDateRange = {
	dateTimeFrom: moment().subtract(60, 'days').set({ hour: 0, minute: 0 }).format('DD MMM YYYY HH:mm'),
	dateTimeTo: moment().set({ hour: 23, minute: 59 }).format('DD MMM YYYY HH:mm')
}

const doExport = async (format, filters) => {
	const file = ExportService.getFileURL(format, filters)
	if (file) {
		window.open(file, '_blank')
	}
}

export default React.createClass({
	displayName: 'Page Component',

	getInitialState () {
		this.initPage(this.props)

		return {
			data: [],
			hasData: false,
			exportFormat: 'pdf',
			betTypes: ['football', 'basketball', 'horse-racing'],
			betType: 'football',
			keyword: '',
			selectedKeyword: '',
			selectedFilters: this.getDefaultSelectedFilters(),
			isShowingMoreFilter: false,
			isClickForSearching: false
		}
	},

	getDefaultSelectedFilters () {
		return [{
			name: this.props.options.dateRange.fieldFrom,
			value: originDateRange.dateTimeFrom
		}, {
			name: this.props.options.dateRange.fieldTo,
			value: originDateRange.dateTimeTo
		}]
	},

	initPage: function (props) {
		if (!props.children) {
			throw new Error('Page Component needs to have Childrens to define the content')
		}

		if (typeof props.children === 'object') {
			React.Children.forEach(props.children, layer => {
				this.renderLayer(layer)
			})
		} else {
			this.renderLayer(props.children)
		}
	},

	renderLayer: function (layer) {
		switch (layer.props.typeLayer) {
		case 'top':
			this.top = layer
			break
		case 'body':
			this.cols = []
			this.filterCols = []

			if (typeof layer.props.children === 'object') {
				layer.props.children.map((column, i) => {
					this.renderColumn(column, i)
				}, this)
			} else {
				this.renderColumn(this.props.children, 1)
			}

			break
		case 'bottom':
			this.bottom = layer
			break
		}
	},

	renderColumn: function (column, i) {
		this.cols.push(<TableHeaderColumn key={`column${i}`} {...column.props}>{column.props.children}</TableHeaderColumn>)
		if (column.props.isFilter) {
			const title = typeof column.props.children === 'string' ? column.props.children : column.props.dataField
			if (column.props.dateRange) {
				const filters = [ <FilterPanelColumn key='dateRange1' filterName={this.props.options.dateRange.fieldFrom}
					filterTitle={this.props.options.dateRange.fieldFromTitle}
					filterValue={originDateRange.dateTimeFrom}
					ctrlType='calendar'
					isRequired={column.props.isRequired}
					pairingVerify={[{
						operation: '<=',
						partners: [this.props.options.dateRange.fieldTo]
					}]} />,
					<FilterPanelColumn key='dateRange2' filterName={this.props.options.dateRange.fieldTo}
						filterTitle={this.props.options.dateRange.fieldToTitle}
						filterValue={originDateRange.dateTimeTo}
						ctrlType='calendar'
						isRequired={column.props.isRequired}
						pairingVerify={[{
							operation: '>=',
							partners: [this.props.options.dateRange.fieldFrom]
						}]} />
				]
				// Added the default date range elements
				filters.map(item => this.filterCols.push(item))
			} else {
				this.filterCols.push(<FilterPanelColumn key={`filter${i}`} filterName={column.props.dataField} filterTitle={title} {...column.props.filterOptions} />)
			}
		}
	},

	componentWillMount: function () {
		document.addEventListener('click', this.pageClick, false)

		if (this.props.onSearch) {
			this.onSearch()
		}
	},

	componentWillUnmount: function () {
		document.removeEventListener('click', this.pageClick, false)
	},

	pageClick: function (event) {
		if (!this.state.isShowingMoreFilter || this.state.isClickForSearching) {
			this.setState({isClickForSearching: false})
			return
		}

		this.hideMoreFilter()
	},

	getSearchCriterias: function () {
		return {
			betType: this.state.betType,
			keyword: this.state.selectedKeyword,
			filters: this.state.selectedFilters
		}
	},

	getBetTypeIconClassName: function (betType) {
		return ClassNames(
		'bet-type',
		'icon-' + betType,
			{
				'active': this.state.betType === betType
			})
	},

	changeBetType: function (betType) {
		this.setState({
			betType: betType,
			keyword: '',
			selectedKeyword: '',
			selectedFilters: this.getDefaultSelectedFilters(),
			isShowingMoreFilter: false
		})
		this.refs.filterPanel.handleReset()
	},

	handleKeywordChange: function (event) {
		this.setState({
			keyword: event.target.value
		})
	},

	handleKeywordPress: function (event) {
		if (event.key === 'Enter') {
			this.refs.filterPanel.handleSubmit()
		}
	},

	removeSearchCriteriaFilter: function (filter) {
		const callback = () => {
			this.setState({
				isShowingMoreFilter: false
			})
			this.refs.filterPanel.removeOneFilterTopic(filter)
			this.onSearch()
		}

		switch (filter.name) {
		case 'keyword':
			this.removeKeywordFilter(filter, callback)
			break
		case `${this.props.options.dateRange.fieldFrom},${this.props.options.dateRange.fieldTo}`:
			this.removeDateRangeFilter(filter, callback)
			break
		default:
			this.removeNormalFilter(filter, callback)
			break
		}
	},

	removeKeywordFilter: function (keyword, callback) {
		this.setState({
			keyword: '',
			selectedKeyword: ''
		}, callback)
	},

	removeDateRangeFilter: function (dateRange, callback) {
		let selectedFilters = this.state.selectedFilters

		selectedFilters.forEach((filter) => {
			if (filter.name === `${this.props.options.dateRange.fieldFrom}`) {
				filter.value = originDateRange.dateTimeFrom
			} else if (filter.name === `${this.props.options.dateRange.fieldTo}`) {
				filter.value = originDateRange.dateTimeTo
			}
		})

		this.setState({
			selectedFilters: selectedFilters
		}, callback)
	},

	removeNormalFilter: function (filter, callback) {
		let selectedFilters = this.state.selectedFilters
		let filterIndex = selectedFilters.indexOf(filter)

		selectedFilters.splice(filterIndex, 1)

		this.setState({
			selectedFilters: selectedFilters
		}, callback)
	},

	clickForSearching: function () {
		this.setState({
			isClickForSearching: true
		})
	},

	showMoreFilter: function (event) {
		this.clickForSearching()

		this.setState({
			isShowingMoreFilter: true
		})
	},

	hideMoreFilter: function () {
		this.setState({
			isShowingMoreFilter: false
		})
	},

	setFilters: function (filters) {
		this.hideMoreFilter()

		let newFilters = []

		for (let attr in filters) {
			newFilters.push({
				'name': attr,
				'value': filters[attr]
			})
		}

		this.setState({
			selectedFilters: newFilters
		}, () => {
			this.setState({ selectedKeyword: this.state.keyword }, () => {
				this.onSearch()
			})
		})
	},

	onSearch: function () {
		if (this.props.onSearch) {
			let criteriaOption = this.getSearchCriterias()
			this.props.onSearch(criteriaOption)
		}
	},

	checkIsDateRangeNotChanged: function () {
		let filters = this.state.selectedFilters
		let dateTimeFrom
		let dateTimeTo

		for (var i in filters) {
			if (filters[i].name === this.props.options.dateRange.fieldFrom) {
				dateTimeFrom = filters[i].value
			} else if (filters[i].name === this.props.options.dateRange.fieldTo) {
				dateTimeTo = filters[i].value
			}
		}

		return dateTimeFrom === originDateRange.dateTimeFrom && dateTimeTo === originDateRange.dateTimeTo
	},

	openPopup: function () {
		this.setState({ exportFormat: 'pdf' })// reset the format value
		this.state.hasData ? this.refs.exportPopup.show() : null
	},

	export: function () {
		let criteriaOption = this.getSearchCriterias()
		const filters = API.buildRequest(criteriaOption)

		doExport(this.state.exportFormat, filters)
	},

	onChangeFormat: function (format) {
		this.setState({ exportFormat: format })
	},

	getFormattedFilters: function (filters) {
		const filterDisplayFormatting = (filter) => {
			switch (filter.name) {
			case 'keyword':
				return `${filter.name}: ${filter.value}`
			default:
				return Array.isArray(filter.value)
				? filter.value.map(e => { return e.label }).join(', ')
				: ((filter.value instanceof moment) ? filter.value.format('DD MMM YYYY HH:mm:ss') : filter.value) // fix the filter is calendar value
			}
		}

		let isDateRangeNotChanged = this.checkIsDateRangeNotChanged()
		let keywordFilter = {
			name: 'keyword',
			value: this.state.selectedKeyword
		}
		let dateFromFilter = filters.filter((f) => {
			return f.name === this.props.options.dateRange.fieldFrom
		})[0] || {}
		let dateToFilter = filters.filter((f) => {
			return f.name === this.props.options.dateRange.fieldTo
		})[0] || {}
		let dateRangeFilter = {
			name: `${this.props.options.dateRange.fieldFrom},${this.props.options.dateRange.fieldTo}`,
			value: `${dateFromFilter.value} - ${dateToFilter.value}`
		}
		let filtersArrayWithoutDateRange = filters.filter((f) => {
			if (f.name === this.props.options.dateRange.fieldFrom || f.name === this.props.options.dateRange.fieldTo) {
				return false
			}
			return true
		})

		let filtersArray = []
			.concat(this.state.selectedKeyword ? keywordFilter : [])
			.concat(isDateRangeNotChanged ? [] : [dateRangeFilter])
			.concat(filtersArrayWithoutDateRange)
		let formattedFilters = filtersArray.map((f, index) => {
			return {
				text: filterDisplayFormatting(f),
				value: f
			}
		})

		return formattedFilters
	},
	render: function () {
		let betTypesContainerClassName = ClassNames('bet-types', {
			'hover-enabled': !this.state.isShowingMoreFilter
		})
		let betTypes = this.state.betTypes.map((betType, index) => {
			return <BetType
				key={index}
				selectedBetType={this.state.betType}
				betType={betType}
				changeBetTypeEvent={this.changeBetType} />
		})
		let formattedFilters = this.getFormattedFilters(this.state.selectedFilters)
		let moreFilterContianerClassName = ClassNames('more-filter-popup', {
			'active': this.state.isShowingMoreFilter
		})

		let activeContent
		if (this.state.betType === 'football') {
			activeContent =
				<div>
					<div className='row' style={{ width: '100%', paddingLeft: '15px' }}>

						<div className='tableComponent-container'>
							<TableComponent key='table' data={this.props.tableData} loading={this.props.tableLoading} {...this.props.options.table}>
								{
									this.cols
								}
							</TableComponent>
						</div>
					</div>
					<div className='row'>
						{ this.bottom }
					</div>
				</div>
		} else {
			activeContent = <div className='nopage'>Coming Soon</div>
		}

		const topClass = this.top && this.top.props.columns ? `col-md-${12 - this.top.props.columns}` : 'col-md-12'
		const topElement = this.top && this.top.props.columns ? <div className={`col-md-${this.top.props.columns}`}>{ this.top }</div> : null
		const addBetType = this.props.betType ? <div className={betTypesContainerClassName}>{betTypes}</div> : null
		const border = this.props.betType ? null : {borderLeft: '1px solid #305091'}

		return (
			<div className={this.props.pageClassName}>
				<div className='row page-header'>
					<p className='hkjc-breadcrumb'>{this.props.pageBreadcrum}</p>
					<h1>{this.props.pageTitle}</h1>
				</div>
				<div className='row page-content'>
					{/* Search Critiria Row */}
					<div className={topClass}>
						<div className='search-criteria-container'>
							<div className='search-criteria-container-row'>
								{ addBetType }
								<div className='keyword-container' style={border}>
									<input type='text' placeholder='Search with keywords & filters'
										value={this.state.keyword}
										onClick={this.showMoreFilter}
										onChange={this.handleKeywordChange}
										onKeyPress={this.handleKeywordPress}
										ref='keyword' />
								</div>
								<FilterBlocksContainer filters={formattedFilters} onRemoveOneFilter={this.removeSearchCriteriaFilter} />
							</div>
							<div className={moreFilterContianerClassName} onClick={this.clickForSearching}>
								<FilterPanel key='filterPanel' ref='filterPanel' onSubmit={this.setFilters}>{ this.filterCols ? this.generateFilterRows() : null }</FilterPanel>
							</div>
						</div>
					</div>
					{ topElement }
				</div>
				{/* Active Content */}
				{ activeContent }
				{/* End Active Content */}

			</div>
			)
	},

	generateFilterRows: function () {
		let rows = []
		const nuRows = Math.ceil(this.filterCols.length / this.props.filtersPerRow)

		let start = 0
		let end = start + this.props.filtersPerRow

		for (let i = 1; i <= nuRows; i++) {
			rows.push(<FilterPanelRow key={`FilterRow${i}`}>{ this.filterCols.slice(start, end) }</FilterPanelRow>)
			start += this.props.filtersPerRow
			end += this.props.filtersPerRow
		}

		return rows
	},

	propTypes: {
		pageTitle: PropTypes.string,
		pageBreadcrum: PropTypes.string,
		pageClassName: PropTypes.string,
		filtersPerRow: PropTypes.number,
		betType: PropTypes.bool,
		tableData: PropTypes.array,
		tableLoading: PropTypes.bool,
		options: PropTypes.shape({
			table: PropTypes.object,
			dateRange: PropTypes.shape({
				fieldTo: PropTypes.string,
				fieldToTitle: PropTypes.string,
				fieldFrom: PropTypes.string,
				fieldFromTitle: PropTypes.string
			})
		}),
		children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
		onSearch: PropTypes.func

	},

	getDefaultProps: function () {
		return {
			filtersPerRow: 4
		}
	}
})

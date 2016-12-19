import { React, PropTypes } from 'react'
import moment from 'moment'
import ClassNames from 'classnames'
import BetType from '../betType'
import FilterBlock from '../filter-block'
import FilterPanel from '../filter-panel'
import FilterPanelRow from '../filter-panel/filter-panel-row'
import FilterPanelColumn from '../filter-panel/filter-panel-column'
import Popup from '../popup'
import ExportPopup from '../exportPopup'
import API from '../api-service'
import ExportService from './export-service'
import {TableHeaderColumn, TableComponent} from '../table'

const getDefaultSelectedFilters = () => {
	return [{
		name: 'dateTimeFrom',
		value: moment().subtract(60, "days").format('DD MMM YYYY HH:mm')
	}, {
		name: 'dateTimeTo',
		value:moment().format('DD MMM YYYY HH:mm')
	}]
}

const doExport = async (format, filters) => {
	const file = ExportService.getFileURL(format, filters)
	if (file) {
		window.open(file, '_blank')
	}
}

export default React.createClass({
	displayName: this.props.pageTitle || 'Page Component',

	getInitialState () {
		this.initPage(this.props)

		return {
			hasData: false,
			exportFormat: 'pdf',
			betTypes: ['football', 'basketball', 'horse-racing'],
			betType: 'football',
			keyword: '',
			selectedKeyword: '',
			originDateRange: {
				dateTimeFrom: moment().subtract(60, "days").format('DD MMM YYYY HH:mm'),
				dateTimeTo: moment().format('DD MMM YYYY HH:mm')
			},
			selectedFilters: getDefaultSelectedFilters(),
			isShowingMoreFilter: false,
			isClickForSearching: false
		}
	},

	initPage: function(props) {
		props.children.map(layer => {
			switch(layer.props.type){
				case 'top':
					this.top = layer;
				break;
				case 'body':
					this.body = <div className='tableComponent-container'>
						<TableComponent data={}} {...props.table}>
							{
								this.cols = []
								this.filterCols = []
								layer.props.children.map(column => {
									this.cols.push(<TableHeaderColumn {...column.props}>{column.props.children}</TableHeaderColumn>)
									if(column.props.isFilter) {
										const title = typeOf column.props.children === 'string' ? column.props.children : column.props.dataField
										if(column.props.dateRange) {
											const filters = [ <FilterPanelColumn filterName={this.props.options.dateRange.fieldFrom}
												filterTitle={this.props.options.dateRange.fieldFromTitle}
												filterValue={}
												ctrlType='calendar'
												isRequired={column.props.isRequired}
												pairingVerify={[{
												operation: '<=',
												partners: [this.props.options.dateRange.fieldTo]
												}]} /> ,
												<FilterPanelColumn filterName={this.props.options.dateRange.fieldTo}
													filterTitle={this.props.options.dateRange.fieldToTitle}
													filterValue={}
													ctrlType='calendar'
													isRequired={column.props.isRequired}
													pairingVerify={[{
														operation: '<=',
														partners: [this.props.options.dateRange.fieldFrom]
													}]} />
											]
											//Added the default date range elements
											filters.map(item => this.filterCols.push(item))

										} else {
											this.filterCols.push(<FilterPanelColumn filterName={column.props.dataField} filterTitle={title} {...column.props.filterOptions} />)
										}
									}
								})
							}
						</TableComponent>
					</div>

				break;
				case 'bottom':
					this.bottom = layer;
				break;
			}
		})	
	},

	componentDidMount: function () {
		let criteriaOption = this.getSearchCriterias()

		// Get Table Data
		API.addChangeListener(this.onChange)
		API.request(this.props.options.table.method, this.props.options.table.endpoint, criteriaOption)

		document.addEventListener('click', this.pageClick, false)
	},

	componentWillUnmount: function () {
		AuditlogStore.removeChangeListener(this.onChange)
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
			selectedFilters: getDefaultSelectedFilters(),
			isShowingMoreFilter: false
		})
	},

	handleKeywordChange: function (event) {
		this.setState({
			keyword: event.target.value
		})
	},

	handleKeywordPress: function (event) {
		if (event.key === 'Enter') {
			this.searchAuditlog()
		}
	},

	removeSearchCriteriaFilter: function (filter) {
		const callback = () => {
			this.setState({
				isShowingMoreFilter: false
			})

			this.searchAuditlog()
		}

		switch (filter.name) {
		case 'keyword':
			this.removeKeywordFilter(filter, callback)
			break
		case 'dateTimeFrom,dateTimeTo':
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
		let originDateRange = this.state.originDateRange

		selectedFilters.forEach((filter) => {
			if (filter.name === 'dateTimeFrom') {
				filter.value = originDateRange.dateTimeFrom
			} else if (filter.name === 'dateTimeTo') {
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

	searchAuditlog: async function () {
		this.setState({
			selectedKeyword: this.state.keyword
		}, function () {
			let criteriaOption = this.getSearchCriterias()

			// Get Table Data
			AuditlogStore.searchAuditlogs(criteriaOption)
		})
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
			this.searchAuditlog()
		})
	},

	checkIsDateRangeNotChanged: function () {
		let filters = this.state.selectedFilters
		let originDateRange = this.state.originDateRange
		let dateTimeFrom
		let dateTimeTo

		for (var i in filters) {
			if (filters[i].name === 'dateTimeFrom') {
				dateTimeFrom = filters[i].value
			} else if (filters[i].name === 'dateTimeTo') {
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
		const filters = AuditlogStore.buildRequest(criteriaOption)

		doExport(this.state.exportFormat, filters)
	},

	onChangeFormat: function (format) {
		this.setState({ exportFormat: format })
	},

	onChange: function () {
		const hasData = AuditlogStore.auditlogs.length > 0
		this.setState({
			auditlogs: AuditlogStore.auditlogs, hasData: hasData
		})
	},

	handleChangePage: function (selectedPageNumber, sortingObject, criteriaOption) {
		AuditlogStore.searchAuditlogs(selectedPageNumber, sortingObject, criteriaOption)
	},

	handleClickSorting: function (selectedPageNumber, sortingObject, criteriaOption) {
		AuditlogStore.searchAuditlogs(selectedPageNumber, sortingObject, criteriaOption)
	},

	generateFilterBlockesJsx: function (filters) {
		const filterDisplayFormatting = (filter) => {
			return filter.name === 'keyword'
				? `${filter.name}: ${filter.value}`
				: filter.value
		}

		let isDateRangeNotChanged = this.checkIsDateRangeNotChanged()
		let keywordFilter = {
			name: 'keyword',
			value: this.state.selectedKeyword
		}
		let dateFromFilter = filters.filter((f) => {
			return f.name === 'dateTimeFrom'
		})[0] || {}
		let dateToFilter = filters.filter((f) => {
			return f.name === 'dateTimeTo'
		})[0] || {}
		let dateRangeFilter = {
			name: 'dateTimeFrom,dateTimeTo',
			value: `${dateFromFilter.value} - ${dateToFilter.value}`
		}
		let filtersArrayWithoutDateRange = filters.filter((f) => {
			if (f.name === 'dateTimeFrom' || f.name === 'dateTimeTo') {
				return false
			}
			return true
		})

		let filtersArray = []
			.concat(this.state.selectedKeyword ? keywordFilter : [])
			.concat(isDateRangeNotChanged ? [] : [dateRangeFilter])
			.concat(filtersArrayWithoutDateRange)

		let filterBlockes = filtersArray.map((f, index) => {
			return <FilterBlock
				key={index}
				dataText={filterDisplayFormatting(f)}
				dataValue={f}
				removeEvent={this.removeSearchCriteriaFilter} />
		}) || []

		return filterBlockes
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
		let filterBlockes = this.generateFilterBlockesJsx(this.state.selectedFilters)
		let moreFilterContianerClassName = ClassNames('more-filter-popup', {
			'active': this.state.isShowingMoreFilter
		})
		
		let activeContent

		if (this.state.betType === 'football') {
			activeContent =
				<div>
					<div className='row'>
						{ this.body }
					</div>
					<div className='row'>
						{ this.bottom }
					</div>
				</div>
		} else {
			activeContent = <div className='nopage'>Coming Soon</div>
		}

		const topClass = this.top.columns ? `col-md-${12 - this.top.columns}` : 'col-md-12'
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
								<div className={betTypesContainerClassName}>
									{betTypes}
								</div>
								<div className='keyword-container'>
									<input type='text' placeholder='Search with keywords & filters'
										value={this.state.keyword}
										onClick={this.showMoreFilter}
										onChange={this.handleKeywordChange}
										onKeyPress={this.handleKeywordPress}
										ref='keyword' />
								</div>
								<div className='filter-block-container'>
									{filterBlockes}
								</div>
							</div>
							<div className={moreFilterContianerClassName} onClick={this.clickForSearching}>
								<FilterPanel
									triggerSearchTopic={}
									resetFiltersTopic={}
									removeOneFilterTopic={}
									onSubmit={this.setFilters}>
										{
											this.generateFilterRows()
										}
								</FilterPanel>
							{ /* 
								Agregue la tabla, el filterPanel y el panel del top
								falta agregar el panel del bottom y verificar que este generando bien
								Enlazar los llamados al API, Los Selects, los eventos del Pub usados por el filterPanel
								Y crear las funciones para recolectar informacion de los componentes. 
							*/ }
							</div>
						</div>
					</div>
				</div>
				{/* Active Content */}
				{ activeContent }
				{/* End Active Content */}
			</div>
			)
	},

	generateFilterRows : function() {
		let rows = []
		const nuRows = Math.Ceil(this.filterCols.length / 4)
		let start = 0

		for (let i = 1; i <= nuRows; i++) {
			rows.push(<FilterPanelRow>{ this.filterCols.slice(start, 4) }</FilterPanelRow>)
			start += 4
		}
		
		return rows
	},

	propTypes: {
		pageTitle: PropTypes.string,
		pageBreadcrum: PropTypes.string,
		pageClassName: PropTypes.string,
		options: {
			table: {
				method: PropTypes.string,
				endpoint: PropTypes.string,
				options: PropTypes.object
			},
			dateRange: {
				active: PropTypes.bool,
				fieldTo: PropTypes.string,
				fieldToTitle: PropTypes.string,
				fieldFrom: PropTypes.string,
				fieldFromTitle: PropTypes.string
			}
		},
		children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
		
	}
})

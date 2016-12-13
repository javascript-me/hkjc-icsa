import React from 'react'
import ExportService from '../auditlog/export-service'
import Popup from '../popup'
import ExportPopup from '../exportPopup'
import NoticeboardService from './noticeboard-service'
import {TableHeaderColumn, TableComponent} from '../table'
import PubSub from '../pubsub'
import SearchEnquiryPanel from '../searchEnquiryPanel/searchEnquiryPanel'
import Moment from 'moment'
import ClassNames from 'classnames'
import FilterPanel from '../filter-panel'
import FilterPanelRow from '../filter-panel/filter-panel-row'
import FilterPanelColumn from '../filter-panel/filter-panel-column'

const getOrginDateTimeFrom = function () {
	let dateTimeFrom = new Date()

	dateTimeFrom.setDate(dateTimeFrom.getDate() - 60)
	dateTimeFrom.setHours(0)
	dateTimeFrom.setMinutes(0)
	dateTimeFrom.setSeconds(0)
	dateTimeFrom.setMilliseconds(0)
	return Moment(dateTimeFrom).format('DD MMM YYYY HH:mm')
}

const getOrginDateTimeTo = function () {
	let dateTimeTo = new Date()

	dateTimeTo.setHours(23)
	dateTimeTo.setMinutes(59)
	dateTimeTo.setSeconds(59)
	dateTimeTo.setMilliseconds(0)
	return Moment(dateTimeTo).format('DD MMM YYYY HH:mm')
}
const doExport = async (format, filters) => {
	const file = ExportService.getNoticeboardFileURL(format, filters)
	if (file) {
		window.open(file, '_blank')
	}
}
export default React.createClass({
	propTypes: {
		someThing: React.PropTypes.bool
	},

	getInitialState () {
		let originDateTimeFrom = getOrginDateTimeFrom()
		let originDateTimeTo = getOrginDateTimeTo()
		return {
			data: [],
			pageTitle: 'Home \\ Global Tools & Adminstration \\ Communication ',
			exportFormat: 'pdf',
			keyword: '',
			isShowingMoreFilter: false,
			isClickForSearching: false,
			tokens: {
				NOTICEBOARD_SEARCH_BY_KEY_PRESS: 'NOTICEBOARD_SEARCH_BY_KEY_PRESS',
				NOTICEBOARD_SEARCH: 'NOTICEBOARD_SEARCH'
			},
			selectedFilters: [{
				name: 'dateTimeFrom',
				value: originDateTimeFrom
			}, {
				name: 'dateTimeTo',
				value: originDateTimeTo
			}],
			tableOptions: {
				defaultSortName: 'priority',  // default sort column name
				defaultSortOrder: 'desc', // default sort order
				hideSizePerPage: true,
				paginationClassContainer: 'text-center'
			},
			noticesList: [],
			categoriesList: [],
			competitionsList:[],
			continentsList:[],
			countriesList:[],
			inplaysList:[],
			matchesList:[],
			prioritiesList:[],
			sportsList:[],
			statusesList:[]
		}


	},
	componentDidMount: function async() {
		NoticeboardService.filterNoticeBoardTableData()
		NoticeboardService.addChangeListener(this.onChange)
		/*Testing purpose*/
		NoticeboardService.getAllCategories()
		NoticeboardService.getAllCompetitions()
		NoticeboardService.getAllContinents()
		NoticeboardService.getAllCountries()
		NoticeboardService.getAllInplays()
		NoticeboardService.getAllMatches()
		NoticeboardService.getAllPriorities()
		NoticeboardService.getAllSports()
		NoticeboardService.getAllStatuses()
		NoticeboardService.addChangeListener(this.onChange)
		document.addEventListener('click', this.pageClick, false)
	},
	pageClick: function (event) {
		if (!this.state.isShowingMoreFilter || this.state.isClickForSearching) {
			this.setState({isClickForSearching: false})
			return
		}

		this.hideMoreFilter()
	},
	componentWillUnmount: function () {
		NoticeboardService.removeChangeListener(this.onChange.bind(this))
		document.removeEventListener('click', this.pageClick, false)
	},
	onChange () {
		this.setState({noticesList: NoticeboardService.noticesList})
	},
	openPopup () {
		this.setState({ exportFormat: 'pdf' })// reset the format value
		this.refs.exportPopup.show()
	},

	export () {
		const filters ={ username: "allgood", selectedPageNumber: 1, sortingObjectFieldName: "date_time", sortingObjectOrder: "DESCEND", betType: "football", keyword: "", dateTimeFrom: "09 Oct 2016 00:00", dateTimeTo: "08 Dec 2016 23:59" }
		doExport(this.state.exportFormat, filters)
		},

	onChangeFormat (format) {
		this.setState({ exportFormat: format })
	},
	showMoreFilter: function (event) {
		this.clickForSearching()

		this.setState({
			isShowingMoreFilter: true
		})
	},
	clickForSearching: function () {
		this.setState({
			isClickForSearching: true
		})
	},
	handleKeywordChange: function (event) {
		var newKeyword = event.target.value

		this.setState({
			keyword: newKeyword
		})
	},

	handleKeywordPress: function (event) {
		if (event.key === 'Enter') {
			PubSub.publish(PubSub[this.state.tokens.NOTICEBOARD_SEARCH_BY_KEY_PRESS])
		}
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
			PubSub.publish(PubSub[this.state.tokens.NOTICEBOARD_SEARCH])
		})
	},
	handleChange (name, value) {
		console.log('In Auditlog change', name, value)
	},

	handleFilterReset: function() {
		console.log('in auditlog reset')
	},
	handleFilterSubmit: function(filters) {
		console.log('in auditlog submit', filters)
	},
	statusFormatter(cell, row) {
		if (cell === 'Acknowledged')  return '<img src="notice-board/Tick.svg" />'
		return '<img src="notice-board/Mail.svg" />'
	},
	priorityFormatter(cell, row) {
		if (cell === 'Critical') return '<img src="notice-board/Critical.svg" />'
		if (cell === 'High') return '<img src="notice-board/High.svg" />'
		if (cell === 'Medium') return '<img src="notice-board/Medium.svg" />'
		if (cell === 'Low') return '<img src="notice-board/Low.svg" />'
	},
	detailFormatter(cell, row){
		console.log(cell)
		if (row.priority === 'Critical') return  <span className='critical-message-detail'>{cell}</span>
		return cell
	},

	render () {
		let moreFilterContianerClassName = ClassNames('more-filter-popup', {
			'active': this.state.isShowingMoreFilter
		})
		return (

			<div className='conatainer-alert '>
				<div className='row page-header'>
					<p className='hkjc-breadcrumb'>{this.state.pageTitle}</p>
					<h1>Noticeboard Monitor</h1>
				</div>
				<div className='row page-content'>
					{/* Search Critiria Row */}
					<div className='col-md-12'>
						<div className='search-criteria-container'>
							<div className='search-criteria-container-row'>
								<div className='keyword-container'>
									<input type='text' placeholder='Search with keywords & filters'
										   value={this.state.keyword}
										   onClick={this.showMoreFilter}
										   onChange={this.handleKeywordChange}
										   onKeyPress={this.handleKeywordPress}
										   ref='keyword' />
								</div>
								{/*<div className='filter-block-container'>
									{filterBlockes}
								</div>*/}
							</div>
							<div className={moreFilterContianerClassName} onClick={this.clickForSearching}>
								<FilterPanel onReset={this.handleFilterReset} onSubmit={this.handleFilterSubmit}>
									<FilterPanelRow>
										{/*<FilterPanelColumn filterName="alertName" filterTitle="Alert Name" onChange={this.handleChange}>
										</FilterPanelColumn>*/}
										<FilterPanelColumn filterName="priority" filterTitle="Priority" ctrlType="select" dataSource={NoticeboardService.prioritiesList} onChange={this.handleChange}>
										</FilterPanelColumn>
										<FilterPanelColumn filterName="distributionDateTimeFrom" filterTitle="Distribution Date & Time From" filterValue="08 Dec 2016 23:59" ctrlType="calendar" onChange={this.handleChange}>
										</FilterPanelColumn>
										<FilterPanelColumn filterName="distributionDateTimeTo" filterTitle="Distribution Date & Time To" filterValue="08 Dec 2016 23:59" ctrlType="calendar" onChange={this.handleChange}>
										</FilterPanelColumn>
										<FilterPanelColumn filterName="sportsType" filterTitle="Sports Type" ctrlType="select" dataSource={NoticeboardService.sportsList} onChange={this.handleChange}>
										</FilterPanelColumn>
										<FilterPanelColumn filterName="competition" filterTitle="Competition" ctrlType="select" dataSource={NoticeboardService.competitionsList} onChange={this.handleChange}>
										</FilterPanelColumn>
										<FilterPanelColumn filterName="match" filterTitle="Match (Race for HR)" ctrlType="select" dataSource={NoticeboardService.matchesList} onChange={this.handleChange}>
										</FilterPanelColumn>
										<FilterPanelColumn filterName="inPlay" filterTitle="In-Play" ctrlType="select" dataSource={NoticeboardService.inplaysList} onChange={this.handleChange}>
										</FilterPanelColumn>
										<FilterPanelColumn filterName="continent" filterTitle="Continent" ctrlType="select" dataSource={NoticeboardService.continentsList} onChange={this.handleChange}>
										</FilterPanelColumn>
										<FilterPanelColumn filterName="country" filterTitle="Country" ctrlType="select" dataSource={NoticeboardService.countriesList} onChange={this.handleChange}>
										</FilterPanelColumn>
										<FilterPanelColumn filterName="messageCategory" filterTitle="Category" ctrlType="select" dataSource={NoticeboardService.categoriesList} onChange={this.handleChange}>
										</FilterPanelColumn>
										<FilterPanelColumn filterName="alertStatus" filterTitle="Alert Status" ctrlType="select" dataSource={NoticeboardService.statusesList} onChange={this.handleChange}>
										</FilterPanelColumn>
									</FilterPanelRow>
								</FilterPanel>
							</div>
						</div>
					</div>
				</div>
				<div>
					<div className='tableComponent-container'>
						<TableComponent data={ NoticeboardService.noticesList } pagination={true} options={this.state.tableOptions}
										striped={true} keyField='id' tableHeaderClass="table-header" tableContainerClass='base-table'>
							<TableHeaderColumn dataField='id' autoValue hidden>ID</TableHeaderColumn>
							<TableHeaderColumn dataField='priority' dataSort={true} dataFormat={ this.priorityFormatter }>Priority</TableHeaderColumn>
							<TableHeaderColumn dataField='system_distribution_time' dataSort={true}> Distribution Date & Time</TableHeaderColumn>
							<TableHeaderColumn dataField='alert_status' dataSort={true} dataFormat={ this.statusFormatter }>Status</TableHeaderColumn>
							<TableHeaderColumn dataField='message_category' dataSort={true}>Category</TableHeaderColumn>
							<TableHeaderColumn dataField='alert_name' dataSort={true}>Name</TableHeaderColumn>
							<TableHeaderColumn dataField='message_detail' dataSort={true} dataFormat={ this.detailFormatter }>Detail</TableHeaderColumn>
							<TableHeaderColumn dataField='recipient' dataSort={true}>Recipient</TableHeaderColumn>
						</TableComponent>
					</div>
					<div className='vertical-gap'>
						<div className='pull-right'>
							<button className='btn btn-primary pull-right' onClick={this.openPopup}>Export</button>
							<Popup hideOnOverlayClicked ref='exportPopup' title='Noticeboard Export' onConfirm={this.export} >
								<ExportPopup onChange={this.onChangeFormat} />
							</Popup>
							{/*Export popup will go here...*/}
						</div>
					</div>
				</div>
			</div>

		)
	}
})

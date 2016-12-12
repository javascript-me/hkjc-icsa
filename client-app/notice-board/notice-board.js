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
			pageTitle: 'Home \\ Global Tools & Adminstration \\ Communication \\ Noticeboard',
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
				defaultSortName: 'Alert Status',  // default sort column name
				defaultSortOrder: 'desc', // default sort order
				hideSizePerPage: true,
				paginationSize: 7,
				paginationClassContainer: 'text-center'
			},
			noticesList: []
		}


	},
	componentDidMount: function async() {
		NoticeboardService.filterNoticeBoardTableData()
		NoticeboardService.addChangeListener(this.onChange)
		/*Testing purpose*/
		NoticeboardService.getAllCategories()
		NoticeboardService.addChangeListener(this.onChange)

	},
	componentWillUnmount: function () {
		NoticeboardService.removeChangeListener(this.onChange.bind(this))
		document.removeEventListener('click', this.pageClick, false)
	},
	pageClick: function (event) {

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



	render () {
		let moreFilterContianerClassName = ClassNames('more-filter-popup', {
			'active': this.state.isShowingMoreFilter
		})
		return (

			<div className='conatainer-alert '>
				<div className='row page-header'>
					<p className='hkjc-breadcrumb'>{this.state.pageTitle}</p>
					<h1>Noticeboard</h1>
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
								<SearchEnquiryPanel setFilterEvent={this.setFilters} />
							</div>
						</div>
					</div>
				</div>
				<div>
					<div className='table-container '>
						<TableComponent data={ NoticeboardService.noticesList } pagination={true} options={this.state.tableOptions} striped={true} keyField='id' tableHeaderClass="table-header" tableContainerClass="auditlog-table">
							<TableHeaderColumn dataField='id' autoValue hidden>ID</TableHeaderColumn>
							<TableHeaderColumn dataField='alert_status' dataSort={true}>Alert Status</TableHeaderColumn>
							<TableHeaderColumn dataField='system_distribution_time' dataSort={true}>System Distribution Time</TableHeaderColumn>
							<TableHeaderColumn dataField='message_category' dataSort={true}>Message Category</TableHeaderColumn>
							<TableHeaderColumn dataField='recipient' dataSort={true}>Recipient</TableHeaderColumn>
							<TableHeaderColumn dataField='alert_name' dataSort={true}>Alert Name</TableHeaderColumn>
							<TableHeaderColumn dataField='priority' dataSort={true}>Priority</TableHeaderColumn>
							<TableHeaderColumn dataField='message_detail' dataSort={true}>Message Detail</TableHeaderColumn>
							<TableHeaderColumn dataField='assignee' dataSort={true}>Assignee</TableHeaderColumn>
						</TableComponent>
					</div>
					<div className='vertical-gap'>
						<div className='pull-right'>
							<button className='btn btn-primary pull-right' onClick={this.openPopup}>Export</button>
							<Popup hideOnOverlayClicked ref='exportPopup' title='Audit Trail Export' onConfirm={this.export} >
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

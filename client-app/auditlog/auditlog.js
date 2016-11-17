import React from 'react'
import ReactDOM from 'react-dom'
import Moment from 'moment'
import Calendar from 'rc-calendar'
import { hashHistory } from 'react-router'
import ClassNames from 'classnames'
import PubSub from '../pubsub'
import BetType from './betType'
import FilterBlock from './filterBlock'
import SearchEnquiryPanel from '../searchEnquiryPanel/searchEnquiryPanel'
import Paging from '../paging/paging'
import Popup from '../popup'
import ExportPopup from '../exportPopup'
import TabularData from '../tabulardata/tabulardata'
import AuditlogStore from './auditlog-store'
import ExportService from './export-service'
import AuditlogService from './auditlog-service'

const doExport = async (format) => {
	const file = ExportService.getFileURL(format, [])
	if (file) {
		window.open(file, '_blank')
	}
}

let token = null
let DEFAULT_BET_TYPE = 'football'

export default React.createClass({
	displayName: 'Audit',
	getInitialState () {
		return {
			data: [],
			filters: [],
			hasData: false,
			exportFormat: 'pdf',
			tokens: {
				AUDITLOG_SEARCH: 'AUDITLOG_SEARCH',
				AUDITLOG_SEARCH_BY_KEY_PRESS: 'AUDITLOG_SEARCH_BY_KEY_PRESS'
			},
			betTypes: ['football', 'basketball', 'horse-racing'],
			betType: DEFAULT_BET_TYPE,
			keyword: '',
			originDateRange: {},
			selectedFilters: [],
			isShowingMoreFilter: false,
			isClickInMoreFilters: false
		}
	},
	componentDidMount: function () {
		let sortingObject = {fieldName: 'date_time', order: 'DESCEND'}
		let criteriaOption = this.getSearchCriterias()

        // Get Table Data
        AuditlogStore.searchAuditlogs(1, sortingObject, criteriaOption);

		token = PubSub.subscribe(PubSub[this.state.tokens.AUDITLOG_SEARCH], () => {
			this.searchAuditlog()
		})

		document.addEventListener('click', this.pageClick, false)
	},

	componentWillUnmount: function () {
		PubSub.unsubscribe(token)

		document.removeEventListener('click', this.pageClick, false)
	},

	pageClick: function (event) {
		let keywordTag = this.refs.keyword,
			keywordElement = ReactDOM.findDOMNode(keywordTag),
			isInsideKeywordElement = keywordElement && keywordElement.contains(event.target),
			isInside = isInsideKeywordElement || this.state.isClickInMoreFilters

		if (!this.state.isShowingMoreFilter || isInside) {
			this.setState({isClickInMoreFilters: false})
			return
		}

		this.hideMoreFilter()
	},

	getSearchCriterias: function () {
		return {
			betType: this.state.betType,
			keyword: this.state.keyword,
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
			selectedFilters: [],
			isShowingMoreFilter: false
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
			PubSub.publish(PubSub[this.state.tokens.AUDITLOG_SEARCH_BY_KEY_PRESS])
		}
	},

	removeSearchCriteriaFilter: function (filter) {
  		let selectedFilters = this.state.selectedFilters,
  			 filterIndex = selectedFilters.indexOf(filter)

  		selectedFilters.splice(filterIndex, 1)

  		this.setState({
    			selectedFilters: selectedFilters,
    			isShowingMoreFilter: false
  		}, ()=> {
          PubSub.publish(PubSub[this.state.tokens.AUDITLOG_SEARCH])
      })
	},

	searchAuditlog: async function () {
		let sortingObject = {fieldName: 'date_time', order: 'DESCEND'}
		let criteriaOption = this.getSearchCriterias()

        // Get Table Data
		AuditlogStore.searchAuditlogs(1, sortingObject, criteriaOption)
	},

	clickInMoreFilters: function () {
		this.setState({
			isClickInMoreFilters: true
		})
	},

	showMoreFilter: function (event) {
		this.setState({
			isShowingMoreFilter: true
		})
	},

	hideMoreFilter: function () {
		this.setState({
			isShowingMoreFilter: false
		})
	},

	setFilters: function (filters, originDateRange) {
		this.hideMoreFilter()

		let newFilters = []

		for (let attr in filters) {
			newFilters.push({
				'name': attr,
				'value': filters[attr]
			})
		}

		this.setState({
			selectedFilters: newFilters,
			originDateRange: originDateRange
		}, () => {
			PubSub.publish(PubSub[this.state.tokens.AUDITLOG_SEARCH])
		})
	},

  checkIsDateRangeChanged: function () {
      let filters = this.state.selectedFilters,
          originDateRange = this.state.originDateRange,
          dateTimeFrom, dateTimeTo;

      for(var i in filters) {
          if(filters[i].name === 'dateTimeFrom') {
              dateTimeFrom = filters[i].value;
          } else if(filters[i].name === 'dateTimeTo') {
              dateTimeTo = filters[i].value;
          }
      }

      return dateTimeFrom === originDateRange.dateTimeFrom && dateTimeTo === originDateRange.dateTimeTo;
  },

    // function to mock the event of loading data from the table
	mockLoadData: function () {
		this.setState({hasData: true})
	},
	openPopup () {
		this.setState({ exportFormat: 'pdf' })// reset the format value
		this.state.hasData ? this.refs.exportPopup.show() : null
	},
	export () {
		doExport(this.state.exportFormat)
	},
	onChangeFormat (format) {
		this.setState({ exportFormat: format })
	},
	render: function () {
		let betTypesContainerClassName = ClassNames('bet-types', {
				'hover-enabled': !this.state.isShowingMoreFilter
			}),
			betTypes = this.state.betTypes.map((betType, index) => {
				return <BetType
					key={index}
					selectedBetType={this.state.betType}
					betType={betType}
					changeBetTypeEvent={this.changeBetType}
					changeEventTopic={this.state.tokens.AUDITLOG_SEARCH} />
			}),
      isDateRangeChanged = this.checkIsDateRangeChanged(),

			filterBlockes = this.state.selectedFilters.filter((f) => {
				if ((f.name === 'dateTimeFrom' || f.name === 'dateTimeTo') && isDateRangeChanged) {
					return false
				}
				return true
			}).map((f, index) => {
				return <FilterBlock
					key={index}
					filter={f}
					removeEvent={this.removeSearchCriteriaFilter}
					removeEventTopic={this.state.tokens.AUDITLOG_SEARCH} />
			}),

			moreFilterContianerClassName = ClassNames('more-filter-popup', {
				'active': this.state.isShowingMoreFilter
			})
		return (
              <div className='auditlog'>
                    <div className='row page-header'>
                        <p className='hkjc-breadcrumb'>
                            Home \ Tool & Adminstration \ Audit
                        </p>
                        <h1>Audit Trail</h1>
                    </div>
                    <div className='row page-content'>
                        <div className='col-md-6'>
                            <Calendar className='hidden' />
                        </div>
                        {/* Search Critiria Row */}
                        <div className='col-md-12'>
                          <div className='search-criteria-container'>
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
                            <div className={moreFilterContianerClassName} onClick={this.clickInMoreFilters}>
                              <SearchEnquiryPanel setFilterEvent={this.setFilters} />
                            </div>
                          </div>
                        </div>
                    </div>
                    {/* Search Result */}
                    <div className='table-container '>
                      {this.state.betType === 'football' ? <TabularData /> : <div className='nodata'>Coming Soon</div>}
                    </div>
                    <Paging />
                    {/* START FOOTER EXPORT */}
                    <div className='col-md-12'>
                        <div className='pull-right'>
                            <button className={this.state.hasData ? 'btn btn-primary' : 'btn btn-primary disabled'} onClick={this.openPopup}>Export</button>
                            <button className='btn btn-primary' onClick={this.mockLoadData}>Mock Load Data</button>
                            <Popup hideOnOverlayClicked ref='exportPopup' title='Audit Trail Export' onConfirm={this.export} >
                                <ExportPopup onChange={this.onChangeFormat} />
                            </Popup>
                        </div>
                    </div>
                    {/* END FOOTER EXPORT */}
              </div>
            )
	}
})

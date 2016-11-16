
﻿import React from 'react';
import ReactDOM from 'react-dom';
import Calendar from 'rc-calendar';
import { hashHistory } from 'react-router';
import ClassNames from 'classnames';
import PubSub from '../pubsub';
import BetType from './betType';
import FilterBlock from './filterBlock';
import SearchEnquiryPanel from '../searchEnquiryPanel/searchEnquiryPanel';
import Paging from '../paging/paging'
import Popup from '../popup'
import ExportPopup from '../exportPopup'
import AuditlogStore from './auditlog-store';
import ExportService from './export-service';
import AuditlogService from './auditlog-service';
import TabularData from '../tabulardata/tabulardata';


const doExport = async (format) => {
	const file = ExportService.getFileURL(format, [])
	if (file) {
		window.open(file, '_blank')
	}
}

export default React.createClass({
    displayName: 'Audit',
    getInitialState () {

      var sortingObject = {fieldName: "date_time", order: "NO_ORDER"}
      AuditlogStore.getDataByPageNumber(1, sortingObject)

      return {
        data: [],
        exportFormat: 'pdf',
        filters: [],
        hasData: false,
        tokens: {
            AUDITLOG_SEARCH: 'AUDITLOG_SEARCH',
            AUDITLOG_BET_TYPE_CHANGE: 'AUDITLOG_BET_TYPE_CHANGE',
            AUDITLOG_REMOVE_FILTER: 'AUDITLOG_REMOVE_FILTER'
          },
          betTypes: ['football', 'basketball', 'horse-racing'],
          betType: 'football',
          selectedFilters: [{
            'name': 'Type',
            'value': 'Some Type'
          }, {
            'name': 'Date To',
            'value': 'Some day'
          }],
          showMoreFilter: false,
          isClickInMoreFilters: false
      };
    },
    componentDidMount: function () {
        document.addEventListener('click', this.pageClick, false);
    },

    componentWillUnmount: function () {
        PubSub.unsubscribe(AUDITLOG_BET_TYPE_CHANGE);

        document.removeEventListener('click', this.pageClick, false);
    },

    pageClick: function(event) {
        let keywordTag = this.refs.keyword,
            keywordElement = ReactDOM.findDOMNode(keywordTag), 
            isInsideKeywordElement = keywordElement && keywordElement.contains(event.target),
            isInside = isInsideKeywordElement || this.state.isClickInMoreFilters;

        if(!this.state.showMoreFilter || isInside) {
            this.setState({isClickInMoreFilters:false});
            return;
        }

        this.hideMoreFilter();
    },

    getBetTypeIconClassName: function(betType) {
      return ClassNames(
        'bet-type',
        'icon-' + betType,
        {
          'active': this.state.betType === betType
        });
    },

    changeBetType: function(betType) {
      this.setState({
          betType: betType,
          showMoreFilter: false
      });
    },

    removeSearchCriteriaFilter: function(filter) {
        let selectedFilters = this.state.selectedFilters,
          filterIndex = selectedFilters.indexOf(filter);

        selectedFilters.splice(filterIndex, 1);
        this.setState({
          selectedFilters: selectedFilters,
          showMoreFilter: false
        });
    },

    setFilters: function(filters) {
        this.setState({
          selectedFilters: filters
        });
    },

    resetFilters: function() {
        this.setState({
          selectedFilters: []
        });
    },

    searchAuditlog: async function(filters) {
        this.setFilters(filters);
        this.hideMoreFilter();
        await AuditlogService.postSearchCriteria();
    },

    clickInMoreFilters: function() {
        this.setState({
          isClickInMoreFilters: true
        });
    },

    showMoreFilter: function(event) {
        event.stopPropagation()

        this.setState({
            showMoreFilter: true
        });
    },

    hideMoreFilter: function() {
        this.setState({
            showMoreFilter: false
        });
    },

    setFilters: function(filters, hidePopup) {
        if(hidePopup) {
            this.hideMoreFilter();
        }

    },

    //function to mock the event of loading data from the table
    mockLoadData: function() {
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
    render: function() {
      let me = this,
        betTypes = this.state.betTypes.map((betType, index) => {
          return <BetType
            key={index}
            selectedBetType={me.state.betType}
            betType={betType}
            changeBetTypeEvent={me.changeBetType}
            changeEventTopic={me.state.tokens.AUDITLOG_SEARCH} />;
        }),

        filterBlockes = this.state.selectedFilters.map((f, index)=>{
          return <FilterBlock
            key={index}
            filter={f}
            removeEvent={me.removeSearchCriteriaFilter}
            removeEventTopic={me.state.tokens.AUDITLOG_SEARCH}/>;
        }),

        keywordContainerClassName = ClassNames(
        'keyword-container', {
            'active': this.state.showMoreFilter
        }),

        moreFilterContianerClassName = ClassNames('more-filter-popup', {
            'active': this.state.showMoreFilter
        });

		return (
            <div className='contianer auditlog'>
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
                        <div className='bet-types'>
                          {betTypes}
                        </div>
                        <div className={keywordContainerClassName}>
                          <input type="text" placeholder="Search with keywords & filters" onClick={this.showMoreFilter} ref="keyword" />
                        </div>
                        <div className='filter-block-container'>
                          {filterBlockes}
                        </div> 
                        <div className={moreFilterContianerClassName} onClick={this.clickInMoreFilters}>
                          <SearchEnquiryPanel setFilterEvent={this.setFilters}/>
                        </div>
                      </div>
                    </div>
                    {/* Search Result */}
                    <div className='table-container col-xs-12'>
                      <TabularData/>
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
            </div>
        )
	}
})

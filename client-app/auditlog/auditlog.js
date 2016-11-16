import React from 'react';
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
import TabularData from '../tabulardata/tabulardata'

import AuditlogStore from './auditlog-store';
import ExportService from './export-service';
import AuditlogService from './auditlog-service';

const doExport = async (format) => {
    const file = ExportService.getFileURL(format, [])
    if (file) {
        window.open(file, "_blank");
    }
}

let token = null;

export default React.createClass({
    displayName: 'Audit',
    getInitialState () {

      var sortingObject = {fieldName: "date_time", order: "NO_ORDER"}
      AuditlogStore.getDataByPageNumber(1, sortingObject)

      return {
          data: [],
          filters: [],
          hasData: false,
          tokens: {
            AUDITLOG_SEARCH: 'AUDITLOG_SEARCH',
            AUDITLOG_SEARCH_BY_KEY_PRESS: 'AUDITLOG_SEARCH_BY_KEY_PRESS'
          },
          betTypes: ['football', 'basketball', 'horse-racing'],
          betType: 'football',
          keyword: '',
          selectedFilters: [],
          showMoreFilter: false,
          isClickInMoreFilters: false
      };
    },
    componentDidMount: function () {
        token = PubSub.subscribe(PubSub[this.state.tokens.AUDITLOG_SEARCH], () => {
            console.log('AUDITLOG_SEARCH');
            this.searchAuditlog(this.state.betType, this.state.keyword, this.state.selectedFilters);
        });

        document.addEventListener('click', this.pageClick, false);
    },

    componentWillUnmount: function () {
        PubSub.unsubscribe(token);

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
          keyword: '',
          selectedFilters: [],
          showMoreFilter: false
      });
    },

    handleKeywordChange: function (event) {
        var newKeyword = event.target.value;

        this.setState({
            keyword: newKeyword
        });
    },

    handleKeywordPress: function(event) {
        if (event.key === 'Enter') {
            PubSub.publish(PubSub[this.state.tokens.AUDITLOG_SEARCH_BY_KEY_PRESS]);
        }
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

    searchAuditlog: async function(betType, keyword, filters, pagination, sorting) {
        AuditlogService.doFilter();
    },

    clickInMoreFilters: function() {
        this.setState({
          isClickInMoreFilters: true
        });
    },

    showMoreFilter: function(event) {
        this.setState({
            showMoreFilter: true
        });
    },

    hideMoreFilter: function() {
        this.setState({
            showMoreFilter: false
        });
    },

    setFilters: function(filters) {
        this.hideMoreFilter();

        let newFilters = [];

        for(let attr in filters) {
            newFilters.push({
                'name': attr,
                'value': filters[attr]
            });
        }

        this.setState({
            selectedFilters: newFilters
        }, () => {
            PubSub.publish(PubSub[this.state.tokens.AUDITLOG_SEARCH]);
        });
    },

    //function to mock the event of loading data from the table
    mockLoadData: function() {
      this.setState({hasData: true})
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

            filterBlockes = this.state.selectedFilters.filter((f) => {
                return f.name !== 'dateTimeFrom' && f.name !=='dateTimeTo'
            }).map((f, index) => {
                return <FilterBlock
                    key={index}
                    filter={f}
                    removeEvent={me.removeSearchCriteriaFilter}
                    removeEventTopic={me.state.tokens.AUDITLOG_SEARCH}/>;
            }),

            moreFilterContianerClassName = ClassNames('more-filter-popup', {
                'active': this.state.showMoreFilter
            });

            return (
                <div className="auditlog">
                    <div className="row page-header">
                        <p className="hkjc-breadcrumb">
                            Home \ Tool & Adminstration \ Audit
                        </p>
                        <h1>Audit Trail</h1>
                    </div>
                    <div className='row page-content'>
                        <div className='col-md-6'>
                            <Calendar className='hidden' />
                        </div>
                        {/* Search Critiria Row */}
                        <div className="col-md-12">
                          <div className="search-criteria-container">
                            <div className="bet-types">
                              {betTypes}
                            </div>
                            <div className="keyword-container">
                              <input type="text" placeholder="Search with keywords & filters" 
                                value={this.state.keyword} 
                                onClick={this.showMoreFilter} 
                                onChange={this.handleKeywordChange}
                                onKeyPress={this.handleKeywordPress}
                                ref="keyword" />
                            </div>
                            <div className="filter-block-container">
                              {filterBlockes}
                            </div> 
                            <div className={moreFilterContianerClassName} onClick={this.clickInMoreFilters}>
                              <SearchEnquiryPanel setFilterEvent={this.setFilters}/>
                            </div>
                          </div>
                        </div>
                    </div>
                    {/* Search Result */}
                    <div className='table-container col-xs-12'>
                      <TabularData/>
                    </div>
                    <Paging />
                    {/* START FOOTER EXPORT */}
                    <div className="col-md-12">
                        <div className="pull-right">
                            <button className={this.state.hasData ? 'btn btn-primary' : 'btn btn-primary disabled'} onClick={() => this.state.hasData ? this.refs.exportPopup.show() : null }>Export</button>
                            <button className='btn btn-primary' onClick={this.mockLoadData}>Mock Load Data</button>
                            <Popup hideOnOverlayClicked ref="exportPopup" title="Export as ...">
                                <div className="export-content">
                                <div className="row">
                                    <div className="col-md-4 col-md-offset-2">
                                        <button className="btn btn-primary btn-block" onClick={() =>{ doExport('PDF'); this.refs.exportPopup.hide() } }>PDF</button>
                                   </div>
                                    <div className="col-md-4">
                                        <button className="btn btn-primary btn-block" onClick={() =>{ doExport('CSV'); this.refs.exportPopup.hide() } }>CSV</button>
                                    </div>
                                </div></div>
                            </Popup>
                        </div>
                        {/* END FOOTER EXPORT */}
                        <button onClick={this.showPageData}>forDebug</button>                    
                    </div>
                    {/* END FOOTER EXPORT */}
                </div>
            );
    }
});

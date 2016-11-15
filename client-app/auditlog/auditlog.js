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

import AuditlogStore from './auditlog-store';
import ExportService from './export-service';
import AuditlogService from './auditlog-service';

const doExport = async (format) => {
    const file = ExportService.getFileURL(format, [])
    if (file) {
        window.open(file, "_blank");
    }
}

export default React.createClass({
    displayName: 'Audit',
    getInitialState () {
      return {
        data: [],
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

    showPageData: function() {
        console.log(JSON.stringify(AuditlogStore.pageData, null, 4))
        console.log(JSON.stringify(AuditlogService.doFilter([], "")))
        
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
            <div className="contianer auditlog">
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
                        <div className={keywordContainerClassName}>
                          <input type="text" placeholder="Search with keywords & filters" onClick={this.showMoreFilter} ref="keyword" />
                        </div>
                        <div className="filter-block-container">
                          {filterBlockes}
                        </div> 
                        <div className={moreFilterContianerClassName} onClick={this.clickInMoreFilters}>
                          <SearchEnquiryPanel setFilterEvent={this.setFilters}/>
                        </div>
                      </div>
                    </div>
                    {/* Search Result */}
                    <div className='col-xs-12'>
                        <table className='table table-striped auditlog-table'>
                          <thead className='table-header'>
                            <tr>
                              <th>Date/Time</th>
                              <th>User ID</th>
                              <th>User Name</th>
                              <th>Type</th>
                               <th>Function/Module</th>
                              <th>Function Event Detail</th>
                              <th>User Role</th>
                              <th>IP Address</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>23 September 2016 19:12:01</td>
                              <td>Mark</td>
                              <td>Otto</td>
                              <td>@mdo</td>
                              <td>23 September 2016 19:12:01</td>
                              <td>Mark</td>
                              <td>Otto</td>
                              <td>@mdo</td>
                            </tr>
                            <tr>
                              <td>23 September 2016 19:12:01</td>
                              <td>Jacob</td>
                              <td>Thornton</td>
                              <td>@fat</td>
                              <td>23 September 2016 19:12:01</td>
                              <td>Mark</td>
                              <td>Otto</td>
                              <td>@mdo</td>
                            </tr>
                            <tr>
                             <td>23 September 2016 19:12:01</td>
                              <td>Larry</td>
                              <td>the Bird</td>
                              <td>@twitter</td>
                              <td>23 September 2016 19:12:01</td>
                              <td>Mark</td>
                              <td>Otto</td>
                              <td>@mdo</td>
                            </tr>
                             <tr>
                             <td>23 September 2016 19:12:01</td>
                              <td>Larry</td>
                              <td>the Bird</td>
                              <td>@twitter</td>
                              <td>23 September 2016 19:12:01</td>
                              <td>Mark</td>
                              <td>Otto</td>
                              <td>@mdo</td>
                            </tr>
                             <tr>
                             <td>23 September 2016 19:12:01</td>
                              <td>Larry</td>
                              <td>the Bird</td>
                              <td>@twitter</td>
                              <td>23 September 2016 19:12:01</td>
                              <td>Mark</td>
                              <td>Otto</td>
                              <td>@mdo</td>
                            </tr>
                             <tr>
                             <td>23 September 2016 19:12:01</td>
                              <td>Larry</td>
                              <td>the Bird</td>
                              <td>@twitter</td>
                              <td>23 September 2016 19:12:01</td>
                              <td>Mark</td>
                              <td>Otto</td>
                              <td>@mdo</td>
                            </tr>
                             <tr>
                             <td>23 September 2016 19:12:01</td>
                              <td>Larry</td>
                              <td>the Bird</td>
                              <td>@twitter</td>
                              <td>23 September 2016 19:12:01</td>
                              <td>Mark</td>
                              <td>Otto</td>
                              <td>@mdo</td>
                            </tr>
                             <tr>
                             <td>23 September 2016 19:12:01</td>
                              <td>Larry</td>
                              <td>the Bird</td>
                              <td>@twitter</td>
                              <td>23 September 2016 19:12:01</td>
                              <td>Mark</td>
                              <td>Otto</td>
                              <td>@mdo</td>
                            </tr>
                             <tr>
                             <td>23 September 2016 19:12:01</td>
                              <td>Larry</td>
                              <td>the Bird</td>
                              <td>@twitter</td>
                              <td>23 September 2016 19:12:01</td>
                              <td>Mark</td>
                              <td>Otto</td>
                              <td>@mdo</td>
                            </tr>
                             <tr>
                             <td>23 September 2016 19:12:01</td>
                              <td>Larry</td>
                              <td>the Bird</td>
                              <td>@twitter</td>
                              <td>23 September 2016 19:12:01</td>
                              <td>Mark</td>
                              <td>Otto</td>
                              <td>@mdo</td>
                            </tr>
                             <tr>
                             <td>23 September 2016 19:12:01</td>
                              <td>Larry</td>
                              <td>the Bird</td>
                              <td>@twitter</td>
                              <td>23 September 2016 19:12:01</td>
                              <td>Mark</td>
                              <td>Otto</td>
                              <td>@mdo</td>
                            </tr>
                             <tr>
                             <td>23 September 2016 19:12:01</td>
                              <td>Larry</td>
                              <td>the Bird</td>
                              <td>@twitter</td>
                              <td>23 September 2016 19:12:01</td>
                              <td>Mark</td>
                              <td>Otto</td>
                              <td>@mdo</td>
                            </tr>
                             <tr>
                             <td>23 September 2016 19:12:01</td>
                              <td>Larry</td>
                              <td>the Bird</td>
                              <td>@twitter</td>
                              <td>23 September 2016 19:12:01</td>
                              <td>Mark</td>
                              <td>Otto</td>
                              <td>@mdo</td>
                            </tr>
                          </tbody>
                        </table>
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
                    </div>
                    {/* END FOOTER EXPORT */}
                    <button onClick={this.showPageData}>forDebug</button>                    
                </div>
            </div>
        );
    }
});

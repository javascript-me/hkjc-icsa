import React from 'react';
import ReactDOM from 'react-dom';
import Calendar from 'rc-calendar';
import { hashHistory } from 'react-router';
import ClassNames from 'classnames';
import PubSub from '../pubsub';
import AuditlogService from './auditlog-service';
import BetType from './betType';
import FilterBlock from './filterBlock';
import SearchEnquiryPanel from '../searchEnquiryPanel/searchEnquiryPanel';
import Paging from '../paging/paging'
import AuditlogStore from './auditlog-store';

let tokens = {
  AUDITLOG_BET_TYPE_CHANGE: null,
  AUDITLOG_REMOVE_FILTER: null
};

let AUDITLOG_BET_TYPE_CHANGE = null;
let AUDITLOG_REMOVE_FILTER = null;

export default class Audit extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
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
        }

        this.changeBetType = this.changeBetType.bind(this);
        this.removeSearchCriteriaFilter = this.removeSearchCriteriaFilter.bind(this);
        // this.toggleMoreFilter = this.toggleMoreFilter.bind(this);
        this.clickInMoreFilters = this.clickInMoreFilters.bind(this);
        this.showMoreFilter = this.showMoreFilter.bind(this);
        this.pageClick = this.pageClick.bind(this);
        this.setFilters = this.setFilters(this);

    }

    componentWillMount() {
        document.addEventListener('click', this.pageClick, false);
    }

    componentDidMount () {
      AUDITLOG_BET_TYPE_CHANGE = PubSub.subscribe(PubSub.AUDITLOG_BET_TYPE_CHANGE, ((topic, betType) => {
        this.setState({
          betType: betType
        });
      }).bind(this));
    }

    componentWillUnmount () {
      PubSub.unsubscribe(AUDITLOG_BET_TYPE_CHANGE);

      document.removeEventListener('click', this.pageClick, false);
    }

    pageClick(event) {
        let keywordTag = this.refs.keyword,
            keywordElement = ReactDOM.findDOMNode(keywordTag), 
            isInsideKeywordElement = keywordElement && keywordElement.contains(event.target),
            isInside = isInsideKeywordElement || this.state.isClickInMoreFilters;

        if(!this.state.showMoreFilter || isInside) {
            this.setState({isClickInMoreFilters:false});
            return;
        }

        this.hideMoreFilter();
    }

    getBetTypeIconClassName(betType) {
      return ClassNames(
        'bet-type',
        'icon-' + betType,
        {
          'active': this.state.betType === betType
        });
    }

    changeBetType(betType) {
      this.setState({
          betType: betType,
          showMoreFilter: false
      });
    }

    removeSearchCriteriaFilter(filter) {
        let selectedFilters = this.state.selectedFilters,
          filterIndex = selectedFilters.indexOf(filter);

        selectedFilters.splice(filterIndex, 1);
        this.setState({
          selectedFilters: selectedFilters,
          showMoreFilter: false
        });
    }

    setFilters(filters) {
        this.setState({
          selectedFilters: filters
        });
    }

    resetFilters() {
        this.setState({
          selectedFilters: []
        });
    }

    async searchAuditlog(filters) {
        this.setFilters(filters);
        this.hideMoreFilter();
        await AuditlogService.postSearchCriteria();
    }

    clickInMoreFilters() {
        this.setState({
          isClickInMoreFilters: true
        });
    }

    showMoreFilter(event) {
        event.stopPropagation()

        this.setState({
            showMoreFilter: true
        });
    }

    hideMoreFilter() {
        this.setState({
            showMoreFilter: false
        });
    }

    setFilters(filters, hidePopup) {
        if(hidePopup) {
            this.hideMoreFilter();
        }

    }

    showPageData() {
        console.log(JSON.stringify(AuditlogStore.pageData, null, 4))
    }

    render() {
      let me = this,
        betTypes = this.state.betTypes.map((betType, index) => {
          return <BetType 
            key={index} 
            selectedBetType={me.state.betType} 
            betType={betType}
            changeBetTypeEvent={me.changeBetType}
            changeEventTopic="AUDITLOG_BET_TYPE_CHANGE" />;
        }),

        filterBlockes = this.state.selectedFilters.map((f, index)=>{
          return <FilterBlock 
            key={index}
            filter={f} 
            removeEvent={me.removeSearchCriteriaFilter}
            removeEventTopic={tokens.AUDITLOG_REMOVE_FILTER}/>;
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
                    <div className="col-md-6">
                        <Calendar className="hidden"/>
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
                    <div className="col-xs-12">
                        <table className="table table-striped auditlog-table">
                          <thead className="table-header">
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

                    <button onClick={this.showPageData}>forDebug</button>
                    <Paging />
                </div>
            </div>
        );
    }
}

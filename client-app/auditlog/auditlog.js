﻿import React from 'react';
import Calendar from 'rc-calendar';
import { hashHistory } from 'react-router';
import ClassNames from 'classnames';
import PubSub from '../pubsub';
import BetType from './betType';
import FilterBlock from './filterBlock';
import Paging from '../paging/paging'
import AuditlogStore from './auditlog-store';

export default class Audit extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          tokens: {
            AUDITLOG_BET_TYPE_CHANGE: null,
            AUDITLOG_REMOVE_FILTER: null
          },
          betTypes: ['football', 'basketball', 'horse-racing'],
          betType: 'football',
          selectedFilters: [{
            'name': 'Type',
            'value': 'Some Type'
          }, {
            'name': 'Date To',
            'value': 'Some day'
          }]
        }
    }

    componentDidMount () {
      this.state.tokens.AUDITLOG_BET_TYPE_CHANGE = PubSub.subscribe(PubSub.AUDITLOG_BET_TYPE_CHANGE, ((topic, betType) => {
        this.setState({
          betType: betType
        });
      }).bind(this));

      this.state.tokens.AUDITLOG_REMOVE_FILTER = PubSub.subscribe(PubSub.AUDITLOG_REMOVE_FILTER, ((topic, filter) => {
        let selectedFilters = this.state.selectedFilters,
          filterIndex = selectedFilters.indexOf(filter);

        selectedFilters.splice(filterIndex, 1);
        this.setState({
          selectedFilters: selectedFilters
        });
      }).bind(this));


    }

    componentWillUnmount () {
      PubSub.unsubscribe(this.state.tokens.AUDITLOG_BET_TYPE_CHANGE);
      PubSub.unsubscribe(this.state.tokens.AUDITLOG_REMOVE_FILTER);
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
        betType: betType
      });
    }


    showPageData() {
        console.log(JSON.stringify(AuditlogStore.pageData, null, 4))
    },

    render() {
      let me = this;
      let betTypes = this.state.betTypes.map((betType, index) => {
          return <BetType 
            key={index} 
            selectedBetType={me.state.betType} 
            betType={betType}
            changeEventTopic={me.state.tokens.AUDITLOG_BET_TYPE_CHANGE} />;
      });

      let filterBlockes = this.state.selectedFilters.map((f, index)=>{
          return <FilterBlock 
            key={index}
            filter={f} 
            removeEventTopic={me.state.tokens.AUDITLOG_REMOVE_FILTER}/>;
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
                        <div className="keyword-container">
                          <input type="text" placeholder="Search with keywords & filters" />
                        </div>
                        <div className="filter-block-container">
                          {filterBlockes}
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

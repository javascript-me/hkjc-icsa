import React from 'react'
import TableService from '../tabulardata/tabulardata-service';
import AuditlogStore from '../auditlog/auditlog-store';

export default React.createClass({

    getInitialState () {

        AuditlogStore.getDataByPageNumber(1)

        var data = {
            data: [
                {
                    "date_time": "23 September 2016",
                    "user_id": "candy.crush",
                    "user_name": "Candy Crush",
                    "Type": "Odds",
                    "function_module": "Master Risk Limit Log",
                    "function_event_detail": "Update Odds",
                    "user_role": "Role1, Role2",
                    "ip_address": "182.34.2.192"
                },
                {
                    "date_time": "23 September 2016",
                    "user_id": "candy.crush",
                    "user_name": "Candy Crush",
                    "Type": "Odds",
                    "function_module": "Master Risk Limit Log",
                    "function_event_detail": "Update Odds",
                    "user_role": "Role1, Role2",
                    "ip_address": "182.34.2.192"
                }
            ]
        }

        return data
    },

    componentDidMount() {
        AuditlogStore.addChangeListener(this._onChange.bind(this));
    },

    componentWillUnmount() {
        AuditlogStore.removeChangeListener(this._onChange.bind(this));
    },

    _onChange() {
        console.log("===>" + JSON.stringify(AuditlogStore.auditlogs, null,4))
        this.setState({data:AuditlogStore.auditlogs});
    },


    render(){
        // var data =  [
        //     {"date_time":"23 September 2016", "user_id":"candy.crush", "user_name":"Candy Crush", "Type":"Odds", "function_module":"Master Risk Limit Log", "function_event_detail":"Update Odds", "user_role":"Role1, Role2", "ip_address":"182.34.2.192" },
        //     {"date_time":"23 September 2016", "user_id":"candy.crush", "user_name":"Candy Crush", "Type":"Odds", "function_module":"Master Risk Limit Log", "function_event_detail":"Update Odds", "user_role":"Role1, Role2", "ip_address":"182.34.2.192" }
        // ];

        var rows = this.state.data.map(function(row){
            return <tr>
                <td>{row.date_time}</td>
                <td>{row.user_id}</td>
                <td>{row.user_name}</td>
                <td>{row.Type}</td>
                <td>{row.function_module}</td>
                <td>{row.function_event_detail}</td>
                <td>{row.user_role}</td>
                <td>{row.ip_address}</td>
                <td>{row.backend_id}</td>
                <td>{row.frontend_id}</td>
                <td>{row.home}</td>
                <td>{row.away}</td>
                <td>{row.ko_time_game_start_game}</td>
                <td>{row.bet_type}</td>
                <td>{row.event_name}</td>
                <td>{row.error_code}</td>
                <td>{row.error_message_content}</td>
                <td>{row.device}</td>
            </tr>
        });

        return  <table className="table table-striped auditlog-table">
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
                <th>Back End ID</th>
                <th>Front End ID</th>
                <th>Home</th>
                <th>Away</th>
                <th>K.O. Time/ Game Start Time</th>
                <th>Bet Type</th>
                <th>Event Name</th>
                <th>Error Code</th>
                <th>Error Message Content</th>
                <th>Device</th>
            </tr>
            </thead>
            {rows}
        </table>

    }
});


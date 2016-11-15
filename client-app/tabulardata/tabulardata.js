import React from 'react'
import AuditlogStore from '../auditlog/auditlog-store';

export default React.createClass({

    getInitialState () {

        var sortingObject = {fieldName: "date_time", order: "ASCEND"}
        AuditlogStore.getDataByPageNumber(1, sortingObject)

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
        this.setState({data:AuditlogStore.auditlogs});
    },

    onItemClick (event) {
        var sortingObject = {fieldName: "date_time", order: "ASCEND"} // or DESCEND
        AuditlogStore.getDataByPageNumber(10, sortingObject)
    },

    render(){
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

        return  <table className="table-striped table auditlog-table">
            <thead className="table-header">
            <tr>
                <th><button onClick={this.onItemClick}>Up</button><button>Down</button>Date/Time</th>
                <th><button>Up</button><button>Down</button>User ID</th>
                <th><button>Up</button><button>Down</button>User Name</th>
                <th><button>Up</button><button>Down</button>Type</th>
                <th><button>Up</button><button>Down</button>Function/Module</th>
                <th><button>Up</button><button>Down</button>Function Event Detail</th>
                <th><button>Up</button><button>Down</button>User Role</th>
                <th><button>Up</button><button>Down</button>IP Address</th>
                <th><button>Up</button><button>Down</button>Back End ID</th>
                <th><button>Up</button><button>Down</button>Front End ID</th>
                <th><button>Up</button><button>Down</button>Home</th>
                <th><button>Up</button><button>Down</button>Away</th>
                <th><button>Up</button><button>Down</button>K.O. Time/ Game Start Time</th>
                <th><button>Up</button><button>Down</button>Bet Type</th>
                <th><button>Up</button><button>Down</button>Event Name</th>
                <th><button>Up</button><button>Down</button>Error Code</th>
                <th><button>Up</button><button>Down</button>Error Message Content</th>
                <th><button>Up</button><button>Down</button>Device</th>
            </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>

    }
});


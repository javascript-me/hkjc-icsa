import React from 'react'
import TableService from '../tabulardata/tabulardata-service';

export default React.createClass({
  render: function(){
            var data =  [
                {"date_time":"23 September 2016", "user_id":"candy.crush", "user_name":"Candy Crush", "type":"Odds", "function_module":"Master Risk Limit Log", "function_event_detail":"Update Odds", "user_role":"Role1, Role2", "ip_address":"182.34.2.192" },
                {"date_time":"23 September 2016", "user_id":"candy.crush", "user_name":"Candy Crush", "type":"Odds", "function_module":"Master Risk Limit Log", "function_event_detail":"Update Odds", "user_role":"Role1, Role2", "ip_address":"182.34.2.192" }   
            ];

            var rows = data.map(function(row){
             return <tr>
                     <td>{row.date_time}</td>
                     <td>{row.user_id}</td>
                     <td>{row.user_name}</td>
                     <td>{row.type}</td>
                     <td>{row.function_module}</td>
                     <td>{row.function_event_detail}</td>
                     <td>{row.user_role}</td>
                     <td>{row.ip_address}</td>
                
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
                        </tr>
                        </thead>
                        {rows}
                    </table>
                        
        }
    });


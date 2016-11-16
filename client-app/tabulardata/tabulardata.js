import React from 'react'
import AuditlogStore from '../auditlog/auditlog-store';

export default React.createClass({

    getInitialState () {

        var headers = [
            {label:"Date/Time", fieldName:"date_time", sortingClass:"no-arrow"},
            {label:"User ID", fieldName:"user_id", sortingClass:"no-arrow"},
            {label:"User Name", fieldName:"user_name", sortingClass:"no-arrow"},
            {label:"Type", fieldName:"Type", sortingClass:"no-arrow"},
            {label:"Function/Module", fieldName:"function_module", sortingClass:"no-arrow"},
            {label:"Function Event Detail", fieldName:"function_event_detail", sortingClass:"no-arrow"},
            {label:"User Role", fieldName:"user_role", sortingClass:"no-arrow"},
            {label:"IP Address", fieldName:"ip_address", sortingClass:"no-arrow"},
            {label:"Back End ID", fieldName:"backend_id", sortingClass:"no-arrow"},
            {label:"Front End ID", fieldName:"frontend_id", sortingClass:"no-arrow"},
            {label:"Home", fieldName:"home", sortingClass:"no-arrow"},
            {label:"Away", fieldName:"away", sortingClass:"no-arrow"},
            {label:"K.O. Time/ Game Start Time", fieldName:"ko_time_game_start_game", sortingClass:"no-arrow"},
            {label:"Bet Type", fieldName:"bet_type", sortingClass:"no-arrow"},
            {label:"Event Name", fieldName:"event_name", sortingClass:"no-arrow"},
            {label:"Error Code", fieldName:"error_code", sortingClass:"no-arrow"},
            {label:"Error Message Content", fieldName:"error_message_content", sortingClass:"no-arrow"},
            {label:"Device", fieldName:"device", sortingClass:"no-arrow"}
        ]

        return {
            auditlogs: [
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
            ],
            headers: headers
        }
    },

    componentDidMount() {
        AuditlogStore.addChangeListener(this._onChange.bind(this));
    },

    componentWillUnmount() {
        AuditlogStore.removeChangeListener(this._onChange.bind(this));
    },

    _onChange() {

        this.setState({
            auditlogs:AuditlogStore.auditlogs,
        })

        if (this.props.onChange) {
            this.props.onChange(AuditlogStore.auditlogs)
        }
    },

    setToNoArrow(headers) {

        for (var i = 0 ; i < headers.length ; i++) {
            headers[i].sortingClass = "no-arrow"
        }

        return headers
    },

    updateColumnSortingArrow(headers, fieldName) {

        var element = this.findHeader(headers, fieldName)

        var oldSortingClass = element.sortingClass

        headers = this.setToNoArrow(headers)

        element.sortingClass = this.transformSortingClass(oldSortingClass)

        return headers
    },

    transformSortingClass(value) {
        if (value == "no-arrow") return "down-arrow"
        if (value == "down-arrow") return "up-arrow"
        if (value == "up-arrow") return "down-arrow"
        return ""
    },

    findHeader(headers, fieldName) {
        for (var i = 0 ; i < headers.length ; i++) {
            var element = headers[i]

            if (element.fieldName == fieldName) {
                return element
            }
        }

        return null
    },

    parseToOrder(value) {
        //TODO: these names should be extract somewhere.

        if (value == "no-arrow") return "NO_ORDER"
        if (value == "up-arrow") return "ASCEND"
        if (value == "down-arrow") return "DESCEND"
        return ""
    },

    onItemClick (event) {

        var fieldName = event.target.id

        this.setState({
            headers: this.updateColumnSortingArrow(this.state.headers, fieldName)
        })

        var header = this.findHeader(this.state.headers, fieldName)

        var order = this.parseToOrder(header.sortingClass)

        var sortingObject = {fieldName:fieldName, order:order}

        AuditlogStore.getDataByPageNumber(1, sortingObject)
    },


    //TODO: below long HTML should be extracted to a method.
    //TODO: fieldName like date_time is appeared in 2 places. Need to combine.
    render(){
        var rows = this.state.auditlogs.map(function(row){
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
                {
                    this.state.headers.map(
                        function(header, i) {
                            return <th className={header.fieldName} ><span id={header.fieldName} className={header.sortingClass} onClick={this.onItemClick}></span>{header.label}</th>
                        }.bind(this)
                    )
                }

            </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>

    }
});


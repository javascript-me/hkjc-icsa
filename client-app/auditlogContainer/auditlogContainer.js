import React from 'react'
import Calendar from 'rc-calendar'
import { hashHistory } from 'react-router'

export default React.createClass({
    displayName: 'Audit',
    render() {
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
                        <span>Welcome to Audit log</span>
                        // <Calendar className="hidden"/>
                    </div>
                    <div className="col-md-6">

                    </div>
                </div>
                <div className='row'>
                    <div className="col-md-6">

                    </div>
                    <div className="col-md-6">

                    </div>
                </div>
            </div>
        )
    }
})

import React from 'react'
import Calendar from 'rc-calendar'
import { hashHistory } from 'react-router'

export default React.createClass({
    displayName: 'Audit',
    render() {
        return (
            <div className='container'>
                <div className='row'>
                    <div className="col-md-6">
                        <Calendar />
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

import React from 'react'
import DateTime from '../dateTime/dateTime'

export default class SearchEnquiryPanel extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			dateTimeFrom: '',
			dateTimeTo: ''
		}
	}

	componentDidMount () {
	}

	renderTipsText () {
		let dateTimeFrom = this.state.dateTimeFrom
		let dateTimeTo = this.state.dateTimeTo
		if (dateTimeFrom.replace(/^[\s]*$/, '').length === 0 || dateTimeTo.replace(/^[\s]*$/, '').length === 0) {
			return <span className='color-red'>* Invalid fields are highlighted in red</span>
		} else if (dateTimeTo < dateTimeFrom) {
			return <span className='color-red'>* Invalid fields are highlighted in red</span>
		} else {
			return <span className='color-blue'>* These fields are mandatory</span>
		}
	}

	changeDateTimeFrom (event) {
		this.setState({
			dateTimeFrom: event.target.value
		})
	}

	changeDateTimeTo (event) {
		this.setState({
			dateTimeTo: event.target.value
		})
	}

	render () {
		let dateTimeFrom = this.state.dateTimeFrom
		let dateTimeTo = this.state.dateTimeTo
		let fromClass = 'form-group'
		let toClass = 'form-group'
		if (dateTimeFrom.replace(/^[\s]*$/, '').length === 0) {
			fromClass = 'form-group has-error'
		}
		if (dateTimeTo.replace(/^[\s]*$/, '').length === 0) {
			toClass = 'form-group has-error'
		}
		if (dateTimeTo < dateTimeFrom) {
			fromClass = 'form-group has-error'
			toClass = 'form-group has-error'
		}
		return <div className='component-search-enquiry-panel'>
      <div className='container-fluid pd-w10'>
        <div className='row mg-w010'>
          <div className='col-sm-3 pd-w10'>
            <div className={fromClass}>
              <label>Date Time From <span>*</span></label>
              <DateTime inputFor='dateTimeFrom' dateTime={dateTimeFrom} handleVal={this.changeDateTimeFrom.bind(this)} />
            </div>
          </div>
          <div className='col-sm-3 pd-w10'>
            <div className={toClass}>
              <label>Date Time To <span>*</span></label>
              <DateTime inputFor='dateTimeTo' dateTime={dateTimeTo} handleVal={this.changeDateTimeTo.bind(this)} />
            </div>
          </div>
          <div className='col-sm-3 pd-w10'>
            <div className='form-group'>
              <label>Type</label>
              <select className='form-control'>
                <option>All</option>
                <option>Test01</option>
                <option>Test02</option>
                <option>Test03</option>
              </select>
            </div>
          </div>
          <div className='col-sm-3 pd-w10'>
            <div className='form-group'>
              <label>Back End ID</label>
              <input type='text' className='form-control' placeholder='Type in keyword' />
            </div>
          </div>
        </div>
        <div className='row mg-w010'>
          <div className='col-sm-3 pd-w10'>
            <div className='form-group'>
              <label>Front End ID</label>
              <input type='text' className='form-control' placeholder='Type in keyword' />
            </div>
          </div>
          <div className='col-sm-3 pd-w10'>
            <div className='form-group'>
              <label>Event Lv1</label>
              <input type='text' className='form-control' placeholder='Type in keyword' />
            </div>
          </div>
          <div className='col-sm-3 pd-w10'>
            <div className='form-group'>
              <label>Home</label>
              <input type='text' className='form-control' placeholder='Type in keyword' />
            </div>
          </div>
          <div className='col-sm-3 pd-w10'>
            <div className='form-group'>
              <label>Away</label>
              <input type='text' className='form-control' placeholder='Type in keyword' />
            </div>
          </div>
        </div>
        <div className='row mg-w010'>
          <div className='col-sm-3 pd-w10'>
            <div className='form-group'>
              <label>K.O Time/Game Start Game</label>
              <DateTime inputFor='dateTimeGameStart' />
            </div>
          </div>
          <div className='col-sm-3 pd-w10'>
            <div className='form-group'>
              <label>User ID</label>
              <input type='text' className='form-control' placeholder='Type in keyword' />
            </div>
          </div>
          <div className='col-sm-3 pd-w10'>
            <div className='form-group'>
              <label>User Role</label>
              <select className='form-control'>
                <option>All</option>
                <option>Test01</option>
                <option>Test02</option>
                <option>Test03</option>
              </select>
            </div>
          </div>
          <div className='col-sm-3 pd-w10'>
            <div className='form-group'>
              <label>System Function</label>
              <select className='form-control'>
                <option>All</option>
                <option>Test01</option>
                <option>Test02</option>
                <option>Test03</option>
              </select>
            </div>
          </div>
        </div>
        <div className='row mg-w010'>
          <div className='col-sm-3 pd-w10'>
            <div className='form-group'>
              <label>Bet Type/Feature</label>
              <select className='form-control'>
                <option>All</option>
                <option>Test01</option>
                <option>Test02</option>
                <option>Test03</option>
              </select>
            </div>
          </div>
          <div className='col-sm-3 pd-w10'>
            <div className='form-group'>
              <label>Device</label>
              <select className='form-control'>
                <option>All</option>
                <option>Test01</option>
                <option>Test02</option>
                <option>Test03</option>
              </select>
            </div>
          </div>
          <div className='col-sm-3 pd-w10'>
            <div className='form-group'>
              <label>IP Address</label>
              <input type='text' className='form-control' placeholder='Type in keyword' />
            </div>
          </div>
          <div className='col-sm-3 pd-w10'>
            <div className='form-group'>
              <label>Error Code</label>
              <input type='text' className='form-control' placeholder='Type in keyword' />
            </div>
          </div>
        </div>
        <div className='pannel-footer'>
          <div className='item-text'>{this.renderTipsText()}</div>
          <div className='item-after'>
            <button type='button' className='btn btn-link'>Reset</button>
            <button type='button' className='btn btn-primary'>Search</button>
          </div>
        </div>
      </div>
    </div>
	}
}

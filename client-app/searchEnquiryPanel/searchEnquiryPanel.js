import React from 'react'
import Moment from 'moment'
import DateTime from '../dateTime/dateTime'
import PubSub from '../pubsub';

const getOrginDateTimeFrom = function() {
    let dateTimeFrom = new Date();
    dateTimeFrom.setDate(dateTimeFrom.getDate() - 60);
    dateTimeFrom.setHours(0);
    dateTimeFrom.setMinutes(0);
    dateTimeFrom.setSeconds(0);
    dateTimeFrom.setMilliseconds(0);

    return Moment(dateTimeFrom).format('DD MMM YYYY HH:mm');
}

const getOrginDateTimeTo = function() {
    let dateTimeTo = new Date();
    dateTimeTo.setHours(23);
    dateTimeTo.setMinutes(59);
    dateTimeTo.setSeconds(59);
    dateTimeTo.setMilliseconds(0);

    return Moment(dateTimeTo).format('DD MMM YYYY HH:mm');
}

const originState = {
    dateTimeFrom: getOrginDateTimeFrom(),
    dateTimeTo: getOrginDateTimeTo(),
    typeValue: '',
    backEndID: '',
    frontEndID: '',
    eventLv1: '',
    homeValue: '',
    awayValue: '',
    dateTimeGameStart: '',
    userId: '',
    userRole: '',
    systemFunc: '',
    betType: '',
    device: '',
    ipAddress: '',
    errorCode: '',
    tipsFlag: 1,
    errorDateTimeFrom: 1,
    errorDateTimeTo: 1,
    errorIPAddress: 1
};

let token = null;

export default class SearchEnquiryPanel extends React.Component {
	constructor (props) {
		super(props)
		this.state = Object.assign({
        tokens: {
            AUDITLOG_SEARCH_BY_KEY_PRESS: 'AUDITLOG_SEARCH_BY_KEY_PRESS'
        }
    }, originState);

    this.handleSubmit = this.handleSubmit.bind(this);
	}

  componentDidMount() {
      token = PubSub.subscribe(PubSub['AUDITLOG_SEARCH_BY_KEY_PRESS'], () => {
          this.handleSubmit();
      });

      document.addEventListener('click', this.pageClick, false);
  }

  componentWillUnmount() {
      PubSub.unsubscribe(token);

      document.removeEventListener('click', this.pageClick, false);
  }

	renderTipsText () {
		let { dateTimeTo, dateTimeFrom, errorDateTimeFrom, errorDateTimeTo, errorIPAddress, tipsFlag } = this.state
		if (tipsFlag === 0 && (errorDateTimeTo === 0 || errorDateTimeFrom === 0 || errorIPAddress === 0 || dateTimeTo < dateTimeFrom)) {
			return <span className='color-red'>* Invalid fields are highlighted in red</span>
		} else {
			return <span className='color-blue'>* These fields are mandatory</span>
		}
	}

	handleChange (name, event) {
		let newState = {};

		newState[name] = event.target.value
		this.setState(newState)

		if (name === 'dateTimeFrom') {
			if (event.target.value.replace(/^[\s]*$/, '').length > 0) {
				this.setState({
					errorDateTimeFrom: 1
				})
			} else {
				this.setState({
					errorDateTimeFrom: 0
				})
			}
		} else if (name === 'dateTimeTo') {
			if (event.target.value.replace(/^[\s]*$/, '').length > 0) {
				this.setState({
					errorDateTimeTo: 1
				})
			} else {
				this.setState({
					errorDateTimeTo: 0
				})
			}
		} else if (name === 'ipAddress') {
			let reg = /((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)){3}/
			if (!event.target.value || reg.test(event.target.value)) {
				this.setState({
					errorIPAddress: 1
				})
			} else {
				this.setState({
					errorIPAddress: 0
				})
			}
		}
	}

  isEnquiryValid() {
    return this.state.tipsFlag || (this.state.errorDateTimeFrom && this.state.errorDateTimeTo && this.state.errorIPAddress);
  }

	handleSubmit () {
  		this.setState({ tipsFlag: 0 }, function() {
          if(this.isEnquiryValid()) {
              let enquiries = this.getEnquiries(this.state),
              	originDateRange = {
              		dateTimeFrom: originState.dateTimeFrom,
              		dateTimeTo: originState.dateTimeTo
              	};

              this.props.setFilterEvent(enquiries, originDateRange);
              this.setState({
                tipsFlag: 1
              })
          }    
      });   
	}

	handleReset () {
    let newState = Object.assign({}, originState);

		this.setState(newState);    
	}

  getEnquiries(src) {
      let result = {},
          needReturnEnquiries = [
              'dateTimeFrom',
              'dateTimeTo',
              'typeValue',
              'backEndID',
              'frontEndID',
              'eventLv1',
              'homeValue',
              'awayValue',
              'dateTimeGameStart',
              'userId',
              'userRole',
              'systemFunc',
              'betType',
              'device',
              'ipAddress',
              'errorCode'],
          currentAttrName,
          currentAttrVal;

      for(let i in needReturnEnquiries) {
          currentAttrName = needReturnEnquiries[i];
          currentAttrVal = src[currentAttrName];

          if(currentAttrVal) {
              result[currentAttrName] = currentAttrVal;
          }          
      }

      return result;
  }

	render () {

		let { errorDateTimeFrom, errorDateTimeTo, errorIPAddress, dateTimeTo, dateTimeFrom, tipsFlag } = this.state
		let fromClass = 'form-group'
		let toClass = 'form-group'
		let ipClass = 'form-group'
		if (tipsFlag === 0 && errorDateTimeFrom === 0) {
			fromClass = 'form-group has-error'
		}
		if (tipsFlag === 0 && errorDateTimeTo === 0) {
			toClass = 'form-group has-error'
		}
		if (tipsFlag === 0 && errorIPAddress === 0) {
			ipClass = 'form-group has-error'
		}
		if (tipsFlag === 0 && dateTimeTo < dateTimeFrom) {
			fromClass = 'form-group has-error'
			toClass = 'form-group has-error'
		}
		return <div className='component-search-enquiry-panel'>
			<div className='container-fluid pd-w10'>
				<div className='row mg-w010'>
					<div className='col-sm-3 pd-w10'>
						<div className={fromClass}>
							<label>Date Time From <span>*</span></label>
							<DateTime inputFor='dateTimeFrom' dateTime={dateTimeFrom} handleVal={this.handleChange.bind(this, 'dateTimeFrom')} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className={toClass}>
							<label>Date Time To <span>*</span></label>
							<DateTime inputFor='dateTimeTo' dateTime={dateTimeTo} handleVal={this.handleChange.bind(this, 'dateTimeTo')} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Type</label>
							<select className='form-control' value={this.state.typeValue} onChange={this.handleChange.bind(this, 'typeValue')}>
								<option>All</option>
								<option>Event</option>
								<option>Bet Type and Feature</option>
								<option>Odds</option>
								<option>Risk Limit</option>
								<option>Selling Control</option>
								<option>Result</option>
							</select>
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Back End ID</label>
							<input type='text' className='form-control' placeholder='Type in keyword' value={this.state.backEndID} onChange={this.handleChange.bind(this, 'backEndID')} />
						</div>
					</div>
				</div>
				<div className='row mg-w010'>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Front End ID</label>
							<input type='text' className='form-control' placeholder='Type in keyword' value={this.state.frontEndID} onChange={this.handleChange.bind(this, 'frontEndID')} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Event Lv1</label>
							<input type='text' className='form-control' placeholder='Type in keyword' value={this.state.eventLv1} onChange={this.handleChange.bind(this, 'eventLv1')} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Home</label>
							<input type='text' className='form-control' placeholder='Type in keyword' value={this.state.homeValue} onChange={this.handleChange.bind(this, 'homeValue')} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Away</label>
							<input type='text' className='form-control' placeholder='Type in keyword' value={this.state.awayValue} onChange={this.handleChange.bind(this, 'awayValue')} />
						</div>
					</div>
				</div>
				<div className='row mg-w010'>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>K.O Time/Game Start Game</label>
							<DateTime inputFor='dateTimeGameStart' handleVal={this.handleChange.bind(this, 'dateTimeGameStart')} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>User ID</label>
							<input type='text' className='form-control' placeholder='Type in keyword' value={this.state.userId} onChange={this.handleChange.bind(this, 'userId')} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>User Role</label>
							<select className='form-control' value={this.state.userRole} onChange={this.handleChange.bind(this, 'userRole')}>
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
							<select className='form-control' value={this.state.systemFunc} onChange={this.handleChange.bind(this, 'systemFunc')}>
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
							<select className='form-control' value={this.state.betType} onChange={this.handleChange.bind(this, 'betType')}>
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
							<select className='form-control' value={this.state.device} onChange={this.handleChange.bind(this, 'device')}>
								<option>All</option>
								<option>Test01</option>
								<option>Test02</option>
								<option>Test03</option>
							</select>
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className={ipClass}>
							<label>IP Address</label>
							<input type='text' className='form-control' placeholder='Type in keyword' value={this.state.ipAddress} onChange={this.handleChange.bind(this, 'ipAddress')} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Error Code</label>
							<input type='text' className='form-control' placeholder='Type in keyword' value={this.state.errorCode} onChange={this.handleChange.bind(this, 'errorCode')} />
						</div>
					</div>
				</div>
				<div className='pannel-footer'>
					<div className='item-text'>{this.renderTipsText()}</div>
					<div className='item-after'>
						<button type='button' className='btn btn-link' onClick={this.handleReset.bind(this)}>Reset</button>
						<button type='button' className='btn btn-primary' onClick={this.handleSubmit.bind(this)}>Search</button>
					</div>
				</div>
			</div>
		</div>
	}
}

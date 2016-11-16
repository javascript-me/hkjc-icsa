import React from 'react'
import SearchEnquiryDataService from './searchEnquiryPanel-service'
import Moment from 'moment'
import DateTime from '../dateTime/dateTime'
import SelectCom from '../select/select'
import PubSub from '../pubsub';

const selectdata = SearchEnquiryDataService.getData();

const getOrginDateFrom = function() {
    let dateFrom = new Date();
	let dateFromObj = {};
    dateFrom.setDate(dateFrom.getDate() - 60);
    dateFrom.setHours(0);
    dateFrom.setMinutes(0);
    dateFrom.setSeconds(0);
    dateFrom.setMilliseconds(0);
	dateFromObj.value = Date.parse(dateFrom);
	dateFromObj.datetime = Moment(dateFrom).format('DD MMM YYYY HH:mm');
    return dateFromObj;
}

const getOrginDateTo = function() {
    let dateTo = new Date();
	let dateToObj = {};
    dateTo.setHours(23);
    dateTo.setMinutes(59);
    dateTo.setSeconds(59);
    dateTo.setMilliseconds(0);
	dateToObj.value = Date.parse(dateTo);
    dateToObj.datetime = Moment(dateTo).format('DD MMM YYYY HH:mm');
	return dateToObj;
}

const originState = {
    dateTimeFrom: getOrginDateFrom(),
    dateTimeTo: getOrginDateTo(),
	selectdata: selectdata,
    backEndID: '',
    frontEndID: '',
    eventLv1: '',
    homeValue: '',
    awayValue: '',
    dateTimeGameStart: '',
    userId: '',
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
		let { dateTimeFrom, dateTimeTo, errorDateTimeFrom, errorDateTimeTo, errorIPAddress, tipsFlag } = this.state;
		if (tipsFlag === 0 && (errorDateTimeTo === 0 || errorDateTimeFrom === 0 || errorIPAddress === 0 || dateTimeTo.value < dateTimeFrom.value)) {
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
              let enquiries = this.getEnquiries(this.state);

              this.props.setFilterEvent(enquiries, true);
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
		let { selectdata, errorDateTimeFrom, errorDateTimeTo, errorIPAddress, dateTimeTo, dateTimeFrom, tipsFlag } = this.state
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
		if (tipsFlag === 0 && dateTimeTo.value < dateTimeFrom.value) {
			fromClass = 'form-group has-error'
			toClass = 'form-group has-error'
		}
		return <div className='component-search-enquiry-panel'>
			<div className='container-fluid pd-w10'>
				<div className='row mg-w010'>
					<div className='col-sm-3 pd-w10'>
						<div className={fromClass}>
							<label>Date Time From <span>*</span></label>
							<DateTime inputFor='dateTimeFrom' dateTime={dateTimeFrom.datetime} handleVal={this.handleChange.bind(this, 'dateTimeFrom')} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className={toClass}>
							<label>Date Time To <span>*</span></label>
							<DateTime inputFor='dateTimeTo' dateTime={dateTimeTo.datetime} handleVal={this.handleChange.bind(this, 'dateTimeTo')} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Type</label>
							<SelectCom datas={selectdata.typeValue} handleVal={this.handleChange.bind(this, selectdata.typeValue)} />
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
							<SelectCom datas={selectdata.userRole} handleVal={this.handleChange.bind(this, selectdata.userRole)} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>System Function</label>
							<SelectCom datas={selectdata.systemFunc} handleVal={this.handleChange.bind(this, selectdata.systemFunc)} />
						</div>
					</div>
				</div>
				<div className='row mg-w010'>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Bet Type/Feature</label>
							<SelectCom datas={selectdata.betType} handleVal={this.handleChange.bind(this, selectdata.betType)} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Device</label>
							<SelectCom datas={selectdata.device} handleVal={this.handleChange.bind(this, selectdata.device)} />
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

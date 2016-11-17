import React from 'react'
import SearchEnquiryDataService from './searchEnquiryPanel-service'
import Moment from 'moment'
import DateTime from '../dateTime/dateTime'
import SelectCom from '../select/select'
import PubSub from '../pubsub'

const selectdata = SearchEnquiryDataService.getData()

const getOrginDateTimeFrom = function () {
	let dateTimeFrom = new Date(),
		dateTimeFromObj = {}

	dateTimeFrom.setDate(dateTimeFrom.getDate() - 60)
	dateTimeFrom.setHours(0)
	dateTimeFrom.setMinutes(0)
	dateTimeFrom.setSeconds(0)
	dateTimeFrom.setMilliseconds(0)
	dateTimeFromObj.timestamp = Date.parse(dateTimeFrom)
	dateTimeFromObj.datetime = Moment(dateTimeFrom).format('DD MMM YYYY HH:mm')
	return dateTimeFromObj
}

const getOrginDateTimeTo = function () {
	let dateTimeTo = new Date(),
		dateTimeToObj = {}

	dateTimeTo.setHours(23)
	dateTimeTo.setMinutes(59)
	dateTimeTo.setSeconds(59)
	dateTimeTo.setMilliseconds(0)
	dateTimeToObj.timestamp = Date.parse(dateTimeTo)
	dateTimeToObj.datetime = Moment(dateTimeTo).format('DD MMM YYYY HH:mm')
	return dateTimeToObj
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
    betTypeFeature: '',
    device: '',
    ipAddress: '',
    errorCode: '',
    tipsFlag: 1,
    errorDateTimeFrom: 1,
    errorDateTimeTo: 1,
    errorDateTimeGameStart: 1,
    errorIPAddress: 1
};

let tokenKeyPress = null
let tokenRemoveFilter = null

export default class SearchEnquiryPanel extends React.Component {

	constructor (props) {
		super(props)
		this.state = Object.assign({
			tokens: {
				AUDITLOG_SEARCH_BY_KEY_PRESS: 'AUDITLOG_SEARCH_BY_KEY_PRESS',
				AUDITLOG_SEARCH_BY_REMOVE_FILTER: 'AUDITLOG_SEARCH_BY_REMOVE_FILTER'
			}
		}, originState)

		this.setState(this.props.selectedFilters);

		this.handleSubmit = this.handleSubmit.bind(this)
	}

	componentDidMount () {
		tokenKeyPress = PubSub.subscribe(PubSub[this.state.tokens.AUDITLOG_SEARCH_BY_KEY_PRESS], () => {
			this.handleSubmit()
		})

		tokenRemoveFilter = PubSub.subscribe(PubSub[this.state.tokens.AUDITLOG_SEARCH_BY_REMOVE_FILTER], (topic, filter) => {
			let newState = {};

			newState[filter.name] = originState[filter.name];
			this.setState(newState)
		})

		document.addEventListener('click', this.pageClick, false)
	}

	componentWillUnmount () {
		PubSub.unsubscribe(tokenKeyPress)
		PubSub.unsubscribe(tokenRemoveFilter)

		document.removeEventListener('click', this.pageClick, false)
	}

	renderTipsText () {
		let { dateTimeFrom, dateTimeTo, errorDateTimeFrom, errorDateTimeTo, errorDateTimeGameStart, errorIPAddress, tipsFlag } = this.state
		if (tipsFlag === 0 && (errorDateTimeTo === 0 || errorDateTimeFrom === 0 || errorDateTimeGameStart === 0 || errorIPAddress === 0 || dateTimeTo.timestamp < dateTimeFrom.timestamp)) {
			return <span className='color-red'>* Invalid fields are highlighted in red</span>
		} else {
			return <span className='color-blue'>* These fields are mandatory</span>
		}
	}

	isValidDateTime(str) {
		return Moment(str, "DD MMM YYYY HH:mm", true).isValid();
	}

	handleChange (name, event) {
		let newState = {}

		if (name === 'dateTimeFrom' || name === 'dateTimeTo') {
			newState[name] = {
				timestamp: Date.parse(event.target.value),
				datetime: event.target.value
			}
		} else {
			newState[name] = event.target.value
		}

		this.setState(newState)

		if (name === 'dateTimeFrom') {
			if (event.target.value.replace(/^[\s]*$/, '').length > 0 && this.isValidDateTime(event.target.value)) {
				this.setState({
					errorDateTimeFrom: 1
				})
			} else {
				this.setState({
					errorDateTimeFrom: 0
				})
			}
		} else if (name === 'dateTimeTo') {
			if (event.target.value.replace(/^[\s]*$/, '').length > 0 && this.isValidDateTime(event.target.value)) {
				this.setState({
					errorDateTimeTo: 1
				})
			} else {
				this.setState({
					errorDateTimeTo: 0
				})
			}
		} else if (name === 'dateTimeGameStart') {
			if (event.target.value.replace(/^[\s]*$/, '').length === 0 || this.isValidDateTime(event.target.value)) {
				this.setState({
					errorDateTimeGameStart: 1
				})
			} else {
				this.setState({
					errorDateTimeGameStart: 0
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

	isEnquiryValid () {
		return this.state.tipsFlag || (this.state.errorDateTimeFrom && this.state.errorDateTimeTo && this.state.errorDateTimeGameStart && this.state.errorIPAddress)
	}

	handleSubmit () {
  		this.setState({ tipsFlag: 0 }, function () {
			if (this.isEnquiryValid()) {
				let enquiries = this.getEnquiries(this.state),
              	originDateRange = {
              		dateTimeFrom: originState.dateTimeFrom.datetime,
              		dateTimeTo: originState.dateTimeTo.datetime
              	}

				this.props.setFilterEvent(enquiries, originDateRange)
				this.setState({
					tipsFlag: 1
				})
			}
		})
	}

	handleReset () {
		let newState = Object.assign({}, originState)

		this.setState(newState)
	}

	getEnquiries (src) {
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
					'betTypeFeature',
					'device',
					'ipAddress',
					'errorCode'],
          currentAttrName,
          currentAttrVal;

		for (let i in needReturnEnquiries) {
			currentAttrName = needReturnEnquiries[i]
			currentAttrVal = (currentAttrName === 'dateTimeFrom' || currentAttrName === 'dateTimeTo')
	          ? src[currentAttrName].datetime
	          : src[currentAttrName]

			if (currentAttrVal) {
				result[currentAttrName] = currentAttrVal
			}
		}

		return result
	}

	render () {
		let { errorDateTimeFrom, errorDateTimeTo, errorDateTimeGameStart, errorIPAddress, dateTimeTo, dateTimeFrom, tipsFlag } = this.state
		let fromClass = 'form-group'
		let toClass = 'form-group'
		let dateTimeGameStartClass = 'form-group'
		let ipClass = 'form-group'
		if (tipsFlag === 0 && errorDateTimeFrom === 0) {
			fromClass = 'form-group has-error'
		}
		if (tipsFlag === 0 && errorDateTimeTo === 0) {
			toClass = 'form-group has-error'
		}
		if (tipsFlag === 0 && errorDateTimeGameStart === 0) {
			dateTimeGameStartClass = 'form-group has-error'
		}
		if (tipsFlag === 0 && errorIPAddress === 0) {
			ipClass = 'form-group has-error'
		}
		if (tipsFlag === 0 && dateTimeTo.timestamp < dateTimeFrom.timestamp) {
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
							<SelectCom key="typeValue" datas={selectdata.typeValue} selectedVal={this.state.typeValue} handleVal={this.handleChange.bind(this, 'typeValue')} />
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
						<div className={dateTimeGameStartClass}>
							<label>K.O Time/Game Start Game</label>
							<DateTime inputFor='dateTimeGameStart' dateTime={this.state.dateTimeGameStart} handleVal={this.handleChange.bind(this, 'dateTimeGameStart')} />
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
							<SelectCom key="userRole" datas={selectdata.userRole} selectedVal={this.state.userRole} handleVal={this.handleChange.bind(this, 'userRole')} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>System Function</label>
							<SelectCom key="systemFunc" datas={selectdata.systemFunc} selectedVal={this.state.systemFunc} handleVal={this.handleChange.bind(this, 'systemFunc')} />
						</div>
					</div>
				</div>
				<div className='row mg-w010'>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Bet Type/Feature</label>
							<SelectCom key="betTypeFeature" datas={selectdata.betTypeFeature} selectedVal={this.state.betTypeFeature} handleVal={this.handleChange.bind(this, 'betTypeFeature')} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Device</label>
							<SelectCom key="device" datas={selectdata.device} selectedVal={this.state.device} handleVal={this.handleChange.bind(this, 'device')} />
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

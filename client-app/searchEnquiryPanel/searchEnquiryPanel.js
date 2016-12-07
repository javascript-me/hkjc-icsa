import React from 'react'
import SearchEnquiryDataService from './searchEnquiryPanel-service'
import Moment from 'moment'
import Calendar from '../calendar'
import SelectCom from '../select/select'
import PubSub from '../pubsub'

const selectdata = SearchEnquiryDataService.getData()

const getOrginDateTimeFrom = function () {
	let dateTimeFrom = new Date()
	let dateTimeFromObj = {}

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
	let dateTimeTo = new Date()
	let dateTimeToObj = {}

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
	errorIPAddress: 1,
	calendarVersion: 0
}

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

		this.handleSubmit = this.handleSubmit.bind(this)
	}

	componentDidMount () {
		this.setState(this.props.selectedFilters || [])

		tokenKeyPress = PubSub.subscribe(PubSub[this.state.tokens.AUDITLOG_SEARCH_BY_KEY_PRESS], () => {
			this.handleSubmit()
		})

		tokenRemoveFilter = PubSub.subscribe(PubSub[this.state.tokens.AUDITLOG_SEARCH_BY_REMOVE_FILTER], (topic, filter) => {
			let newStates = {}
			let filterNames = filter.name.split(',')

			filterNames.forEach((filterName) => {
				newStates[filterName] = originState[filterName]
			})

			this.setState(newStates)
		})

		document.addEventListener('click', this.pageClick, false)
	}

	componentWillUnmount () {
		PubSub.unsubscribe(tokenKeyPress)
		PubSub.unsubscribe(tokenRemoveFilter)

		document.removeEventListener('click', this.pageClick, false)
	}

	renderTipsText () {
		let { dateTimeFrom, dateTimeTo, errorDateTimeFrom, errorDateTimeTo, errorIPAddress, tipsFlag } = this.state
		if (tipsFlag === 0 && (errorDateTimeTo === 0 || errorDateTimeFrom === 0 || errorIPAddress === 0 || dateTimeTo.timestamp < dateTimeFrom.timestamp)) {
			return <span className='color-red'>* Invalid fields are highlighted in red</span>
		} else {
			return <span className='color-blue'>* These fields are mandatory</span>
		}
	}

	isValidDateTime (str) {
		return Moment(str, 'DD MMM YYYY HH:mm', true).isValid()
	}

	dateChange (name, date) {
		let newState = {}

		if (name === 'dateTimeFrom' || name === 'dateTimeTo') {
			newState[name] = {
				timestamp: date.valueOf(),
				datetime: date.format('DD MMM YYYY HH:mm')
			}
		} else {
			newState[name] = event.target.value
		}

		this.setState(newState)
	}

	handleChange (name, event) {
		let newState = {}

		newState[name] = event.target.value
		this.setState(newState)

		if (name === 'ipAddress') {
			let reg = /^((25[0-5])|(2[0-4]\d)|(1\d\d)|\d{1,2})(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|\d{1,2})){2}(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|\d{1,2}))$/
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
		return this.state.tipsFlag || (this.state.errorDateTimeFrom && this.state.errorDateTimeTo && this.state.errorIPAddress && this.state.dateTimeTo.timestamp > this.state.dateTimeFrom.timestamp)
	}

	handleSubmit () {
		this.setState({ tipsFlag: 0 }, function () {
			if (this.isEnquiryValid()) {
				let enquiries = this.getEnquiries(this.state)

				this.props.setFilterEvent(enquiries)
				this.setState({
					tipsFlag: 1
				})
			}
		})
	}

	handleReset () {
		let newState = Object.assign({}, originState)
		newState.calendarVersion = ++this.state.calendarVersion
		this.setState(newState)
	}

	getEnquiries (src) {
		let result = {}
		let needReturnEnquiries = [
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
			'errorCode']
		let currentAttrName
		let currentAttrVal

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
		let { errorDateTimeFrom, errorDateTimeTo, errorIPAddress, dateTimeTo, dateTimeFrom, tipsFlag, calendarVersion } = this.state

		let ipClass = 'form-group'

		if (tipsFlag === 0 && errorIPAddress === 0) {
			ipClass = 'form-group has-error'
		}
		if (tipsFlag === 0 && dateTimeTo.timestamp < dateTimeFrom.timestamp) {
			errorDateTimeFrom = 0
			errorDateTimeTo = 0
		}

		return <div className='component-search-enquiry-panel'>
			<div className='container-fluid pd-w10'>
				<div className='row mg-w010'>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Date Time From <span>*</span></label>
							<Calendar
								key={`from-${calendarVersion}`}
								value={dateTimeFrom.datetime}
								warning={!errorDateTimeFrom}
								onChange={(e) => { this.dateChange('dateTimeFrom', e) }} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Date Time To <span>*</span></label>
							<Calendar
								key={`to-${calendarVersion}`}
								value={dateTimeTo.datetime}
								warning={!errorDateTimeTo}
								onChange={(e) => this.dateChange('dateTimeTo', e)} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Type</label>
							<SelectCom key='typeValue' datas={selectdata.typeValue} selectedVal={this.state.typeValue} handleVal={(e) => this.handleChange('typeValue', e)} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Back End ID</label>
							<input type='text' className='form-control' placeholder='Type in keyword' value={this.state.backEndID} onChange={(e) => this.handleChange('backEndID', e)} />
						</div>
					</div>
				</div>
				<div className='row mg-w010'>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Front End ID</label>
							<input type='text' className='form-control' placeholder='Type in keyword' value={this.state.frontEndID} onChange={(e) => this.handleChange('frontEndID', e)} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Event Lv1</label>
							<input type='text' className='form-control' placeholder='Type in keyword' value={this.state.eventLv1} onChange={(e) => this.handleChange('eventLv1', e)} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Home</label>
							<input type='text' className='form-control' placeholder='Type in keyword' value={this.state.homeValue} onChange={(e) => this.handleChange('homeValue', e)} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Away</label>
							<input type='text' className='form-control' placeholder='Type in keyword' value={this.state.awayValue} onChange={(e) => this.handleChange('awayValue', e)} />
						</div>
					</div>
				</div>
				<div className='row mg-w010'>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>K.O Time / Game Start Time</label>
							<Calendar
								key={`gameStartTime-${calendarVersion}`}
								value={this.state.dateTimeGameStart}
								onChange={(e) => this.dateChange('dateTimeGameStart', e)} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>User ID</label>
							<input type='text' className='form-control' placeholder='Type in keyword' value={this.state.userId} onChange={(e) => this.handleChange('userId', e)} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>User Role</label>
							<SelectCom key='userRole' datas={selectdata.userRole} selectedVal={this.state.userRole} handleVal={(e) => this.handleChange('userRole', e)} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>System Function</label>
							<SelectCom key='systemFunc' datas={selectdata.systemFunc} selectedVal={this.state.systemFunc} handleVal={(e) => this.handleChange('systemFunc', e)} />
						</div>
					</div>
				</div>
				<div className='row mg-w010'>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Bet Type / Feature</label>
							<SelectCom key='betTypeFeature' datas={selectdata.betTypeFeature} selectedVal={this.state.betTypeFeature} handleVal={(e) => this.handleChange('betTypeFeature', e)} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Device</label>
							<SelectCom key='device' datas={selectdata.device} selectedVal={this.state.device} handleVal={(e) => this.handleChange('device', e)} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className={ipClass}>
							<label>IP Address</label>
							<input type='text' className='form-control' placeholder='Type in keyword' value={this.state.ipAddress} onChange={(e) => this.handleChange('ipAddress', e)} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Error Code</label>
							<input type='text' className='form-control' placeholder='Type in keyword' value={this.state.errorCode} onChange={(e) => this.handleChange('errorCode', e)} />
						</div>
					</div>
				</div>
				<div className='pannel-footer'>
					<div className='item-text'>{this.renderTipsText()}</div>
					<div className='item-after'>
						<button type='button' className='btn btn-link' onClick={() => this.handleReset()}>Reset</button>
						<button type='button' className='btn btn-primary' onClick={() => this.handleSubmit()}>Search</button>
					</div>
				</div>
			</div>
		</div>
	}
}

SearchEnquiryPanel.propTypes = {
	selectedFilters: React.PropTypes.array,
	setFilterEvent: React.PropTypes.func
}

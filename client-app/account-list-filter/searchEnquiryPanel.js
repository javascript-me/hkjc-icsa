import React from 'react'
import SearchEnquiryDataService from './searchEnquiryPanel-service'
import Moment from 'moment'
import DateTime from '../dateTime/dateTime'
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
	dateTimeFrom.setFullYear(1900)
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
	dateTimeTo.setFullYear(2050)
	dateTimeToObj.timestamp = Date.parse(dateTimeTo)
	dateTimeToObj.datetime = Moment(dateTimeTo).format('DD MMM YYYY HH:mm')
	return dateTimeToObj
}

const originState = {
	dateTimeFrom: getOrginDateTimeFrom(),
	dateTimeTo: getOrginDateTimeTo(),
	position: '',
	userRole: '',
	accountStatus: ''

}

let tokenKeyPress = null
let tokenRemoveFilter = null

export default class SearchEnquiryPanel extends React.Component {

	constructor (props) {
		super(props)
		this.state = Object.assign({
			tokens: {
				USERPROFILE_SEARCH_BY_KEY_PRESS: 'AUDITLOG_SEARCH_BY_KEY_PRESS',
				USERPROFILE_SEARCH_BY_REMOVE_FILTER: 'USERPROFILE_SEARCH_BY_REMOVE_FILTER'
			}
		}, originState)

		this.setState(this.props.selectedFilters)

		this.handleSubmit = this.handleSubmit.bind(this)
	}

	componentDidMount () {
		tokenKeyPress = PubSub.subscribe(PubSub[this.state.tokens.USERPROFILE_SEARCH_BY_KEY_PRESS], () => {
			this.handleSubmit()
		})

		tokenRemoveFilter = PubSub.subscribe(PubSub[this.state.tokens.USERPROFILE_SEARCH_BY_REMOVE_FILTER], (topic, filter) => {
			let newState = {}

			newState[filter.name] = originState[filter.name]
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

	isValidDateTime (str) {
		return Moment(str, 'DD MMM YYYY HH:mm', true).isValid()
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
		 return this.state.tipsFlag || (this.state.dateTimeTo.timestamp > this.state.dateTimeFrom.timestamp)
		
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

		this.setState(newState)
	}

	getEnquiries (src) {
		let result = {}
		let needReturnEnquiries = [
			'dateTimeFrom',
			'dateTimeTo',
			'position',
			'accountStatus',
			'userRole'
		]
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
		let { errorDateTimeFrom, errorDateTimeTo, dateTimeTo, dateTimeFrom, tipsFlag } = this.state
		let fromClass = 'form-group'
		let toClass = 'form-group'
		// let dateTimeGameStartClass = 'form-group'
		// let ipClass = 'form-group'
		if (tipsFlag === 0 && errorDateTimeFrom === 0) {
			fromClass = 'form-group has-error'
		}
		if (tipsFlag === 0 && errorDateTimeTo === 0) {
			toClass = 'form-group has-error'
		}
		// if (tipsFlag === 0 && errorDateTimeGameStart === 0) {
		// 	dateTimeGameStartClass = 'form-group has-error'
		// }
		// if (tipsFlag === 0 && errorIPAddress === 0) {
		// 	ipClass = 'form-group has-error'
		// }
		if (tipsFlag === 0 && dateTimeTo.timestamp < dateTimeFrom.timestamp) {
			fromClass = 'form-group has-error'
			toClass = 'form-group has-error'
		}
		return <div className='component-search-enquiry-panel' style={{width: '680px', zIndex: 1, position: 'relative'}}>
			<div className='container-fluid pd-w10'>
				<div className='row mg-w010'>
					<div className='col-sm-4 pd-w10'>
						<div className='form-group'>
							<label>Position / Title</label>
							<SelectCom key='position' datas={selectdata.position} selectedVal={this.state.position} handleVal={(e) => this.handleChange('position', e)} />
						</div>
					</div>
					<div className='col-sm-4 pd-w10'>
						<div className='form-group'>
							<label>User Roles</label>
							<SelectCom key='Roles' datas={selectdata.userRole} selectedVal={this.state.userRole} handleVal={(e) => this.handleChange('userRole', e)} />
						</div>
					</div>
					<div className='col-sm-4 pd-w10'>
						<div className='form-group'>
							<label>Account status</label>
							<SelectCom key='AccountStatus' datas={selectdata.accountStatus} selectedVal={this.state.accountStatus} handleVal={(e) => this.handleChange('accountStatus', e)} />
						</div>
					</div>

				</div>
				<div className='row mg-w010'>
					<div className='col-sm-4 pd-w10'>
						<div className={fromClass}>
							<label>Date of Activation</label>
							<DateTime inputFor='dateTimeFrom' dateTime={dateTimeFrom.datetime} handleVal={(e) => { this.handleChange('dateTimeFrom', e) }} />
						</div>
					</div>
					<div className='col-sm-4 pd-w10'>
						<div className={toClass}>
							<label>Date of Inactivation</label>
							<DateTime inputFor='dateTimeTo' dateTime={dateTimeTo.datetime} handleVal={(e) => this.handleChange('dateTimeTo', e)} />
						</div>
					</div>
				</div>

				<div className='pannel-footer'>
					<div className='item-text'>{' '}</div>
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

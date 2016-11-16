import React from 'react'
import SearchEnquiryDataService from './searchEnquiryPanel-service'
import DateTime from '../dateTime/dateTime'
import SelectCom from '../select/select'

const datas = SearchEnquiryDataService.getData();

export default class SearchEnquiryPanel extends React.Component {

	constructor (props) {
		super(props)
		this.state = {
			datas: datas,
			tipsFlag: 1,
			errorDateTimeFrom: 0,
			errorDateTimeTo: 0,
			errorIPAddress: 0
		}
	}

	renderTipsText () {
		let { datas, errorDateTimeFrom, errorDateTimeTo, errorIPAddress, tipsFlag } = this.state;
		if (tipsFlag === 0 && (errorDateTimeTo === 0 || errorDateTimeFrom === 0 || errorIPAddress === 0 || datas.dateTimeTo < datas.dateTimeFrom)) {
			return <span className='color-red'>* Invalid fields are highlighted in red</span>
		} else {
			return <span className='color-blue'>* These fields are mandatory</span>
		}
	}

	handleChange (name, event) {
		let newState = {}
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
			if (reg.test(event.target.value)) {
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

	handleSubmit () {
		this.setState({
			tipsFlag: 0
		})
	}

	handleReset () {
		this.setState({
			tipsFlag: 1
		})
	}

	render () {
		let { datas, errorDateTimeFrom, errorDateTimeTo, errorIPAddress, tipsFlag } = this.state
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
		if (tipsFlag === 0 && datas.dateTimeTo < datas.dateTimeFrom) {
			fromClass = 'form-group has-error'
			toClass = 'form-group has-error'
		}
		return <div className='component-search-enquiry-panel'>
			<div className='container-fluid pd-w10'>
				<div className='row mg-w010'>
					<div className='col-sm-3 pd-w10'>
						<div className={fromClass}>
							<label>Date Time From <span>*</span></label>
							<DateTime inputFor='dateTimeFrom' dateTime={datas.dateTimeFrom} handleVal={this.handleChange.bind(this, 'dateTimeFrom')} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className={toClass}>
							<label>Date Time To <span>*</span></label>
							<DateTime inputFor='dateTimeTo' dateTime={datas.dateTimeTo} handleVal={this.handleChange.bind(this, 'dateTimeTo')} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Type</label>
							<SelectCom datas={datas.typeValue} handleVal={this.handleChange.bind(this, 'typeValue')} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Back End ID</label>
							<input type='text' className='form-control' placeholder='Type in keyword' onChange={this.handleChange.bind(this, 'backEndID')} />
						</div>
					</div>
				</div>
				<div className='row mg-w010'>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Front End ID</label>
							<input type='text' className='form-control' placeholder='Type in keyword' onChange={this.handleChange.bind(this, 'frontEndID')} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Event Lv1</label>
							<input type='text' className='form-control' placeholder='Type in keyword' onChange={this.handleChange.bind(this, 'eventLv1')} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Home</label>
							<input type='text' className='form-control' placeholder='Type in keyword' onChange={this.handleChange.bind(this, 'homeValue')} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Away</label>
							<input type='text' className='form-control' placeholder='Type in keyword' onChange={this.handleChange.bind(this, 'awayValue')} />
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
							<input type='text' className='form-control' placeholder='Type in keyword' onChange={this.handleChange.bind(this, 'userId')} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>User Role</label>
							<SelectCom datas={datas.userRole} handleVal={this.handleChange.bind(this, 'userRole')} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>System Function</label>
							<SelectCom datas={datas.systemFunc} handleVal={this.handleChange.bind(this, 'systemFunc')} />
						</div>
					</div>
				</div>
				<div className='row mg-w010'>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Bet Type/Feature</label>
							<SelectCom datas={datas.betType} handleVal={this.handleChange.bind(this, 'betType')} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Device</label>
							<SelectCom datas={datas.device} handleVal={this.handleChange.bind(this, 'device')} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className={ipClass}>
							<label>IP Address</label>
							<input type='text' className='form-control' placeholder='Type in keyword' onChange={this.handleChange.bind(this, 'ipAddress')} />
						</div>
					</div>
					<div className='col-sm-3 pd-w10'>
						<div className='form-group'>
							<label>Error Code</label>
							<input type='text' className='form-control' placeholder='Type in keyword' onChange={this.handleChange.bind(this, 'errorCode')} />
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

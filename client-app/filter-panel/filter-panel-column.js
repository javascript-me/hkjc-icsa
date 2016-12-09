import React from 'react'
import Calendar from '../calendar'
import SelectCom from '../select/select'

const emptyFn = () => {}

export default React.createClass({
	displayName: 'FilterPanelRow',
	propTypes: {
		filterName: React.PropTypes.string.isRequired,
		filterTitle: React.PropTypes.string.isRequired,
		filterValue: React.PropTypes.any,
		isRequired: React.PropTypes.bool,
		customVerification: React.PropTypes.oneOfType([
			React.PropTypes.func,
			React.PropTypes.instanceOf(RegExp)
		]),
		pairingVerify: React.PropTypes.arrayOf(React.PropTypes.shape({
			operation: React.PropTypes.oneOf(['>', '>=', '==', '<=', '<']).isRequired,
			partners: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
		})),
		dataSource: React.PropTypes.array,
		ctrlType: React.PropTypes.oneOf(['textbox', 'select', 'multi-select', 'calendar']),
		onChange: React.PropTypes.func,
		doPairingVerify: React.PropTypes.func
	},
	getDefaultProps: function () {
		return {
			filterValue: '',
			isRequired: false,
			ctrlType: 'textbox',
			pairingVerify: [],
			onChange: emptyFn,
			doPairingVerify: emptyFn
		}
	},
	getInitialState () {
		return {
			isValid: true,
			displayValue: this.props.filterValue,
			submittedValue: ''
		}
	},
	componentDidMount: function () {
	},

	componentWillUnmount: function () {

	},
	handleTextChange: function (e) {
		this.setState({
			displayValue: e.target.value
		})

		this.handleChange(this.props.filterName, e.target.value)
	},
	handleDateChange: function (date) {
		this.setState({
			displayValue: date
		})

		this.handleChange(this.props.filterName, date)
	},
	handleSelectChange: function (e) {
		this.setState({
			displayValue: e.target.value
		})

		this.handleChange(this.props.filterName, e.target.value)
	},
	handleChange: function(name, value) {
		let isValid = this.verifyFilterValidation()

		this.setState({
			isValid: isValid
		})

		this.props.onChange(name, value, isValid)
	},
	verifyFilterValidation: function() {
		let isValid = true
		let filterName = this.props.filterName
		let filterValue = this.state.displayValue
		let customVerification = this.props.customVerification
		let pairingVerify = this.props.pairingVerify
		let typeofCustomerVerify = Object.prototype.toString.call(customVerification)
		let typeofPairingVerify = Object.prototype.toString.call(pairingVerify)

		// Step 1 check does column required and has value or not
		if(isValid && this.props.isRequired) {
			isValid = !!filterValue
		}

		// Step 2 check column by props.customVerification
		if(isValid && filterValue && typeofCustomerVerify !== 'undefined') {
			if(typeofCustomerVerify === '[object Function]') {
				isValid = customVerification(filterValue)
			} else if(typeofCustomerVerify === '[object RegExp]') {
				isValid = customVerification.test(filterValue)
			}
		}

		// Step 3 check column by props.pairingVerify
		if(isValid && filterValue && typeofPairingVerify === '[object Array]' && typeofPairingVerify.length) {
			isValid = this.props.doPairingVerify(filterValue, pairingVerify)
		}

		return isValid;
	},
	getCtrl: function () {
		let ctrl

		switch (this.props.ctrlType) {
		case 'textbox':
			ctrl = this.getTextboxCtrl()
			break
		case 'calendar':
			ctrl = this.getCalendarCtrl()
			break
		case 'select':
			ctrl = this.getSelectCtrl()
			break
		default:
			break
		}
		return ctrl
	},
	getTextboxCtrl: function () {
		return <input type='text'
			className='form-control'
			placeholder='Type in keyword'
			value={this.state.displayValue}
			onChange={this.handleTextChange} />
	},
	getCalendarCtrl: function () {
		return <Calendar
			defaultValue={this.props.filterValue}
			warning={!this.state.isValid}
			onChange={this.handleDateChange} />
	},
	getSelectCtrl: function () {
		return <SelectCom
			key={this.props.filterName}
			datas={this.props.dataSource}
			selectedVal={this.state.displayValue}
			handleVal={this.handleTextChange} />
	},
	render: function () {
		return <div className='form-group'>
			<label>{this.props.filterTitle} {this.props.isRequired ? <span>*</span> : ''}</label>
			{this.getCtrl()}
		</div>
	}
})


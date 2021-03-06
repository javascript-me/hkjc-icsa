import React from 'react'
import Moment from 'moment'
import Calendar from '../calendar'
import SelectCom from '../select/select'
import MultiSelect from '../muti-select'

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
		doPairingVerify: React.PropTypes.func,
		registerColumnHandles: React.PropTypes.func
	},
	getDefaultProps: function () {
		return {
			isRequired: false,
			ctrlType: 'textbox',
			pairingVerify: [],
			onChange: emptyFn,
			doPairingVerify: emptyFn,
			registerColumnHandles: emptyFn
		}
	},
	getInitialState: function () {
		return {
			isValid: true,
			showWarning: false,
			filterValue: undefined
		}
	},
	componentDidMount: function () {
		let p = this.props

		this.setState({
			isValid: this.initialIsValid(),
			filterValue: this.getDefaultStateFilterValue()
		})

		p.registerColumnHandles(p.filterName, this.generateResetHandle(), this.generateSetValidHandle(), this.generateShowErrorHandle())
	},
	componentWillUnmount: function () {

	},
	initialIsValid: function () {
		let isValid = this.verifyFilterValidation(this.props.filterValue)

		return isValid
	},
	getDefaultStateFilterValue: function () {
		if (this.props.ctrlType === 'multi-select') {
			return this.props.filterValue || []
		} else {
			return this.props.filterValue || ''
		}
	},
	generateResetHandle: function () {
		let defaultValue = this.getDefaultStateFilterValue()

		return () => {
			this.setState({
				filterValue: defaultValue,
				isValid: true,
				showWarning: false
			})
		}
	},
	generateSetValidHandle: function () {
		return isValid => {
			this.setState({
				isValid: isValid
			})
		}
	},
	generateShowErrorHandle: function () {
		return () => {
			this.setState({
				showWarning: true
			})
		}
	},
	handleTextChange: function (e) {
		this.setState({
			filterValue: e.target.value
		})

		this.handleChange(this.props.filterName, e.target.value)
	},
	/*
		@date {Moment} The new value provide by Calendar Component.
	*/
	handleDateChange: function (date) {
		let formattedDate

		// If origin typeof filterValue is string, should transform the date into string type and post to handleChange
		if (typeof this.props.filterValue === 'string') {
			formattedDate = date.format('DD MMM YYYY HH:mm')
		} else if (this.props.filterValue instanceof Moment) {
			// If origin typeof filterValue is Moment, just post parameter date to handleChange
			formattedDate = date
		} else {
			formattedDate = date
		}

		this.setState({
			filterValue: formattedDate
		})

		this.handleChange(this.props.filterName, formattedDate)
	},
	handleSelectChange: function (e) {
		this.setState({
			filterValue: e.target.value
		})

		this.handleChange(this.props.filterName, e.target.value)
	},
	handleMultiSelectChange: function (value) {
		this.setState({
			filterValue: value
		})

		this.handleChange(this.props.filterName, value)
	},
	handleChange: function (name, value) {
		let isValid = this.verifyFilterValidation(value)

		this.setState({
			isValid: isValid
		})

		this.props.onChange(name, value, isValid)
	},
	verifyFilterValidation: function (filterValue) {
		let isValid = true
		let customVerification = this.props.customVerification
		let pairingVerify = this.props.pairingVerify
		let typeofCustomerVerify = Object.prototype.toString.call(customVerification)
		let typeofPairingVerify = Object.prototype.toString.call(pairingVerify)

		// Step 1 check does column required and has value or not
		if (isValid && this.props.isRequired) {
			isValid = !!filterValue
		}

		// Step 2 check column by props.customVerification
		if (isValid && filterValue && typeofCustomerVerify !== '[object Undefined]') {
			if (typeofCustomerVerify === '[object Function]') {
				isValid = customVerification(filterValue)
			} else if (typeofCustomerVerify === '[object RegExp]') {
				isValid = customVerification.test(filterValue)
			}
		}

		// Step 3 check column by props.pairingVerify
		if (isValid && filterValue && typeofPairingVerify === '[object Array]' && pairingVerify.length) {
			isValid = this.props.doPairingVerify(filterValue, this.props.ctrlType, pairingVerify)
		}

		return isValid
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
		case 'multi-select':
			ctrl = this.getMultiSelectCtrl()
			break
		default:
			break
		}
		return ctrl
	},
	getTextboxCtrl: function () {
		let className = `form-control ${this.state.showWarning && !this.state.isValid ? 'has-error' : ''}`

		return <input type='text'
			className={className}
			placeholder='Type in keyword'
			value={this.state.filterValue}
			onChange={this.handleTextChange} />
	},
	getCalendarCtrl: function () {
		return <Calendar
			value={this.state.filterValue}
			warning={this.state.showWarning && !this.state.isValid}
			onChange={this.handleDateChange} />
	},
	getSelectCtrl: function () {
		return <SelectCom
			key={this.props.filterName}
			datas={this.props.dataSource}
			selectedVal={this.state.filterValue}
			warning={this.state.showWarning && !this.state.isValid}
			handleVal={this.handleTextChange} />
	},
	getMultiSelectCtrl: function () {
		const style = {
			width: '200px',
			height: '30px'
		}

		return <MultiSelect
			ref='ctrl'
			options={this.props.dataSource}
			style={style}
			selectedOptions={this.state.filterValue}
			onChange={this.handleMultiSelectChange} />
	},
	render: function () {
		return <div className='form-group'>
			<label className='column-title'>{this.props.filterTitle} {this.props.isRequired ? <span className='required'>*</span> : ''}</label>
			{this.getCtrl()}
		</div>
	}
})


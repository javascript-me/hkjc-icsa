import React from 'react'
import Calendar from '../calendar'
import SelectCom from '../select/select'

export default React.createClass({
	displayName: 'FilterPanelRow',
	propTypes: {
		filterName: React.PropTypes.string.isRequired,
		filterTitle: React.PropTypes.string.isRequired,
		filterValue: React.PropTypes.string,
		isRequired: React.PropTypes.bool,
		customVerification: React.PropTypes.oneOfType([
			React.PropTypes.func,
			React.PropTypes.instanceOf(RegExp)
		]),
		pairingVerify: React.PropTypes.arrayOf(React.PropTypes.shape({
			operation: React.PropTypes.oneOf(['>', '>=', '==', '<=', '<']).isRequired,
			partner: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
		})),
		dataSource: React.PropTypes.array,
		ctrlType: React.PropTypes.oneOf(['textbox', 'select', 'multi-select', 'calendar']),
		onChange: React.PropTypes.func
	},
	getDefaultProps: function () {
		return {
			filterValue: '',
			isRequired: false,
			ctrlType: 'textbox',
			onChange: function (e) {}
		}
	},
	getInitialState () {
		return {
			hasError: false,
			displayValue: this.props.filterValue,
			submittedValue: ''
		}
	},
	componentDidMount: function () {
	},

	componentWillUnmount: function () {

	},
	handleTextChange: function (e) {
		console.log('in text change', e)

		this.setState({
			displayValue: e.target.value
		})

		this.props.onChange(this.props.filterName, e.target.value)
	},
	handleDateChange: function (date) {
		this.setState({
			displayValue: date
		})

		this.props.onChange(this.props.filterName, date)
	},
	handleSelectChange: function (e) {
		console.log('in select change', e)

		this.setState({
			displayValue: e.target.value
		})

		this.props.onChange(this.props.filterName, e.target.value)
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
			warning={this.state.hasError}
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


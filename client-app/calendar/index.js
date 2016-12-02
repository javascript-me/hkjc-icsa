'use strict'

import React from 'react'
import DaysView from './DaysView'
import moment from 'moment'

const TYPES = React.PropTypes
const Datetime = React.createClass({

	viewComponents: {
		days: DaysView
	},

	propTypes: {
		onFocus: TYPES.func,
		onBlur: TYPES.func,
		onChange: TYPES.func,
		locale: TYPES.string,
		input: TYPES.bool,
		inputProps: TYPES.object,
		timeConstraints: TYPES.object,
		viewMode: TYPES.oneOf(['years', 'months', 'days']),
		isValidDate: TYPES.func,
		open: TYPES.bool,
		strictParsing: TYPES.bool,
		closeOnSelect: TYPES.bool,
		closeOnTab: TYPES.bool,
		value: TYPES.string,
		dateFormat: TYPES.string,
		timeFormat: TYPES.string,
		className: TYPES.string
	},

	componentDidMount: function () {
		window.addEventListener('mousedown', this.pageClick, false)
	},

	componentWillUnmount: function () {
		window.removeEventListener('mousedown', this.pageClick, false)
	},

	pageClick: function (e) {
		var source = e.target
		var found = false

		while (source.parentNode) {
			found = source === this.refs.container
			if (found) break
			source = source.parentNode
		}

		if (this.props.input && this.state.open && !this.props.open && !found) {
			this.closeCalendar()
		} else if (this.props.input && !this.state.open && !this.props.open && found) {
			this.openCalendar()
		}
	},

	getDefaultProps: function () {
		var nof = function () {}
		return {
			className: '',
			defaultValue: '',
			inputProps: {},
			input: true,
			onFocus: nof,
			onBlur: nof,
			onChange: nof,
			timeFormat: 'HH:mm',
			timeConstraints: {},
			dateFormat: 'DD MMM YYYY',
			strictParsing: true,
			closeOnSelect: false,
			closeOnTab: true
		}
	},

	getInitialState: function () {
		let state = this.getStateFromProps(this.props)

		if (state.open === undefined) {
			state.open = !this.props.input
		}

		state.currentView = this.props.dateFormat ? (this.props.viewMode || state.updateOn || 'days') : 'time'

		return state
	},

	getStateFromProps: function (props) {
		const formats = this.getFormats(props)
		const date = props.value || props.defaultValue
		let selectedDate
		let viewDate
		let updateOn
		let inputValue
		let timeValue
		let timeData = [0, 0]

		if (date && typeof date === 'string') {
			selectedDate = this.localMoment(date, formats.datetime)
		} else if (date) {
			selectedDate = this.localMoment(date)
		}

		if (selectedDate && !selectedDate.isValid()) {
			selectedDate = null
		}

		viewDate = selectedDate ? selectedDate.clone().startOf('month') : this.localMoment().startOf('month')

		updateOn = this.getUpdateOn(formats)

		if (selectedDate) {
			inputValue = selectedDate.format(formats.date)
			timeValue = selectedDate.format(formats.time)
			timeData = timeValue.split(':')
		} else if (date.isValid && !date.isValid()) {
			inputValue = ''
		} else {
			inputValue = date || ''
		}

		return {
			updateOn: updateOn,
			inputFormat: formats.datetime,
			viewDate: viewDate,
			selectedDate: selectedDate,
			inputValue: inputValue,
			hour: timeData[0],
			minutes: timeData[1],
			timeValue: timeValue,
			formats: formats,
			open: props.open,
			input: props.input
		}
	},

	getUpdateOn: function (formats) {
		if (formats.date.match(/[lLD]/)) {
			return 'days'
		} else if (formats.date.indexOf('M') !== -1) {
			return 'months'
		} else if (formats.date.indexOf('Y') !== -1) {
			return 'years'
		}

		return 'days'
	},

	getFormats: function (props) {
		let formats = {
			date: props.dateFormat || '',
			time: props.timeFormat || ''
		}
		const locale = this.localMoment(props.date).localeData()

		if (formats.date === true) {
			formats.date = locale.longDateFormat('L')
		} else if (this.getUpdateOn(formats) !== 'days') {
			formats.time = ''
		}

		if (formats.time === true) {
			formats.time = locale.longDateFormat('LT')
		}

		formats.datetime = formats.date && formats.time ? formats.date + ' ' + formats.time : formats.date || formats.time

		return formats
	},

	componentWillReceiveProps: function (nextProps) {
		const formats = this.getFormats(nextProps)
		let update = {}

		if (nextProps.value !== this.props.value) {
			update = this.getStateFromProps(nextProps)
		}
		if (formats.datetime !== this.getFormats(this.props).datetime) {
			update.inputFormat = formats.datetime
		}

		if (update.open === undefined) {
			if (this.props.closeOnSelect && this.state.currentView !== 'time') {
				update.open = false
			} else {
				update.open = this.state.open
			}
		}

		this.setState(update)
	},

	onTimeChange: function (currentDate, setter, value) {
		let update = {}

		if (currentDate.isValid() && this.state.selectedDate) {
			update.inputValue = currentDate[setter](value).format(this.state.formats.date)
			update.timeValue = currentDate[setter](value).format(this.state.formats.time)
			update.selectedDate = currentDate
			update.viewDate = currentDate.clone().startOf('month')
		} else {
			update.selectedDate = null
		}

		if (update.selectedDate) {
			return this.setState(update, function () {
				return this.props.onChange(currentDate)
			})
		}
	},

	onHourChange: function (e) {
		const value = e.target === null ? e : e.target.value
		const hour = value >= 0 && value < 24 ? value : null
		const viewDate = this.state.viewDate
		const currentDate = this.state.selectedDate || viewDate

		if (hour) {
			this.onTimeChange(currentDate, 'hour', hour)
			this.setState({ hour: hour })
		}
	},

	onMinutesChange: function (e) {
		const value = e.target === null ? e : e.target.value
		const minutes = value >= 0 && value < 60 ? value : null
		const viewDate = this.state.viewDate
		const currentDate = this.state.selectedDate || viewDate

		if (minutes) {
			this.onTimeChange(currentDate, 'minute', minutes)
			this.setState({ minutes: minutes })
		}
	},

	onInputKey: function (e) {
		if (e.which === 9 && this.props.closeOnTab) {
			this.closeCalendar()
		}
	},

	showView: function (view) {
		var me = this
		return function () {
			me.setState({ currentView: view })
		}
	},

	setDate: function (type) {
		const me = this
		const nextViews = {
			month: 'days',
			year: 'months'
		}

		return function (e) {
			me.setState({
				viewDate: me.state.viewDate.clone()[ type ](parseInt(e.target.getAttribute('data-value'), 10)).startOf(type),
				currentView: nextViews[ type ]
			})
		}
	},

	addTime: function (amount, type, toSelected) {
		return this.updateTime('add', amount, type, toSelected)
	},

	subtractTime: function (amount, type, toSelected) {
		return this.updateTime('subtract', amount, type, toSelected)
	},

	updateTime: function (op, amount, type, toSelected) {
		const me = this

		return function () {
			let update = {}
			const date = toSelected ? 'selectedDate' : 'viewDate'

			update[ date ] = me.state[ date ].clone()[ op ](amount, type)

			me.setState(update)
		}
	},

	updateSelectedDate: function (e, close) {
		const target = e.target
		let modifier = 0
		const viewDate = this.state.viewDate
		const currentDate = this.state.selectedDate || viewDate
		let date

		if (target.className.indexOf('rdtDay') !== -1) {
			if (target.className.indexOf('rdtNew') !== -1) {
				modifier = 1
			} else if (target.className.indexOf('rdtOld') !== -1) {
				modifier = -1
			}

			date = viewDate.clone().month(viewDate.month() + modifier).date(parseInt(target.getAttribute('data-value'), 10))
		} else if (target.className.indexOf('rdtMonth') !== -1) {
			date = viewDate.clone().month(parseInt(target.getAttribute('data-value'), 10)).date(currentDate.date())
		} else if (target.className.indexOf('rdtYear') !== -1) {
			date = viewDate.clone().month(currentDate.month()).date(currentDate.date()).year(parseInt(target.getAttribute('data-value'), 10))
		}

		// Set time base on Time Inputs
		date = this.state.hour ? date.hour(this.state.hour) : date
		date = this.state.minutes ? date.minutes(this.state.minutes) : date

		if (!this.props.value) {
			this.setState({
				selectedDate: date,
				viewDate: date.clone().startOf('month'),
				inputValue: date.format(this.state.formats.date),
				timeValue: date.format(this.state.formats.time),
				open: !(this.props.closeOnSelect && close)
			})
		} else {
			if (this.props.closeOnSelect && close) {
				this.closeCalendar()
			}
		}

		this.props.onChange(date)
	},

	openCalendar: function () {
		if (!this.state.open) {
			this.props.onFocus()
			this.setState({ open: true })
		}
	},

	closeCalendar: function () {
		this.setState({ open: false })
		this.props.onBlur(this.state.selectedDate || this.state.inputValue)
	},

	localMoment: function (date, format) {
		const m = moment(date, format, this.props.strictParsing)
		if (this.props.locale) {
			m.locale(this.props.locale)
		}
		return m
	},

	componentProps: {
		fromProps: ['value', 'isValidDate', 'renderDay', 'renderMonth', 'renderYear', 'timeConstraints'],
		fromState: ['viewDate', 'selectedDate', 'updateOn'],
		fromThis: ['setDate', 'setTime', 'showView', 'addTime', 'subtractTime', 'updateSelectedDate', 'localMoment', 'onHourChange', 'onMinutesChange', 'onMouseDown', 'onMouseUp']
	},

	getComponentProps: function () {
		const me = this
		const formats = this.getFormats(this.props)
		let props = {dateFormat: formats.date, timeFormat: formats.time}

		this.componentProps.fromProps.forEach((name) => {
			props[ name ] = me.props[ name ]
		})
		this.componentProps.fromState.forEach((name) => {
			props[ name ] = me.state[ name ]
		})
		this.componentProps.fromThis.forEach((name) => {
			props[ name ] = me[ name ]
		})

		return props
	},

	render: function () {
		const Component = this.viewComponents[ this.state.currentView ]
		let className = 'rdt' + (this.props.className ? (Array.isArray(this.props.className) ? ' ' + this.props.className.join(' ') : ' ' + this.props.className) : '')
		let children = []

		let isValid =  	[
			<input key='i' type='text' className='form-control calendar-input' readOnly value={this.state.inputValue} {...this.props.inputProps} />,
			<span key='sicon-time' className='input-group-addon time'><i className='icon-time' /></span>,
			<input key='t' type='text' className='form-control calendarTime-input' readOnly value={this.state.timeValue} {...this.props.inputProps} />
		]

		let isEmpty = <span key='empty-title' className='title'> Select Time </span>

		let content = this.state.selectedDate || this.props.value ? isValid : isEmpty

		if (this.props.input) {
			children = 	<div className='form-group calendar-group'>
				<div key='open' className='input-group' onClick={this.openCalendar}>
					{content}
					<span key='icon-open' className='input-group-addon'><i className='icon-date' /></span>
				</div>
			</div>
		} else {
			className += ' rdtStatic'
		}

		if (this.state.open) {
			className += ' rdtOpen'
		}

		return 	<div className='calendar' ref='container'>
			<div className={className}>
				{children}
				<div key='dt' className='rdtPicker'>
					{React.createElement(Component, this.getComponentProps())}
				</div>
			</div>
		</div>
	}
})

// Make moment accessible through the Datetime class
Datetime.moment = moment

module.exports = Datetime

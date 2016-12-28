'use strict'

import React from 'react'
import moment from 'moment'

let DateTimePickerDays = React.createClass({

	render: function () {
		const footer = this.renderFooter()
		const date = this.props.viewDate
		const locale = date.localeData()
		let tableChildren

		tableChildren = [
			<thead key='th' className='top'>
				<tr key='h'>
					<th key='p' className='rdtPrev'><span key='pspan' className='icon-arrow-left' onClick={this.props.subtractTime(1, 'months')} /></th>
					<th key='s' className='rdtSwitch' colSpan='5' data-value={this.props.viewDate.month()}>{ date.format('MMMM YYYY')}</th>
					<th key='n' className='rdtNext'><span key='nspan' className='icon-arrow-right' onClick={this.props.addTime(1, 'months')} /></th>
				</tr>
			</thead>,
			<thead key='thd' className='weekdays'>
				<tr key='d'>
					{ this.getDaysOfWeek(locale).map((day, index) => { return <th key={day + index} className='dow'>{day}</th> }) }
				</tr>
			</thead>,
			<tbody key='tb' className='body'>
				{ this.renderDays()}
			</tbody>
		]

		if (footer) {
			tableChildren.push(footer)
		}

		return 	<div className='rdtDays'>
			<table key='ctable'>{tableChildren}</table>
		</div>
	},

	/**
	 * Get a list of the days of the week
	 * depending on the current locale
	 * @return {array} A list with the shortname of the days
	 */
	getDaysOfWeek: function (locale) {
		const days = locale._weekdaysMin
		const first = locale.firstDayOfWeek()
		let dow = []
		let i = 0

		days.forEach((day) => {
			dow[ (7 + (i++) - first) % 7 ] = day.substr(0, 1)
		})

		return dow
	},

	setTimeToZero: function (moment) {
		moment.set({hour: 0, minute: 0, second: 0, millisecond: 0})
	},

	toScreenSize: function (totalItemCount) {
		if (totalItemCount === 28) return 28
		if (totalItemCount > 35) return 42

		return 35
	},

	calculateCalendarScreenSize: function (startTime, endTime) {
		this.setTimeToZero(startTime)
		this.setTimeToZero(endTime)

		let totalItemCount = endTime.diff(startTime, 'days') + 1

		return this.toScreenSize(totalItemCount)
	},

	renderDays: function () {
		const date = this.props.viewDate
		const selected = this.props.selectedDate && this.props.selectedDate.clone()
		const prevMonth = date.clone()
		const endOfMonth = date.clone()
		const currentYear = date.year()
		const currentMonth = date.month()
		let weeks = []
		let days = []
		const renderer = this.props.renderDay || this.renderDay
		const isValid = this.props.isValidDate || this.isValidDate
		let classes
		let disabled
		let dayProps
		let currentDate

		// Go to the last week of the previous month
		prevMonth.startOf('week')
		endOfMonth.endOf('month')

		let calendarScreenSize = this.calculateCalendarScreenSize(prevMonth, endOfMonth)

		const lastDay = prevMonth.clone().add(calendarScreenSize, 'd')

		while (prevMonth.isBefore(lastDay)) {
			classes = 'rdtDay'
			currentDate = prevMonth.clone()

			if ((prevMonth.year() === currentYear && prevMonth.month() < currentMonth) || (prevMonth.year() < currentYear)) {
				classes += ' rdtOld'
			} else if ((prevMonth.year() === currentYear && prevMonth.month() > currentMonth) || (prevMonth.year() > currentYear)) {
				classes += ' rdtNew'
			}

			if (selected && prevMonth.isSame(selected, 'day')) {
				classes += ' rdtActive'
			}

			if (prevMonth.isSame(moment(), 'day')) {
				classes += ' rdtToday'
			}

			disabled = !isValid(currentDate, selected)
			if (disabled) {
				classes += ' rdtDisabled'
			}

			dayProps = {
				key: prevMonth.format('M_D'),
				'data-value': prevMonth.date(),
				className: classes
			}

			if (!disabled) {
				dayProps.onClick = this.updateSelectedDate
			}

			days.push(renderer(dayProps, currentDate, selected))

			if (days.length === 7) {
				weeks.push(<tr key={prevMonth.format('M_D')}>{days}</tr>)
				days = []
			}

			prevMonth.add(1, 'd')
		}

		return weeks
	},

	updateSelectedDate: function (event) {
		this.props.updateSelectedDate(event, true)
	},

	onHourChange: function (e) {
		if (isNaN(this.refs.hour.value) || this.refs.hour.value > 23 || this.refs.hour.value < 0) {
			this.refs.hour.value = this.props.selectedDate.format('HH')
		} else {
			this.props.onHourChange(e)
		}
	},

	onMinutesChange: function (e) {
		if (isNaN(this.refs.minutes.value) || this.refs.minutes.value > 59 || this.refs.minutes.value < 0) {
			this.refs.minutes.value = this.props.selectedDate.format('mm')
		} else {
			this.props.onMinutesChange(e)
		}
	},

	renderDay: function (props, currentDate) {
		return <td {...props}>{currentDate.date()}</td>
	},

	renderFooter: function () {
		if (!this.props.timeFormat) {
			return ''
		}

		const date = this.props.selectedDate || this.props.viewDate
		return 	<tfoot key='tf'>
			<tr>
				<td colSpan='7' className='rdtTimeToggle'>
					<input key='hour' ref='hour' type='text' className='form-control input-hour' maxLength='2' onChange={(e) => this.onHourChange(e)} defaultValue={date.format('HH')} />
					<span key='separator-hour'>:</span>
					<input key='minutes' ref='minutes' type='text' className='form-control input-minutes' maxLength='2' onChange={(e) => this.onMinutesChange(e)} defaultValue={date.format('mm')} />
				</td>
			</tr>
		</tfoot>
	},

	isValidDate: function () { return 1 },

	propTypes: {
		onHourChange: React.PropTypes.func,
		onMinutesChange: React.PropTypes.func,
		selectedDate: React.PropTypes.object,
		updateSelectedDate: React.PropTypes.func,
		addTime: React.PropTypes.func,
		subtractTime: React.PropTypes.func,
		isValidDate: React.PropTypes.func,
		renderDay: React.PropTypes.func,
		timeFormat: React.PropTypes.string,
		viewDate: React.PropTypes.object
	}
})

module.exports = DateTimePickerDays

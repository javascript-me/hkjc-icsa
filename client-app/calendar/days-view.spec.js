import DaysView from './DaysView'
import {assert} from 'chai'
import {shallow} from 'enzyme'
import React from 'react'
import Moment from 'moment'

describe('Moment', () => {
	it('startOf() and endOf() should return correct values', () => {
		var time = Moment('26 Dec 2016 12:30:30', 'DD MMM YYYY HH:mm:ss')
		assert.equal('2016-12-26T12:30:30', time.format().substring(0, 19))
		time.startOf('week')
		assert.equal('2016-12-25T00:00:00', time.format().substring(0, 19))
		time.endOf('month')
		assert.equal('2016-12-31T23:59:59', time.format().substring(0, 19))
	})

	it('get the exact weekday in either Monday, Tuesday...', () => {
		var time1 = Moment('26 Dec 2016 12:30:30', 'DD MMM YYYY HH:mm:ss')
		assert.equal(1, time1.weekday())
		var time2 = Moment('27 Dec 2016 12:30:30', 'DD MMM YYYY HH:mm:ss')
		assert.equal(2, time2.weekday())

		var time3 = Moment('25 Dec 2016 12:30:30', 'DD MMM YYYY HH:mm:ss')
		assert.equal(0, time3.weekday())

		var time4 = Moment('24 Dec 2016 12:30:30', 'DD MMM YYYY HH:mm:ss')
		assert.equal(6, time4.weekday())
	})

	it('diff() can return distance of 2 moment', () => {
		var time1 = Moment('26 Dec 2016 12:30:30', 'DD MMM YYYY HH:mm:ss')
		var time2 = Moment('27 Dec 2016 12:30:30', 'DD MMM YYYY HH:mm:ss')
		assert.equal(-1, time1.diff(time2, 'days'))
		assert.equal(1, time2.diff(time1, 'days'))
	})

	it('set hour minute second, and millisecond to 0', () => {
		var time = Moment('26 Dec 2016 12:30:30', 'DD MMM YYYY HH:mm:ss')
		assert.equal('2016-12-26T12:30:30', time.format().substring(0, 19))
		time.utcOffset(0).set({hour:0,minute:0,second:0,millisecond:0})
		assert.equal('2016-12-26T00:00:00Z', time.format())
	})
})

describe('days view', () => {
	let instance

	beforeEach(function() {
		instance = shallow(<DaysView viewDate={Moment('21 Dec 2016 00:00:00', 'DD MMM YYYY HH:mm:ss')}
									 subtractTime={() => {}}
									 addTime={() => {}} />).instance()
	})

	it('calculateCalendarScreenSize() should return how many rows can be showed in calendar screen', () => {
		assert.equal(35, instance.calculateCalendarScreenSize(
			Moment('27 Nov 2016 00:00:00', 'DD MMM YYYY HH:mm:ss'),
			Moment('31 Dec 2016 00:00:00', 'DD MMM YYYY HH:mm:ss')))

		assert.equal(42, instance.calculateCalendarScreenSize(
			Moment('26 Jun 2016 00:00:00', 'DD MMM YYYY HH:mm:ss'),
			Moment('31 Jul 2016 00:00:00', 'DD MMM YYYY HH:mm:ss')))

		assert.equal(28, instance.calculateCalendarScreenSize(
			Moment('1 Feb 2015 00:00:00', 'DD MMM YYYY HH:mm:ss'),
			Moment('28 Feb 2015 00:00:00', 'DD MMM YYYY HH:mm:ss')))
	})

	it('setTimeToZero() can set hour, minute, second and millisecond to zero', () => {
		var moment = Moment('26 Dec 2016 12:30:30', 'DD MMM YYYY HH:mm:ss')

		assert.equal('2016-12-26T12:30:30+08:00', moment.format())
		instance.setTimeToZero(moment)
		assert.equal('2016-12-26T00:00:00+08:00', moment.format())
	})

	it('toScreenSize() can return value of 7 * n', () => {
		assert.equal(28, instance.toScreenSize(28))
		assert.equal(35, instance.toScreenSize(29))
		assert.equal(35, instance.toScreenSize(35))
		assert.equal(42, instance.toScreenSize(36))
		assert.equal(35, instance.toScreenSize(10))
	})
})

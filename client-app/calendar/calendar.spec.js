import React from 'react'
import { shallow, mount } from 'enzyme'

import Calendar from './'

describe('Calendar', () => {
	it(' Create', () => {
		const calendar = shallow(<Calendar />)
		expect(calendar.find('span.title')).to.have.length(1)
		expect(calendar.find('span.input-group-addon')).to.have.length(1)
		expect(calendar.find('div.rdtPicker')).to.have.length(1)
	})

	it(' accept changes', () => {
		jsdom()
		const calendar = mount(<Calendar dateFormat='DD MMM YYYY' timeFormat='HH:mm' />)
		calendar.find('.input-group').simulate('click')
		expect(calendar.find('.rdtOpen')).to.have.length(1)
		expect(calendar.find('.rdtToday')).to.have.length(1)
		calendar.find('.rdtToday').simulate('click')
		expect(calendar.find('input.calendar-input')).to.have.length(1)
		expect(calendar.find('input.calendar-input').node.value).to.not.equal('')
	})

	it(' changes hour', () => {
		jsdom()
		const calendar = mount(<Calendar dateFormat='DD MMM YYYY' timeFormat='HH:mm' />)
		calendar.find('.input-group').simulate('click')
		expect(calendar.find('.rdtOpen')).to.have.length(1)
		expect(calendar.find('.rdtToday')).to.have.length(1)
		calendar.find('.rdtToday').simulate('click')
		expect(calendar.find('input.calendar-input')).to.have.length(1)
		calendar.find('input.input-hour').simulate('change', {target: {value: '20'}})
		expect(calendar.find('input.calendarTime-input').node.value.split(':')[0]).to.be.equal('20')
	})

	it(' changes minutes', () => {
		jsdom()
		const calendar = mount(<Calendar dateFormat='DD MMM YYYY' timeFormat='HH:mm' />)
		calendar.find('.input-group').simulate('click')
		expect(calendar.find('.rdtOpen')).to.have.length(1)
		expect(calendar.find('.rdtToday')).to.have.length(1)
		calendar.find('.rdtToday').simulate('click')
		expect(calendar.find('input.calendar-input')).to.have.length(1)
		calendar.find('input.input-minutes').simulate('change', {target: {value: '20'}})
		expect(calendar.find('input.calendarTime-input').node.value.split(':')[1]).to.be.equal('20')
	})

	it(' with Date value', () => {
		const calendar = shallow(<Calendar dateFormat='DD MMM YYYY' timeFormat='HH:mm' value='26 Aug 2006 16:45' />)
		expect(calendar.find('span.title')).to.have.length(0)
		expect(calendar.find('input.calendar-input')).to.have.length(1)
		expect(calendar.find('span.time')).to.have.length(1)
		expect(calendar.find('input.calendarTime-input')).to.have.length(1)
		expect(calendar.find('input.calendar-input').node.props).to.have.property('value', '26 Aug 2006')
		expect(calendar.find('input.calendarTime-input').node.props).to.have.property('value', '16:45')
	})

	it(' do not allow changes with Date value', () => {
		jsdom()
		const calendar = mount(<Calendar dateFormat='DD MMM YYYY' timeFormat='HH:mm' value='26 Aug 2006 16:45' />)
		calendar.find('.input-group').simulate('click')
		expect(calendar.find('.rdtOpen')).to.have.length(1)
		expect(calendar.find('.rdtDay').find('[data-value=20]')).to.have.length(1)
		calendar.find('.rdtDay').find('[data-value=20]').simulate('click')
		expect(calendar.find('input.calendar-input').node).to.have.property('value', '26 Aug 2006')
	})

	it(' increase Month', () => {
		jsdom()
		const calendar = mount(<Calendar dateFormat='DD MMM YYYY' timeFormat='HH:mm' />)
		calendar.find('.input-group').simulate('click')
		const current = calendar.find('.rdtSwitch').text()
		calendar.find('.icon-arrow-right').simulate('click')
		expect(calendar.find('.rdtSwitch').text()).to.not.equal(current)
	})

	it(' decrease Month', () => {
		jsdom()
		const calendar = mount(<Calendar dateFormat='DD MMM YYYY' timeFormat='HH:mm' />)
		calendar.find('.input-group').simulate('click')
		const current = calendar.find('.rdtSwitch').text()
		calendar.find('.icon-arrow-left').simulate('click')
		expect(calendar.find('.icon-arrow-left').text()).to.not.equal(current)
	})
})

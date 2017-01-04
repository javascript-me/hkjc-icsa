import React from 'react'
import { shallow } from 'enzyme'

import ActionMonitor from './action-monitor.js'

// const tableData = []

describe('<ActionMonitor />', () => {
	it('test render', () => {
		const wrapper = shallow(<ActionMonitor />)
		wrapper.setState({version: 100})
		const instance = wrapper.instance()
		expect(wrapper.find('div.action-monitor')).to.have.length(1)

		let result = instance.priorityFormatter('Critical')
		expect(result).to.not.be.null
		result = instance.priorityFormatter('High')
		expect(result).to.not.be.null
		result = instance.priorityFormatter('Medium')
		expect(result).to.not.be.null
		result = instance.priorityFormatter('Low')
		expect(result).to.not.be.null
		result = instance.priorityFormatter('nostatus')
		expect(result).to.be.undefined

		result = instance.detailFormatter('some detail', {priority: 'Critical'})
		expect(result).to.not.be.null
		result = instance.detailFormatter('some detail', {priority: 'High'})
		expect(result).to.not.be.null

		result = instance.assigneeFormatter('cell', {assigneeUserName: 'myname'})
		expect(result).to.not.be.null
		result = instance.assigneeFormatter('cell', {assigneeUserRoles: 'Trading Supervisor'})
		expect(result).to.not.be.null
		result = instance.assigneeFormatter('cell', {assigneeDepartmentId: 'TR'})
		expect(result).to.not.be.null
	})
})

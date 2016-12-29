import React from 'react'
// import sinon from 'sinon'
import { shallow, mount } from 'enzyme'
import TaskDetail from './'
import Popup from '../popup'

const simpleTask = {
	'taskID': 'TK1',
	'taskName': 'MUN vs ABC - POSITION 90%',
	'priority': 'Critical',
	'taskDescription': '<Odds Compilation Task> has been assigned to you due to the odds re-finalisation. Please kindly complete your Odds Compilation Task ASAP.',
	'category': 'Before Sell',
	'assigneeUserID': 'JC10001',
	'assigneeUserRoles': '',
	'assigneeDepartmentId': '',
	'taskStatus': 'New',
	'distributionDateTime': '27 Dec 2016 08:30:00',
	'targetCompletionDateTime': '28 Dec 2016 09:30:00',
	'taskType': 'simple',
	'buttonName': 'Odds Adjustment Panel',
	'lockStatus': 0
}

const advanceTask = {
	'taskID': 'TK4',
	'taskName': 'MUN vs ABC - POSITION 90%',
	'priority': 'Critical',
	'taskDescription': '<Odds Compilation Task> has been assigned to you due to the odds re-finalisation. Please kindly complete your Odds Compilation Task ASAP.',
	'category': 'In-Play',
	'assigneeUserID': 'JC10003',
	'assigneeUserRoles': '',
	'assigneeDepartmentId': '',
	'taskStatus': 'New',
	'distributionDateTime': '5 Jan 2017 18:30:00',
	'targetCompletionDateTime': '26 Oct 2017 09:30:00',
	'taskType': 'advance',
	'buttonName': 'Odds Adjustment Panel',
	'lockStatus': 0
}

const exacuteTask = {
	'taskID': 'TK3',
	'taskName': 'MUN vs ABC - POSITION 90%',
	'priority': 'High',
	'taskDescription': 'Event Template <Event Level 3> has been expired, please update!',
	'category': 'Pre-Event',
	'assigneeUserID': '',
	'assigneeUserRoles': '',
	'assigneeDepartmentId': 'TR',
	'taskStatus': 'Expired',
	'distributionDateTime': '24 Sep 2016 08:30:00',
	'targetCompletionDateTime': '26 Oct 2016 09:30:00',
	'taskType': 'execute',
	'buttonName': 'Odds Adjustment Panel',
	'lockStatus': 2
}

describe('<TaskDetail />', () => {
	it('task detail component should mount', () => {
		let wrapper = shallow(<TaskDetail />)
		expect(wrapper.find('.task-detail-box')).to.have.length(1)
	})
	it('task detail popup should be hide', () => {
		let wrapper = shallow(<TaskDetail />)
		expect(wrapper.find(Popup)).to.have.length(1)
	})
	it('task detail popup should be open', () => {
		let wrapper = mount(<TaskDetail />)
		let instance = wrapper.instance()
		instance.showTask()
		expect(wrapper.find('.info-part')).to.have.length(1)
	})

	it('rander a simpleTask', () => {
		let wrapper = mount(<TaskDetail taskInfo={simpleTask} />)
		let instance = wrapper.instance()
		instance.showTask()
		expect(instance.getTitleColor()).to.equal('#85B612')
		expect(wrapper.find('.value').first().text()).to.equal('New')
	})
	it('rander a advanceTask', () => {
		let wrapper = mount(<TaskDetail taskInfo={advanceTask} />)
		let instance = wrapper.instance()
		instance.showTask()
		expect(wrapper.find('.btn.confirm')).to.have.length(1)
	})
	it('rander a exacuteTask', () => {
		let wrapper = mount(<TaskDetail taskInfo={exacuteTask} />)
		let instance = wrapper.instance()
		instance.showTask()
		expect(wrapper.find('.btn.confirm').text().trim()).to.equal(exacuteTask.buttonName.trim())
		expect(wrapper.find('.icon.assign-to-me')).to.have.length(1)
	})
})

import {assert} from 'chai'
import {shallow} from 'enzyme'
import React from 'react'
import Notifications from './notifications'
import PanelPosition from './panel-position'

describe('Basic feature', () => {
	it('Array.filter() should not change original data', () => {
		var values = [1, 2, 3]
		var filteredValues = values.filter((element) => {
			return element === 1
		})
		assert.equal(3, values.length)
		assert.equal(1, filteredValues.length)
	})

	it('PanelPosition can return 2 values', () => {
		assert.equal('bottom', PanelPosition.BOTTOM)
		assert.equal('right', PanelPosition.RIGHT)
	})
})

describe('Notifications UI', () => {
	it('A popup will show when user click configuration icon in task panel', () => {
		let wrapper = shallow(<Notifications isSlim
			noticeboardVisible
			broadcastVisible
			taskVisible
		/>)
		assert.equal(1, wrapper.find('.noticeboard-popup-style').length)

		let instance = wrapper.instance()

		assert.equal(PanelPosition.BOTTOM, instance.state.noticeboardAndBroadcastPanelPosition)
		assert.equal(PanelPosition.BOTTOM, instance.state.taskPanelPosition)
		assert.equal(PanelPosition.BOTTOM, instance.state.selectedNoticeboardAndBroadcastPanelPosition)
		assert.equal(PanelPosition.BOTTOM, instance.state.selectedTaskPanelPosition)
	})

	it('getTaskClassName() should return correct class name', () => {
		let instance0 = shallow(<Notifications isSlim
			noticeboardVisible
			broadcastVisible
			taskVisible />).instance()
		assert.equal('bottom-task-container full-width', instance0.getTaskClassName())

		let instance1 = shallow(<Notifications isSlim
			noticeboardVisible
			broadcastVisible
			taskVisible />).instance()
		instance1.state.taskPanelPosition = PanelPosition.RIGHT
		instance1.state.noticeboardAndBroadcastPanelPosition = PanelPosition.BOTTOM
		assert.equal('right-task-container slim-gap bottom-single-panel-gap', instance1.getTaskClassName())
	})

	it('getBroadcastClassName() should return correct class name', () => {
		let instance0 = shallow(<Notifications isSlim
			noticeboardVisible
			broadcastVisible
			taskVisible />).instance()
		assert.equal('bottom-broadcast-container half-width left-50-percent-gap bottom-single-panel-gap', instance0.getBroadcastClassName())
	})

	it('getNoticeboardClassName() should return correct class name', () => {
		let instance0 = shallow(<Notifications isSlim
			noticeboardVisible
			broadcastVisible
			taskVisible />).instance()
		assert.equal('bottom-noticeboard-container half-width bottom-single-panel-gap', instance0.getNoticeboardClassName())

		let instance1 = shallow(<Notifications isSlim
			noticeboardVisible={false}
			broadcastVisible
			taskVisible />).instance()
		assert.equal('bottom-noticeboard-container hidden full-width bottom-single-panel-gap', instance1.getNoticeboardClassName())

		let instance2 = shallow(<Notifications isSlim
			noticeboardVisible={false}
			broadcastVisible
			taskVisible={false} />).instance()
		assert.equal('bottom-noticeboard-container hidden full-width', instance2.getNoticeboardClassName())

		let instance3 = shallow(<Notifications isSlim
			noticeboardVisible={false}
			broadcastVisible
			taskVisible={false} />).instance()
		instance3.state.noticeboardAndBroadcastPanelPosition = PanelPosition.RIGHT
		assert.equal('right-noticeboard-container hidden full-height', instance3.getNoticeboardClassName())

		let instance4 = shallow(<Notifications isSlim
			noticeboardVisible={false}
			broadcastVisible
			taskVisible />).instance()
		instance4.state.noticeboardAndBroadcastPanelPosition = PanelPosition.RIGHT
		instance4.state.taskPanelPosition = PanelPosition.RIGHT
		assert.equal('right-noticeboard-container hidden full-height right-task-panel-gap', instance4.getNoticeboardClassName())
	})

	it('getVerticalTwoPanelsClassName() should return correct class name', () => {
		let instance0 = shallow(<Notifications isSlim
			noticeboardVisible
			broadcastVisible
			taskVisible />).instance()
		assert.equal('vertical-two-panels slim-gap bottom-single-panel-gap', instance0.getVerticalTwoPanelsClassName())

		let instance1 = shallow(<Notifications isSlim={false}
			noticeboardVisible
			broadcastVisible
			taskVisible />).instance()
		assert.equal('vertical-two-panels bottom-single-panel-gap', instance1.getVerticalTwoPanelsClassName())

		let instance2 = shallow(<Notifications isSlim={false}
			noticeboardVisible
			broadcastVisible
			taskVisible={false} />).instance()
		instance2.state.taskPanelPosition = 'bottom'
		assert.equal('vertical-two-panels bottom-no-gap', instance2.getVerticalTwoPanelsClassName())

		let instance3 = shallow(<Notifications isSlim={false}
			noticeboardVisible
			broadcastVisible
			taskVisible />).instance()
		instance3.state.taskPanelPosition = 'right'
		assert.equal('vertical-two-panels bottom-no-gap', instance3.getVerticalTwoPanelsClassName())

		let instance4 = shallow(<Notifications isSlim={false}
			noticeboardVisible
			broadcastVisible
			taskVisible />).instance()
		instance4.state.taskPanelPosition = 'bottom'
		assert.equal('vertical-two-panels bottom-single-panel-gap', instance4.getVerticalTwoPanelsClassName())
	})
})


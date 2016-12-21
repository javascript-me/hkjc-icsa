import {assert} from 'chai'
import {shallow} from 'enzyme'
import React from 'react'
import Notifications from './notifications'

it('Array.filter() should not change original data', () => {
	var values = [1, 2, 3]
	var filteredValues = values.filter((element) => {
		return element === 1
	})
	assert.equal(3, values.length)
	assert.equal(1, filteredValues.length)
})

describe('Notifications UI', () => {
	it('A popup will show when user click configuration icon in task panel', () => {
		let wrapper = shallow(<Notifications isSlim
			noticeboardVisible
			broadcastVisible
			taskVisible
		/>)

		wrapper.find('.noticeboard-popup-style')
	})
})


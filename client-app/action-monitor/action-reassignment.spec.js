import React from 'react'
import { shallow } from 'enzyme'

import ActionReassignment from './action-reassignment'

describe('<ActionReassignment />', () => {
	it('test render', () => {
		const wrapper = shallow(<ActionReassignment />)
		expect(wrapper.find('div.action-reassignment')).to.have.length(1)
	})
})

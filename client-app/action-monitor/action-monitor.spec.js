import React from 'react'
import { shallow } from 'enzyme'

import ActionMonitor from './action-monitor'

describe('<ActionMonitor />', () => {
	it('test render', () => {
		const wrapper = shallow(<ActionMonitor />)
		expect(wrapper.find('div.action-monitor')).to.have.length(1)
	})
})

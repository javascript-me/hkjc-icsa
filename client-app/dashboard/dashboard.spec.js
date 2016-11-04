import React from 'react'
import { shallow } from 'enzyme'

import Dashboard from './dashboard'

describe('<Dashboard />', () => {
	it('renders a dashboard div', () => {
		const dashboard = shallow(<Dashboard />)
		expect(dashboard.find('div.dashboard')).to.have.length(1)
	})
})

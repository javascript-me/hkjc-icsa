import React from 'react'
import { shallow } from 'enzyme'

import UserProfile from './userprofile'

describe('<UserProfile />', () => {
	it('renders a UserProfile div', () => {
		const wrapper = shallow(<UserProfile />)
		expect(wrapper.find('div.user-profile')).to.have.length(1)
	})
})

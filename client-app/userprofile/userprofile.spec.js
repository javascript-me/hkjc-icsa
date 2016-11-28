import React from 'react'
import { shallow } from 'enzyme'

import UserProfile from './userprofile'

describe('<UserProfile />', () => {
	it('renders a UserProfile div', () => {
		const params = {
			userId: 'JC10001'
		}
		const wrapper = shallow(<UserProfile params={params} />)
		expect(wrapper.find('div.user-profile')).to.have.length(1)
	})
})

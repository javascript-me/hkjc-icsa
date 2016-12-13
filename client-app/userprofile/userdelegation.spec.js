import React from 'react'
import { shallow } from 'enzyme'

import UserDelegation from './userdelegation'

describe('<UserDelegation />', () => {
	it('test render', () => {
		const wrapper = shallow(<UserDelegation />)
		expect(wrapper.find('div.user-delegation')).to.have.length(1)
	})
})

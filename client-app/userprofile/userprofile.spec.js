import React from 'react'
import { shallow } from 'enzyme'

import UserProfile from './userprofile'

describe('<UserProfile />', () => {
	it('renders a UserProfile div', () => {
		const response = {
			user: {},
			account: {}
		}
		const params = {
			userId: 'JC10001'
		}
		const wrapper = shallow(<UserProfile params={params} />)
		expect(wrapper.find('div.user-profile')).to.have.length(1)
		wrapper.find('button.btn-primary').simulate('click')

		rewire(UserProfile.__set__('getUserProfile', () => {
			return Promise.resolve(response)
		}))
		let instance = wrapper.instance()
		instance.componentDidMount()
		rewire()
	})
})

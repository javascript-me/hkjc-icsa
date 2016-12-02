import React from 'react'
import { shallow } from 'enzyme'

import MyProfile from './myprofile'

describe('<MyProfile />', () => {
	it('renders a MyProfile div', () => {
		const wrapper = shallow(<MyProfile />)
		expect(wrapper.find('div.my-profile')).to.have.length(1)

		const response = {
			user: {},
			account: {}
		}
		const service = {
			getUserProfile () {
				return Promise.resolve(response)
			}
		}

		const instance = wrapper.instance()
		instance.getUserProfile(service)
	})
})

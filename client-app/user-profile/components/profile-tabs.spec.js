import React from 'react'
import { shallow } from 'enzyme'

import ProfileTabs from './profile-tabs'

describe('<ProfileTabs />', () => {
	it('renders a ProfileTabs div', () => {
		const wrapper = shallow(<ProfileTabs><div /><div /></ProfileTabs>)
		expect(wrapper.find('div.profile-tabs')).to.have.length(1)

		const instance = wrapper.instance()
		instance.state.curTabIndex = 0
		wrapper.find('div.profile-tabs .nav-pills li.active').simulate('click')
		instance.state.curTabIndex = 1
		wrapper.find('div.profile-tabs .nav-pills li.active').simulate('click')
	})
})

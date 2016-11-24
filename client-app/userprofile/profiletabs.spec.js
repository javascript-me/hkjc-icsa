import React from 'react'
import { shallow } from 'enzyme'

import ProfileTabs from './profiletabs'

describe('<ProfileTabs />', () => {
	it('renders a ProfileTabs div', () => {
		const wrapper = shallow(<ProfileTabs />)
		expect(wrapper.find('div.profile-tabs')).to.have.length(1)
	})
})

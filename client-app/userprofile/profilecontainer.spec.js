import React from 'react'
import { shallow } from 'enzyme'

import ProfileContainer from './profilecontainer'

describe('<ProfileContainer />', () => {
	it('renders a ProfileContainer div', () => {
		const wrapper = shallow(<ProfileContainer />)
		expect(wrapper.find('div.profile-container')).to.have.length(1)
	})
})

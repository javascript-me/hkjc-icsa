import React from 'react'
import { shallow } from 'enzyme'

import ProfileContainer from './profile-container'

describe('<ProfileContainer />', () => {
	it('renders a ProfileContainer div', () => {
		const wrapper = shallow(<ProfileContainer><div /><div /></ProfileContainer>)
		expect(wrapper.find('div.profile-container')).to.have.length(1)
	})
})

import React from 'react'
import { shallow } from 'enzyme'

import ProfileButtons from './profile-buttons'

describe('<ProfileButtons />', () => {
	it('renders a ProfileButtons div', () => {
		const wrapper = shallow(<ProfileButtons />)
		expect(wrapper.find('div.profile-buttons')).to.have.length(1)
	})
})

import React from 'react'
import { shallow } from 'enzyme'

import RolesContainer from './rolescontainer'

describe('<RolesContainer />', () => {
	it('renders a RolesContainer div', () => {
		const wrapper = shallow(<RolesContainer />)
		expect(wrapper.find('div.roles-container')).to.have.length(1)
	})
})

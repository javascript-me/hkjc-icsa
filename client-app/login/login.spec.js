import React from 'react'
import { shallow } from 'enzyme'

import Login from './login'

describe('<Login/>', () => {
	it('renders a submittable form', () => {
		const login = shallow(<Login />)
		expect(login.find('button[type="submit"]')).to.have.length(1)
	})

	it('triggers submit on form submit', () => {
		const login = shallow(<Login />)
		expect(login.find('button[type="submit"]')).to.have.length(1)
	})
})

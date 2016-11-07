import React from 'react'
import { shallow } from 'enzyme'

import Login from './login'

describe('<Login />', () => {
	it('renders a submittable form', () => {
		const login = shallow(<Login />)

		expect(login.find('button[type="submit"]')).to.have.length(1)
	})

	it('username and password is submitted', () => {
		const doLogin = sinon.stub().returns({})
		rewire(Login.__set__('LoginService', {doLogin}))

		const doSubmit = Login.__get__('doSubmit')
		doSubmit()

		rewire()
		expect(doLogin.calledOnce).to.be.true
	})
})

import React from 'react'
import { shallow } from 'enzyme'

import AccountInformation from './accountinformation'

describe('<AccountInformation />', () => {
	it('renders a AccountInformation div', () => {
		const userAccount = {}
		const wrapper = shallow(<AccountInformation userAccount={userAccount} />)
		expect(wrapper.find('div.account-information')).to.have.length(1)
	})
})

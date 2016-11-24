import React from 'react'
import { shallow } from 'enzyme'

import AccountInformation from './accountinformation'

describe('<AccountInformation />', () => {
	it('renders a AccountInformation div', () => {
		const wrapper = shallow(<AccountInformation />)
		expect(wrapper.find('div.account-information')).to.have.length(1)
	})
})

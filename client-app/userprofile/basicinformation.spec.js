import React from 'react'
import { shallow } from 'enzyme'

import BasicInformation from './basicinformation'

describe('<BasicInformation />', () => {
	it('renders a BasicInformation div', () => {
		const wrapper = shallow(<BasicInformation />)
		expect(wrapper.find('div.basic-information')).to.have.length(1)
	})
})

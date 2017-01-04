import React from 'react'
import { shallow } from 'enzyme'

import BasicInformation from './basic-information'

describe('<BasicInformation />', () => {
	it('renders a BasicInformation div', () => {
		const userBasic = {}
		const wrapper = shallow(<BasicInformation userBasic={userBasic} />)
		expect(wrapper.find('div.basic-information')).to.have.length(1)
	})
})

import React from 'react'
import { shallow } from 'enzyme'
import Container from './index.js'
import ProfileStep from './profile-step.js'
let filterData = require('../../server-simulator/API/json/baseUserProfile.json')

describe('<Step2 />', () => {
	it('renders Step2 page', () => {
		const initAccount = Container.__get__('initialAccountInfo')
		const step2 = shallow(<ProfileStep userAccount={initAccount} userBasic={filterData[0]} />)
		expect(step2.find('.btn')).to.have.length(3)
	})
})

import React from 'react'
import { shallow } from 'enzyme'

import Navigation from './navigation'

describe('<Navigation />', () => {
	it('renders a navigation div', () => {
		const navigation = shallow(<Navigation />)
		expect(navigation.find('div.row-navigation')).to.have.length(1)
	})
})

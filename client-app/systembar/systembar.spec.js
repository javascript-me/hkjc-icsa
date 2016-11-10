import React from 'react'
import { shallow } from 'enzyme'

import Systembar from './systembar'

describe('<Systembar />', () => {
	it('renders a systembar div', () => {
		const systembar = shallow(<Systembar />)
		expect(systembar.find('div.row-systembar')).to.have.length(1)
	})
})

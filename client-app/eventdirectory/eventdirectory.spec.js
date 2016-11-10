import React from 'react'
import { shallow } from 'enzyme'

import EventDirectory from './eventdirectory'

describe('<EventDirectory />', () => {
	it('renders a EventDirectory div', () => {
		const eventDirectory = shallow(<EventDirectory />)
		expect(eventDirectory.find('div.row-eventdirectory')).to.have.length(1)
	})
})

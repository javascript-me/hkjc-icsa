import React from 'react'
import { shallow } from 'enzyme'

import EventDirectory from './eventdirectory'

describe('<EventDirectory />', () => {
	it('renders a EventDirectory div', () => {
		const wrapper = shallow(<EventDirectory />)
		expect(wrapper.find('div.row-eventdirectory')).to.have.length(1)
		// wrapper.instance().handleTabClick({target: wrapper.find('#football-tab')})
	})
})

import React from 'react'
import { mount } from 'enzyme'

import EventDirectory from './eventdirectory'

jsdom()

describe('<EventDirectory />', () => {
	it('renders a EventDirectory div', () => {
		const wrapper = mount(<EventDirectory />)
		expect(wrapper.find('div.row-eventdirectory')).to.have.length(1)
		wrapper.node.handleTabClick({target: wrapper.find('#football-tab')})
	})
})

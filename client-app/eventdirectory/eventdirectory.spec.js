import React from 'react'
import { mount } from 'enzyme'

import EventDirectory from './eventdirectory'

jsdom()

describe('<EventDirectory />', () => {
	it('renders a EventDirectory div', () => {
		const wrapper = mount(<EventDirectory />)
		wrapper.find('#football-tab').simulate('click');
		expect(wrapper.find('div.row-eventdirectory')).to.have.length(1)
	})
})

import React from 'react'
import { shallow } from 'enzyme'

import EventDirectory from './eventdirectory'

describe('<EventDirectory />', () => {
	it('renders a EventDirectory div', () => {
		const wrapper = shallow(<EventDirectory />)
		expect(wrapper.find('div.row-eventdirectory')).to.have.length(1)

		const instance = wrapper.instance()

		let selStr = ''

		selStr = 'div.row-eventdirectory .nav-tabs #li-football'
		expect(wrapper.find(selStr)).to.have.length(1)
		wrapper.find(selStr).simulate('click')
		expect(instance.state.curTabIndex === 0).to.be.true
		wrapper.find(selStr).simulate('click')
		expect(instance.state.curTabIndex === 0).to.be.false
	})
})

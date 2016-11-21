import React from 'react'
import { mount } from 'enzyme'

import SearchContainer from './searchcontainer'

describe('<SearchContainer />', () => {
	it('renders a SearchContainer div', () => {
		const wrapper = mount(<SearchContainer type={0} />)
		wrapper.find('#ed-filter-keyword').simulate('keyUp', {keyCode: 13})
		expect(wrapper.find('div.ed-container')).to.have.length(1)
	})
})

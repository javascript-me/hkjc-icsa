import React from 'react'
import { shallow } from 'enzyme'

import SearchContainer from './searchcontainer'

describe('<SearchContainer />', () => {
	it('renders a SearchContainer div', () => {
		const wrapper = shallow(<SearchContainer type={0} />)
		// wrapper.find('#ed-filter-keyword').simulate('keyUp', {keyCode: 13})
		expect(wrapper.find('div.ed-container')).to.have.length(1)
	})
})

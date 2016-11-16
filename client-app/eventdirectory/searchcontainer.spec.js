import React from 'react'
import { shallow } from 'enzyme'

import SearchContainer from './searchcontainer'

describe('<SearchContainer />', () => {
	it('renders a SearchContainer div', () => {
		const searchContainer = shallow(<SearchContainer type={0} />)
		expect(searchContainer.find('div.ed-container')).to.have.length(1)
	})
})

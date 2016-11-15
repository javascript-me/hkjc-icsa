import React from 'react'
import { shallow } from 'enzyme'

import SearchFilter from './searchfilter'

describe('<SearchFilter />', () => {
	it('renders a SearchFilter form', () => {
		const searchFilter = shallow(<SearchFilter />)
		expect(searchFilter.find('form.ed-filter')).to.have.length(1)
	})
})

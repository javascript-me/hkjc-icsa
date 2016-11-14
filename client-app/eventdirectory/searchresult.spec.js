import React from 'react'
import { shallow } from 'enzyme'

import SearchResult from './searchresult'

describe('<SearchResult />', () => {
	it('renders a SearchResult div', () => {
		const searchResult = shallow(<SearchResult />)
		expect(searchResult.find('div.ed-result')).to.have.length(1)
	})
})

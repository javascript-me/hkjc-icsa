import React from 'react'
import { shallow } from 'enzyme'

import SearchResultItem from './searchresultitem'

describe('<SearchResultItem />', () => {
	it('renders a SearchResultItem div', () => {
		const searchResultItem = shallow(<SearchResultItem />)
		expect(searchResultItem.find('div.ed-result-item')).to.have.length(1)
	})
})

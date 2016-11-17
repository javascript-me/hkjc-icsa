import React from 'react'
import { shallow } from 'enzyme'

import SearchTree from './searchtree'

describe('<SearchTree />', () => {
	it('renders a SearchTree div', () => {
		const result = []
		const searchTree = shallow(<SearchTree result={result} />)
		expect(searchTree.find('div.ed-tree')).to.have.length(1)
	})
})

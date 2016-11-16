import React from 'react'
import { shallow } from 'enzyme'

import SearchTree from './searchtree'

describe('<SearchTree />', () => {
	it('renders a SearchTree div', () => {
		const searchTree = shallow(<SearchTree />)
		expect(searchTree.find('div.ed-tree')).to.have.length(1)
	})
})

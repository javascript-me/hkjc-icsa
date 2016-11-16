import React from 'react'
import { shallow } from 'enzyme'

import SearchRecord from './searchrecord'

describe('<SearchRecord />', () => {
	it('renders a SearchRecord div', () => {
		const searchRecord = shallow(<SearchRecord />)
		expect(searchRecord.find('div.ed-record')).to.have.length(1)
	})
})

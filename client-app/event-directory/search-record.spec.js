import React from 'react'
import { shallow } from 'enzyme'

import SearchRecord from './search-record'

describe('<SearchRecord />', () => {
	it('renders a SearchRecord div', () => {
		const record = {
			'active': 1,
			't1': 'ARS',
			't2': 'ASV'
		}

		const wrapper = shallow(<SearchRecord record={record} />)
		expect(wrapper.find('div.ed-record')).to.have.length(1)
	})
})

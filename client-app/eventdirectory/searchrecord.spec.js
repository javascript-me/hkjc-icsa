import React from 'react'
import { shallow } from 'enzyme'

import SearchRecord from './searchrecord'

describe('<SearchRecord />', () => {
	it('renders a SearchRecord div', () => {
		const record = {
			"active": 1,
			"t1": "ARS",
			"t2": "ASV"
		}

		const searchRecord = shallow(<SearchRecord record={record} />)
		expect(searchRecord.find('div.ed-record')).to.have.length(1)
	})
})

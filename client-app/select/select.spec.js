import React from 'react'
import { shallow } from 'enzyme'

import Select from './select'

describe('<Select /> Component', () => {
	it('renders a select component', () => {
		const select = shallow(<Select />)
		expect(select.find('select')).to.have.length(1)
	})

	it('fill options to select component', () => {
		let testData = [
			{'value': 1, 'label': 'BOCC Supervisor'},
			{'value': 2, 'label': 'Content & Planning Manager'},
			{'value': 3, 'label': 'Customer Care Representative'},
			{'value': 4, 'label': 'Director of Group Treasury'},
			{'value': 5, 'label': 'Finance Controller'},
			{'value': 6, 'label': 'System Administrator'},
			{'value': 7, 'label': 'Trading Manager'},
			{'value': 8, 'label': 'Trading Support Analyst'}
		]
		const select = shallow(<Select datas={testData} />)
		expect(select.find('option')).to.have.length(9)
	})

	it('select component style when warning', () => {
		let flag = true
		const select = shallow(<Select warning={flag} />)
		expect(select.find('.has-error')).to.have.length(1)
	})
})

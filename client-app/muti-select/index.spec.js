import React from 'react'
import { shallow } from 'enzyme'
import MutiSelect from './index.js'

const options = [
	{label: 'test1', value: 1},
	{label: 'test1', value: 1},
	{label: 'test1', value: 1},
	{label: 'test1', value: 1}
]

describe('<MutiSelect />', () => {
	const dropdown = shallow(<MutiSelect options={options} />)

	it('renders muti-select drop down', () => {
		expect(dropdown.find('div.muti-select-box')).to.have.length(1)
	})

	it('renders options', () => {
		expect(dropdown.find('div.option')).to.have.length(options.length + 1)
	})
})

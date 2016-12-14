import React from 'react'
import { mount, shallow } from 'enzyme'
import Checkbox from './'

describe('Checkbox', () => {
	it('Create', () => {
		const calendar = shallow(<Checkbox />)
		expect(calendar.find('input[type="checkbox"]')).to.have.length(1)
	})

	it('OnChange executed', () => {
		const handleChange = sinon.spy()
		const calendar = mount(<Checkbox onChange={handleChange} />)
		calendar.simulate('change', {target: {checked: 'true'}})
		expect(handleChange.calledOnce).to.be.equals(true)
	})
})

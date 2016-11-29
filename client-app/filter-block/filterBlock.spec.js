import React from 'react'
import { shallow } from 'enzyme'

import FilterBlock from './index'

const testFilter = {
	name: 'type',
	value: 'Event'
}

describe('<FilterBlock /> component', () => {
	it('will render a span tag', () => {
		const filterBlock = shallow(<FilterBlock filter={testFilter} />)
		expect(filterBlock.find('span')).to.have.length(1)
	})

	it('will display value of props.filter object', () => {
		const filterBlock = shallow(<FilterBlock filter={testFilter} />)

		expect(filterBlock.text()).to.equal(testFilter.value)
	})

	it('will trigger click event when clicked', () => {
		const clickEvent = sinon.spy()
		const filterBlock = shallow(<FilterBlock filter={testFilter} removeEvent={clickEvent} />)

		filterBlock.simulate('click')

		expect(clickEvent.called).to.be.true
	})
})

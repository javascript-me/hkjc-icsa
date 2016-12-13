import React from 'react'
import { shallow } from 'enzyme'

import FilterBlock from './index'

const testFilter = {
	name: 'type',
	value: 'Event'
}

describe('<FilterBlock /> component', () => {
	it('will render a span tag', () => {
		const filterBlock = shallow(<FilterBlock dataValue={testFilter} />)
		expect(filterBlock.find('span')).to.have.length(1)
	})

	it('will display value of props.dataValue object when there does not exist props.dataText', () => {
		const filterBlock = shallow(<FilterBlock dataValue={testFilter} />)

		expect(filterBlock.text()).to.equal(testFilter.value)
	})

	it('will display props.dataText instead of value of props.dataValue object when there exists props.dataText', () => {
		let dataText = 'current filter: XYZ'
		const filterBlock = shallow(<FilterBlock dataText={dataText} dataValue={testFilter} />)

		expect(filterBlock.text()).to.not.equal(testFilter.value)
		expect(filterBlock.text()).to.equal(dataText)
	})

	it('will trigger click event when clicked', () => {
		const clickEvent = sinon.spy()
		const filterBlock = shallow(<FilterBlock dataValue={testFilter} removeEvent={clickEvent} />)

		filterBlock.simulate('click')

		expect(clickEvent.called).to.be.true
	})
})

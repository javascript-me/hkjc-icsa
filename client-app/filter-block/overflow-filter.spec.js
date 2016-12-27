import React from 'react'
import { shallow } from 'enzyme'

import OverflowFilter from './overflow-filter'

const testFilter = {
	name: 'type',
	value: 'Event'
}

describe('<OverflowFilter /> component', () => {
	it('will render a span tag', () => {
		const overflowFilter = shallow(<OverflowFilter dataValue={testFilter} />)
		expect(overflowFilter.find('span')).to.have.length(1)
	})

	it('will display value of props.dataValue object when there does not exist props.dataText', () => {
		const overflowFilter = shallow(<OverflowFilter dataValue={testFilter} />)

		expect(overflowFilter.text()).to.equal(testFilter.value)
	})

	it('will display props.dataText instead of value of props.dataValue object when there exists props.dataText', () => {
		let dataText = 'current filter: XYZ'
		const overflowFilter = shallow(<OverflowFilter dataText={dataText} dataValue={testFilter} />)

		expect(overflowFilter.text()).to.not.equal(testFilter.value)
		expect(overflowFilter.text()).to.equal(dataText)
	})

	it('will not trigger click event when span clicked', () => {
		const onRemove = sinon.spy()
		const overflowFilter = shallow(<OverflowFilter dataValue={testFilter} removeEvent={onRemove} />)

		overflowFilter.simulate('click')

		expect(onRemove.called).to.be.false
	})

	it('will trigger click event when cross icon clicked', () => {
		const onRemove = sinon.spy()
		const overflowFilter = shallow(<OverflowFilter dataValue={testFilter} removeEvent={onRemove} />)

		overflowFilter.find('.icon-more-filter-close').simulate('click')

		expect(onRemove.called).to.be.true
	})
})

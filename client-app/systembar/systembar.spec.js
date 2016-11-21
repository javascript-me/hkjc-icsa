import React from 'react'
import { shallow } from 'enzyme'

import Systembar from './systembar'

describe('<Systembar />', () => {
	it('renders a systembar div', () => {
		const systembar = shallow(<Systembar />)
		expect(systembar.find('div.row-systembar')).to.have.length(1)
	})

	it('Show popup, when click the time showing area', () => {
		let systembar = shallow(<Systembar />)
		let childLength = systembar.find('div.row-systembar').children().length
		systembar.find('a').simulate('click')
		expect(systembar.find('div.row-systembar').children().length).to.equal(childLength + 1)
	})

	it('send the request to get time', () => {
		const getTime = sinon.stub().returns({})
		rewire(Systembar.__set__('SystembarService', {getClock: getTime}))

		const getClock = Systembar.__get__('getClock')

		getClock()

		rewire()
		expect(getTime.calledOnce).to.be.true
	})
})


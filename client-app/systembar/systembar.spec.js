import React from 'react'
import { shallow, mount } from 'enzyme'
import ReactTestUtils from 'react-addons-test-utils'

import Systembar from './systembar'

jsdom()

describe('<Systembar />', () => {
	it('renders a systembar div', () => {
		const systembar = shallow(<Systembar />)
		expect(systembar.find('div.row-systembar')).to.have.length(1)
		const logo = systembar.find('div.row-systembar .logo')
		expect(logo.text()).to.equal(' HKJC SPORTS BETTING')
	})

	it('set props', () => {
	    const wrapper = mount(<Systembar bar="baz" />);
	    expect(wrapper.props().bar).to.equal('baz');
	    wrapper.setProps({ bar: 'foo' });
	    expect(wrapper.props().bar).to.equal('foo');
	})

	it('click event', () => {
		const wrapper = mount(<Systembar />)
		wrapper.find('a').simulate('click')
	})

	it('calls componentDidMount', () => {
	    sinon.spy(Systembar.prototype, 'componentDidMount')
	    const wrapper = mount(<Systembar />)
	    expect(Systembar.prototype.componentDidMount).to.have.property('callCount', 1)
	    Systembar.prototype.componentDidMount.restore()
	  });

	it('Show popup, when click the time showing area', () => {
		let systembar = shallow(<Systembar />)
		let childLength = systembar.find('div.row-systembar').children().length
		systembar.find('a').simulate('click')
		expect(systembar.find('div.row-systembar').children().length).to.equal(childLength+1)
	})

	it('send the request to get time', () => {
		const getTime = sinon.stub().returns({})
		rewire(Systembar.__set__('SystembarService', {getClock:getTime}))

		const getClock = Systembar.__get__('getClock')

		getClock()

		rewire()
		expect(getTime.calledOnce).to.be.true
	})
})

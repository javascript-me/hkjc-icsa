import React from 'react'
import { shallow } from 'enzyme'
import Popup, { Draggable } from './popup'

describe('The Clock Popup', () => {
	it('it will render', () => {
		const popup = shallow(<Popup />)
		expect(popup.find('div.popup')).to.have.length(1)
	})
	it('it will render', () => {
		const popup = shallow(<Popup />)
		expect(popup.find('div.popup')).to.have.length(1)
	})
	it('title is clock', () => {
		const popup = shallow(<Popup />)
		expect(popup.find('h4').text()).to.equal('Clock')
	})
	it('the popup is closed', () => {
		const popup = shallow(<Popup />)
		popup.find('.close').simulate('click')
		expect($(document).find('div.popup')).to.have.length(0)
	})
	it('move the popup', () => {
		const date = 1482128517579
		const wrapper = shallow(<Popup date={date} />)
		const instance = wrapper.instance()

		instance.move({target: {value: 'tar'}})

		const position = {
			x: 0,
			y: 0
		}

		const move = sinon.spy()

		const wrapper2 = shallow(<Draggable x={position.x} y={position.y} onMove={move} />)
		const instance2 = wrapper2.instance()
		let refs = instance2.refs = {}
		refs.handle = {
			scrollWidth: 100,
			scrollHeight: 100
		}
		expect(wrapper.find('div')).to.have.length(5)

		instance2.onMouseDown({target: {value: 'tar'}})
		instance2.onMouseUp({target: {value: 'tar'}, preventDefault () {}})

		instance2.onMouseMove({target: {value: 'tar'}, preventDefault () {}})
	})
})

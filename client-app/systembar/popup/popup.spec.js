import React from 'react'
import { shallow } from 'enzyme'
import Popup from './popup'

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
})

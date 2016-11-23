import React from 'react'
import shallow from 'enzyme'
import Popup from './popup'
import Systembar from './../systembar'

describe('The Clock Popup', () => {
	it('it will not show at beginning', () => {
		const systembar = shallow(<Systembar />)
		expect(systembar.find('div.popup')).to.have.length(0)
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
		const systembar = shallow(<Systembar />)
		const popup = shallow(<Popup />)
		popup.find('.close').simulate('click')
		expect(systembar.find('div.popup')).to.have.length(0)
	})
	it('move the popup', () => {

	})
})

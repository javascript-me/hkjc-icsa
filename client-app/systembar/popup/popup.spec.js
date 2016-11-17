import React from 'react'
import { shallow, mount } from 'enzyme'
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
})
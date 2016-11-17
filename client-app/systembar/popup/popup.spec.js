import React from 'react'
import { shallow } from 'enzyme'
import Popup from './popup'

describe('The Clock Popup', () => {
	it('it will render', () => {
		const popup = shallow(<Popup />)
		expect(popup.find('div.popup')).to.have.length(1)
	})
})
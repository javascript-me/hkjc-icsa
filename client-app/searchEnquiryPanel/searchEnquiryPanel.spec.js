import React from 'react'
import { shallow } from 'enzyme'
import SearchEnquiryPanel from './searchEnquiryPanel'

describe('<SearchEnquiryPanel />', () => {
	it('renders a form about search enquiry popup', () => {
		const searchpopup = shallow(<SearchEnquiryPanel />)

		expect(searchpopup.find('input')).to.have.above(1)
	})
})

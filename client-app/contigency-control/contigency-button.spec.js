import React from 'react'
import {assert} from 'chai'
import {shallow} from 'enzyme'
import ContigencyButton from './contigency-button'

describe('<ContigencyButton>', () => {
	it('ContigencyButton has one .container-contigency-button', () => {
		const contigencyButton = shallow(<ContigencyButton />)
		expect(contigencyButton.find('.container-contigency-button')).to.have.length(1)
	})
	it('ContigencyButton has one .primary-button', () => {
		const contigencyButton = shallow(<ContigencyButton />)
		expect(contigencyButton.find('.primary-button')).to.have.length(1)
	})
	it('ContigencyButton has one .text-button', () => {
		const contigencyButton = shallow(<ContigencyButton />)
		expect(contigencyButton.find('.text-button')).to.have.length(3)
	})
	it('ContigencyButton has one .fade-text', () => {
		const contigencyButton = shallow(<ContigencyButton />)
		expect(contigencyButton.find('.fade-text')).to.have.length(1)
	})
})

import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'

import Auditlog from './auditlog'

describe('Auditlog component', () => {
	it('will renders auditlog page div', () => {
		const auditlog = shallow(<Auditlog />)
		expect(auditlog.find('div.auditlog')).to.have.length(1)
	})

	it('has breadcrumb as "Home \\ Global Tools & Adminstration \\ Audit Trail"', () => {
		const auditlog = shallow(<Auditlog />)
		let breadcrumb = auditlog.find('.hkjc-breadcrumb').text()

		expect(breadcrumb).to.equal('Home \\ Global Tools & Adminstration \\ Audit Trail')
	})

	it('has title(h1) content as "Audit Trail"', () => {
		const auditlog = shallow(<Auditlog />)
		let pageTitle = auditlog.find('h1').text()

		expect(pageTitle).to.equal('Audit Trail')
	})

	it('renders bet types container and include 3 bet type icon in it', () => {
		const auditlog = shallow(<Auditlog />)
		let betTypeContainer = auditlog.find('.bet-types')

		expect(betTypeContainer).to.have.length(1)
		expect(betTypeContainer.children()).to.have.length(3)
	})

	it('will display cooming soon and hide table component after change bet type to basketball or horse racing', () => {
		const auditlog = shallow(<Auditlog />)
		let coomingSoonDiv
		let coomingSoonText

		auditlog.setState({
			'betType': 'basketball'
		})

		coomingSoonDiv = auditlog.find('.nopage')
		coomingSoonText = coomingSoonDiv.text()

		expect(coomingSoonDiv).to.have.length(1)
		expect(coomingSoonText).to.equal('Coming Soon')
	})

	it('renders keyword textbox with placeholder as "Search with keywords & filters" ', () => {
		const auditlog = shallow(<Auditlog />)
		const keywordTextbox = auditlog.find('.keyword-container input[type="text"]')

		expect(keywordTextbox).to.have.length(1)
		expect(keywordTextbox.prop('placeholder')).to.equal('Search with keywords & filters')
	})

	it('will not render search enquiry panel initially', () => {
		const auditlog = shallow(<Auditlog />)
		const searchEnquiryPanel = auditlog.find('.component-search-enquiry-panel')

		expect(searchEnquiryPanel).to.have.length(0)
	})

	it('will search enquiry panel when state.isShowingMoreFilter equals true', () => {
		const auditlog = shallow(<Auditlog />)
		let searchEnquiryPanelContainer

		auditlog.setState({
			'isShowingMoreFilter': true
		})
		searchEnquiryPanelContainer = auditlog.find('.more-filter-popup')

		expect(searchEnquiryPanelContainer.hasClass('active')).to.be.true
	})

	it('will hide search enquiry panel after click out of keyword textbox and search enquiry panel', () => {
		const auditlog = shallow(<Auditlog />)
		let searchEnquiryPanelContainer

		auditlog.setState({'isShowingMoreFilter': true})
		searchEnquiryPanelContainer = auditlog.find('.more-filter-popup')
		expect(searchEnquiryPanelContainer.hasClass('active')).to.be.true

		auditlog.setState({'isShowingMoreFilter': false})
		searchEnquiryPanelContainer = auditlog.find('.more-filter-popup')
		expect(searchEnquiryPanelContainer.hasClass('active')).to.be.false
	})

	// it('will hide search enquiry panel after press "enter" to keyword textbox', () => {
	// 	const auditlog = shallow(<Auditlog />)
	// 	let keywordTextbox = auditlog.find('.keyword-container input[type="text"]')
	// 	let searchEnquiryPanelContainer

	// 	auditlog.setState({'isShowingMoreFilter': true})
	// 	searchEnquiryPanelContainer = auditlog.find('.more-filter-popup')
	// 	expect(searchEnquiryPanelContainer.hasClass('active')).to.be.true

	// 	keywordTextbox.simulate('keypress', {
	// 		key: 'Enter'
	// 	})

	// 	searchEnquiryPanelContainer = auditlog.find('.more-filter-popup')
	// 	expect(searchEnquiryPanelContainer.hasClass('active')).to.be.false
	// })

	it('will not render filters in right of keyword textbox initially', () => {
		const auditlog = shallow(<Auditlog />)
		const filterBlockContainer = auditlog.find('.filter-block-container')

		expect(filterBlockContainer.children()).to.have.length(0)
	})

	it('will render table component initially', () => {
		const auditlog = shallow(<Auditlog />)
		const tableContainer = auditlog.find('.table-container')

		expect(tableContainer.children()).to.have.length(1)
	})

	it('will render export button initially', () => {
		const auditlog = shallow(<Auditlog />)
		const exportButton = auditlog.find('.vertical-gap button.btn.btn-primary')

		expect(exportButton).to.have.length(1)
	})
})

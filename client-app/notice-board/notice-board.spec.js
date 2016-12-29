import React from 'react'
import {shallow} from 'enzyme'
import NoticeBoard from './notice-board'

describe('<NoticeBoard>', () => {
	it('.hkjc-breadcrumb has text As "Home \\ Global Tools & Adminstration"', () => {
		const noticeBoard = shallow(<NoticeBoard />)
		let breadcrumb = noticeBoard.find('.hkjc-breadcrumb').text()
		expect(breadcrumb).to.equal('Home \\ Global Tools & Adminstration \\ Communication ')
	})
	it('h1 has ttile as "Contingency Control"', () => {
		const noticeBoard = shallow(<NoticeBoard />)
		let pageTitle = noticeBoard.find('h1').text()
		expect(pageTitle).to.equal('Noticeboard Monitor')
	})

	it('Page should have 1 page-content', () => {
		const noticeBoard = shallow(<NoticeBoard />)
		let pageContent = noticeBoard.find('.page-content')
		expect(pageContent).to.have.length(1)
		expect(noticeBoard.find('.search-criteria-container')).to.have.length(1)
		expect(noticeBoard.find('.keyword-container')).to.have.length(1)
		expect(noticeBoard.find('.tableComponent-container')).to.have.length(1)
		expect(noticeBoard.find('.export-button-container')).to.have.length(1)
	})
})
describe('Will test loading of noticeboard page', () => {
	it('searchNoticeboard()', () => {
		const noticeBoard = shallow(<NoticeBoard />)
		noticeBoard.instance().searchNoticeboard()

		expect(noticeBoard.state('selectedKeyword')).to.equal('')
		expect(noticeBoard.state('loading')).to.be.true
	})
	it('will be false after trigger pageClick() and not clicking for search', () => {
		const noticeBoard = shallow(<NoticeBoard />)
		const event = {}

		noticeBoard.setState({
			'isShowingMoreFilter': true,
			'isClickForSearching': false
		})

		noticeBoard.instance().pageClick(event)

		expect(noticeBoard.state('isShowingMoreFilter')).to.be.false
	})
})

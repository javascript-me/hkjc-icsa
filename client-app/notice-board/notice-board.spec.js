import React from 'react'
import { shallow } from 'enzyme'
import Moment from 'moment'
import NoticeBoard from './notice-board'

const getOrginDateTimeFrom = NoticeBoard.__get__('getOrginDateTimeFrom')
const getOrginDateTimeTo = NoticeBoard.__get__('getOrginDateTimeTo')

describe('<NoticeBoard /> component', () => {
	describe('#removeSearchCriteriaFilter(filter)', () => {
		it('will clear state.keyword and state.selectedKeyword when filter.name equals "keyword"', () => {
			const noticeBoard = shallow(<NoticeBoard />)
			const filter = {
				name: 'keyword', value: 'keyword1'
			}

			noticeBoard.setState({
				keyword: filter.value,
				selectedKeyword: filter.value
			})
			noticeBoard.instance().removeSearchCriteriaFilter(filter)

			expect(noticeBoard.state('keyword').length).to.equal(0)
			expect(noticeBoard.state('selectedKeyword').length).to.equal(0)
		})

		it('will reset dateTimeFrom of state.selectedFilters when filter.name equals "dateTimeFrom"', () => {
			const noticeBoard = shallow(<NoticeBoard />)
			const filter = {
				name: 'dateTimeFrom', value: '05 Oct 2016 00:00'
			}
			const originDateTimeFrom = getOrginDateTimeFrom()
			let stateDateTimeFrom

			noticeBoard.setState({
				selectedFilters: [{
					name: 'dateTimeFrom',
					value: Moment(filter.value, 'DD MMM YYYY HH:mm')
				}]
			})
			noticeBoard.instance().removeSearchCriteriaFilter(filter)

			stateDateTimeFrom = noticeBoard.state('selectedFilters').filter((f) => {
				return f.name === 'dateTimeFrom'
			})[0] || {}

			// expect(stateDateTimeFrom.value.isSame(originDateTimeFrom)).to.be.true
			expect(stateDateTimeFrom.value).to.equal(originDateTimeFrom)
		})

		it('will reset dateTimeTo of state.selectedFilters when filter.name equals "dateTimeTo"', () => {
			const noticeBoard = shallow(<NoticeBoard />)
			const filter = {
				name: 'dateTimeTo', value: '07 Dec 2016 23:59'
			}
			const originDateTimeTo = getOrginDateTimeTo()
			let stateDateTimeTo

			noticeBoard.setState({
				selectedFilters: [{
					name: 'dateTimeTo',
					value: Moment(filter.value, 'DD MMM YYYY HH:mm')
				}]
			})
			noticeBoard.instance().removeSearchCriteriaFilter(filter)

			stateDateTimeTo = noticeBoard.state('selectedFilters').filter((f) => {
				return f.name === 'dateTimeTo'
			})[0] || {}

			// expect(stateDateTimeTo.value.isSame(originDateTimeTo)).to.be.true

			expect(stateDateTimeTo.value).to.equal(originDateTimeTo)
		})
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
		it('componentDidMount()', () => {
			const noticeBoard = shallow(<NoticeBoard />)
			noticeBoard.instance().componentDidMount()
		})

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
})

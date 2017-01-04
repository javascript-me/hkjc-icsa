import React from 'react'
import { shallow, mount } from 'enzyme'
import moment from 'moment'
import Session from '../session'
import SearchFilter from './search-filter'

describe('<SearchFilter />', () => {
	const filter = {
		scenario: {
			options: ['All', 'Assigned', 'In-Play', 'Archive', 'Today', 'Pre-Event', 'Prelim', 'Defined', 'Major'],
			default: 'Assigned'
		},
		competition: {
			options: ['All', 'Premier', 'FA Cup', 'League Cup', 'Championship'],
			default: 'All'
		}
	}

	it('SearchFilter render', () => {
		const onSearch = sinon.spy()
		const wrapper = shallow(<SearchFilter filter={filter} onSearch={onSearch} />)
		const searchFilter = wrapper.instance()

		expect(wrapper.find('div.ed-filter')).to.have.length(1)

		const autoComplete = wrapper.find('AutoComplete')
		expect(autoComplete).to.be.not.null
		expect(autoComplete.node.props.maxResults).to.be.equal(6)
		expect(autoComplete.node.props.placeholder).to.be.equal('Search')
		expect(autoComplete.node.props.noSuggestionsText).to.be.equal('No Results')
		expect(autoComplete.node.props.onItemSelected).to.be.equal(searchFilter.onSearchItemSelected)
		expect(autoComplete.node.props.onItemsRequested).to.be.equal(searchFilter.onSearchItemsRequested)
		expect(autoComplete.node.props.onEnter).to.be.equal(searchFilter.onSearch)

		// TODO: tests for the rest of functionality
	})

	describe('Session state', () => {
		it('empty when initialized', () => {
			const onSearch = sinon.spy()
			mount(<SearchFilter filter={filter} onSearch={onSearch} />)

			let sessionState = Session.getItem(Session.VALUES.ED_SEARCH_FILTER)
			expect(sessionState).to.be.undefined
		})

		it('keyword should be saved when search is made', async () => {
			const onSearch = sinon.spy()
			const wrapper = mount(<SearchFilter filter={filter} onSearch={onSearch} />)

			// set keyword
			wrapper.instance().handleKeywordChange('test')
			await wrapper.instance().onSearch()

			let sessionState = Session.getItem(Session.VALUES.ED_SEARCH_FILTER)
			expect(sessionState).to.be.object
			expect(sessionState.hasFilter).to.be.true
			expect(sessionState.searchEnquiry).to.be.object
			expect(sessionState.searchEnquiry.keyword).to.equal('test')
		})

		it('event type should be saved when search is made', async () => {
			const onSearch = sinon.spy()
			const wrapper = mount(<SearchFilter filter={filter} onSearch={onSearch} />)

			wrapper.instance().handleFilterChange('eventType', [{label: 'Event 1', value: 'Event 1'}])
			await wrapper.instance().onSearch()

			let sessionState = Session.getItem(Session.VALUES.ED_SEARCH_FILTER)
			expect(sessionState).to.be.object
			expect(sessionState.hasFilter).to.be.true
			expect(sessionState.searchEnquiry).to.be.object
			expect(sessionState.searchEnquiry.eventType).to.equal('Event 1')
		})

		it('competition should be saved when search is made', async () => {
			const onSearch = sinon.spy()
			const wrapper = mount(<SearchFilter filter={filter} onSearch={onSearch} />)

			wrapper.instance().handleFilterChange('competition', [{label: 'Comp 1', value: 'Comp 1'}])
			await wrapper.instance().onSearch()

			let sessionState = Session.getItem(Session.VALUES.ED_SEARCH_FILTER)
			expect(sessionState).to.be.object
			expect(sessionState.hasFilter).to.be.true
			expect(sessionState.searchEnquiry).to.be.object
			expect(sessionState.searchEnquiry.competition).to.equal('Comp 1')
		})

		it('dateFrom/dateTo should be saved when search is made', async () => {
			const onSearch = sinon.spy()
			const wrapper = mount(<SearchFilter filter={filter} onSearch={onSearch} />)

			let from = moment()
			let to = moment().add(7, 'd')
			wrapper.instance().handleFilterChange('dateFrom', from)
			wrapper.instance().handleFilterChange('dateTo', to)
			await wrapper.instance().onSearch()

			let sessionState = Session.getItem(Session.VALUES.ED_SEARCH_FILTER)
			expect(sessionState).to.be.object
			expect(sessionState.hasFilter).to.be.true
			expect(sessionState.searchEnquiry).to.be.object
			expect(sessionState.searchEnquiry.dateFrom).to.equal(from.format('DD MMM YYYY HH:mm'))
			expect(sessionState.searchEnquiry.dateTo).to.equal(to.format('DD MMM YYYY HH:mm'))
		})

		it('all props should be saved when search is made', async () => {
			const onSearch = sinon.spy()
			const wrapper = mount(<SearchFilter filter={filter} onSearch={onSearch} />)

			let dateFrom = moment()
			let dateTo = moment().add(7, 'd')

			wrapper.instance().handleKeywordChange('test')
			wrapper.instance().handleFilterChange('eventType', [{label: 'Event 1', value: 'Event 1'}])
			wrapper.instance().handleFilterChange('competition', [{label: 'Comp 1', value: 'Comp 1'}])
			wrapper.instance().handleFilterChange('dateFrom', dateFrom)
			wrapper.instance().handleFilterChange('dateTo', dateTo)
			await wrapper.instance().onSearch()

			let sessionState = Session.getItem(Session.VALUES.ED_SEARCH_FILTER)
			expect(sessionState).to.be.object
			expect(sessionState.hasFilter).to.be.true
			expect(sessionState.searchEnquiry).to.be.object
			expect(sessionState.searchEnquiry.keyword).to.equal('test')
			expect(sessionState.searchEnquiry.eventType).to.equal('Event 1')
			expect(sessionState.searchEnquiry.competition).to.equal('Comp 1')
			expect(sessionState.searchEnquiry.dateFrom).to.equal(dateFrom.format('DD MMM YYYY HH:mm'))
			expect(sessionState.searchEnquiry.dateTo).to.equal(dateTo.format('DD MMM YYYY HH:mm'))
		})
	})
})

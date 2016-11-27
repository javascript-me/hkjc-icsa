import React from 'react'
import { shallow } from 'enzyme'
import PubSub from '../pubsub'

import Audit from './auditlog'

describe('<Audit /> component', () => {
	it('will renders auditlog page div', () => {
		const auditlog = shallow(<Audit />)
		expect(auditlog.find('div.auditlog')).to.have.length(1)
	})

	it('has breadcrumb as "Home \\ Global Tools & Adminstration \\ Audit Trail"', () => {
		const auditlog = shallow(<Audit />)
		let breadcrumb = auditlog.find('.hkjc-breadcrumb').text()

		expect(breadcrumb).to.equal('Home \\ Global Tools & Adminstration \\ Audit Trail')
	})

	it('has title(h1) content as "Audit Trail"', () => {
		const auditlog = shallow(<Audit />)
		let pageTitle = auditlog.find('h1').text()

		expect(pageTitle).to.equal('Audit Trail')
	})

	it('renders bet types container and include 3 bet type icon in it', () => {
		const auditlog = shallow(<Audit />)
		let betTypeContainer = auditlog.find('.bet-types')

		expect(betTypeContainer).to.have.length(1)
		expect(betTypeContainer.children()).to.have.length(3)
	})

	it('will display cooming soon and hide table component after change bet type to basketball or horse racing', () => {
		const auditlog = shallow(<Audit />)
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
		const auditlog = shallow(<Audit />)
		const keywordTextbox = auditlog.find('.keyword-container input[type="text"]')

		expect(keywordTextbox).to.have.length(1)
		expect(keywordTextbox.prop('placeholder')).to.equal('Search with keywords & filters')
	})

	it('will not render search enquiry panel initially', () => {
		const auditlog = shallow(<Audit />)
		const searchEnquiryPanel = auditlog.find('.component-search-enquiry-panel')

		expect(searchEnquiryPanel).to.have.length(0)
	})

	it('will search enquiry panel when state.isShowingMoreFilter equals true', () => {
		const auditlog = shallow(<Audit />)
		let searchEnquiryPanelContainer

		auditlog.setState({
			'isShowingMoreFilter': true
		})
		searchEnquiryPanelContainer = auditlog.find('.more-filter-popup')

		expect(searchEnquiryPanelContainer.hasClass('active')).to.be.true
	})

	it('will hide search enquiry panel after click out of keyword textbox and search enquiry panel', () => {
		const auditlog = shallow(<Audit />)
		let searchEnquiryPanelContainer

		auditlog.setState({'isShowingMoreFilter': true})
		searchEnquiryPanelContainer = auditlog.find('.more-filter-popup')
		expect(searchEnquiryPanelContainer.hasClass('active')).to.be.true

		auditlog.setState({'isShowingMoreFilter': false})
		searchEnquiryPanelContainer = auditlog.find('.more-filter-popup')
		expect(searchEnquiryPanelContainer.hasClass('active')).to.be.false
	})

	it('will not render filters in right of keyword textbox initially', () => {
		const auditlog = shallow(<Audit />)
		const filterBlockContainer = auditlog.find('.filter-block-container')

		expect(filterBlockContainer.children()).to.have.length(0)
	})

	it('will render table component initially', () => {
		const auditlog = shallow(<Audit />)
		const tableContainer = auditlog.find('.table-container')

		expect(tableContainer.children()).to.have.length(1)
	})

	it('will render export button initially', () => {
		const auditlog = shallow(<Audit />)
		const exportButton = auditlog.find('.vertical-gap button.btn.btn-primary')

		expect(exportButton).to.have.length(1)
	})

	describe('#state.betType attr', () => {
		it('default as "football"', () => {
			const auditlog = shallow(<Audit />)
			
			expect(auditlog.state('betType')).to.equal('football')
		})

		it('changes by parameter of changeBetType()', () => {
			const auditlog = shallow(<Audit />)

			auditlog.instance().changeBetType('basketball')
			
			expect(auditlog.state('betType')).to.equal('basketball')
			expect(auditlog.state('keyword')).to.equal('')
			expect(auditlog.state('selectedFilters')).to.have.length(0)
			expect(auditlog.state('isShowingMoreFilter')).to.be.false
		})
	})

	describe('#state.isShowingMoreFilter attr', () => {
		it('will be true after trigger showMoreFilter()', () => {
			const auditlog = shallow(<Audit />)
			
			auditlog.instance().showMoreFilter();

			expect(auditlog.state('isShowingMoreFilter')).to.be.true
		})

		it('will be false after trigger hideMoreFilter()', () => {
			const auditlog = shallow(<Audit />)
			
			auditlog.setState({
				'isShowingMoreFilter': true
			})
			expect(auditlog.state('isShowingMoreFilter')).to.be.true

			auditlog.instance().hideMoreFilter();

			expect(auditlog.state('isShowingMoreFilter')).to.be.false
		})

		it('will be false after trigger pageClick() and not clicking for search', () => {
			const auditlog = shallow(<Audit />)
			const event = {}
			
			auditlog.setState({
				'isShowingMoreFilter': true,
				'isClickForSearching': false
			})

			auditlog.instance().pageClick(event);

			expect(auditlog.state('isShowingMoreFilter')).to.be.false
		})
	})

	describe('#state.isClickForSearching attr', () => {
		it('will be true after trigger clickForSearching()', () => {
			const auditlog = shallow(<Audit />)
			
			auditlog.instance().clickForSearching();

			expect(auditlog.state('isClickForSearching')).to.be.true
		})

		it('will be false after trigger pageClick() and clicking for search', () => {
			const auditlog = shallow(<Audit />)
			const event = {}
			
			auditlog.setState({
				'isShowingMoreFilter': false,
				'isClickForSearching': true
			})

			auditlog.instance().pageClick(event);

			expect(auditlog.state('isClickForSearching')).to.be.false
		})
	})

	describe('#setFilters()', () => {
		it('will update state.selectedFilters by parameter', () => {
			const auditlog = shallow(<Audit />)
			let filters = {
				'type': 'type1',
				'home': 'hongkong'
			}
			
			auditlog.instance().setFilters(filters);

			expect(auditlog.state('selectedFilters')).to.have.length(2)
			expect(auditlog.state('selectedFilters')).to.deep.equal([
				{ name : 'type', value: 'type1'},
				{ name: 'home', value: 'hongkong'}
				]);
		})
	})

	describe('#getSearchCriterias()', () => {
		it('return value will equals attributes in state', () => {
			const auditlog = shallow(<Audit />)
			let searchCriterias = auditlog.instance().getSearchCriterias();
			 
			expect(searchCriterias).to.deep.equal({
				betType: auditlog.state('betType'),
				keyword: auditlog.state('keyword'),
				filters: auditlog.state('selectedFilters')
			});
		})
	})

	describe('#handleKeywordChange()', () => {
		it('change state.keyword by event.target.value', () => {
			const auditlog = shallow(<Audit />)
			const newKeyword = 'My new keyword'
			const event = {
				target: {
					value: newKeyword
				}
			}
			
			auditlog.instance().handleKeywordChange(event);
			 
			expect(auditlog.state('keyword')).to.equal(newKeyword);
		})
	})

	describe('#handleKeywordChange()', () => {
		it('will trigger AUDITLOG_SEARCH_BY_KEY_PRESS topic when presses "enter" in keyboard', () => {
			const auditlog = shallow(<Audit />)
			const event = {
				key: 'Enter'
			}
			let hasTriggeredCurrentTopic = false
			const subscription = PubSub.subscribe(PubSub.AUDITLOG_SEARCH_BY_KEY_PRESS, () => {	
				PubSub.unsubscribe(subscription)
				hasTriggeredCurrentTopic = true

				expect(hasTriggeredCurrentTopic).to.be.true;
			})
			
			auditlog.instance().handleKeywordPress(event);
		})
	})

	describe('#removeSearchCriteriaFilter(filter)', () => {
		it('will return the exact filter in state.selectedFilters', () => {
			const auditlog = shallow(<Audit />)
			const targetFilter = {
				name: 'type', value: 'type1'
			}
			const otherFilters = [
				{ name : 'home', value: 'hongkong'},
				{ name: 'frontEndID', value: 'D2KN4X'}
			]
			const allFilters = otherFilters.concat(targetFilter)
			
			auditlog.setState({
				selectedFilters: allFilters,
				isShowingMoreFilter: true
			})

			auditlog.instance().removeSearchCriteriaFilter(targetFilter);

			expect(auditlog.state('isShowingMoreFilter')).to.be.false;
			expect(auditlog.state('selectedFilters')).to.deep.equal(otherFilters);
		})
	})

	
	
})

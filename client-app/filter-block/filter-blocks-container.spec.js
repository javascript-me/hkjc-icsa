import React from 'react'
import { mount, shallow } from 'enzyme'

import FilterBlocksContainer from './filter-blocks-container'

describe('<FilterBlocksContainer /> component', () => {
	it('will render a div.filter-block-container tag', () => {
		const filterBlocksContainer = shallow(<FilterBlocksContainer />)
		expect(filterBlocksContainer.find('div.filter-block-container')).to.have.length(1)
	})

	it('calls componentDidMount', () => {
		sinon.spy(FilterBlocksContainer.prototype, 'componentDidMount')
		mount(<FilterBlocksContainer />)

		expect(FilterBlocksContainer.prototype.componentDidMount).to.have.property('callCount', 1)
		FilterBlocksContainer.prototype.componentDidMount.restore()
	})

	it('calls componentWillUnmount when destroy', () => {
		sinon.spy(FilterBlocksContainer.prototype, 'componentWillUnmount')
		const filterBlocksContainer = mount(<FilterBlocksContainer />)

		filterBlocksContainer.instance().componentWillUnmount()
		expect(FilterBlocksContainer.prototype.componentWillUnmount).to.have.property('callCount', 1)
		FilterBlocksContainer.prototype.componentWillUnmount.restore()
	})

	it('calls componentWillUpdate and componentDidUpdate', () => {
		sinon.spy(FilterBlocksContainer.prototype, 'componentWillUpdate')
		sinon.spy(FilterBlocksContainer.prototype, 'componentDidUpdate')

		let filterBlocksContainer = mount(<FilterBlocksContainer />)

		filterBlocksContainer.instance().componentWillUpdate()
		expect(FilterBlocksContainer.prototype.componentWillUpdate).to.have.property('called', true)
		FilterBlocksContainer.prototype.componentWillUpdate.restore()

		filterBlocksContainer.instance().componentDidUpdate()
		expect(FilterBlocksContainer.prototype.componentDidUpdate).to.have.property('called', true)
		FilterBlocksContainer.prototype.componentDidUpdate.restore()
	})

	it('will has default properties', () => {
		const filterBlocksContainer = mount(<FilterBlocksContainer />)

		expect(filterBlocksContainer.instance().props.filters).to.be.deep.equal([])
		expect(typeof filterBlocksContainer.instance().props.onRemoveOneFilter).to.equal('function')
	})

	it('will be in loading status by default', () => {
		const filterBlocksContainer = mount(<FilterBlocksContainer />)
		const tag = filterBlocksContainer.find('div.filter-block-container')

		expect(filterBlocksContainer.state('isLoading')).to.be.true
		expect(tag.hasClass('loading')).to.be.true
	})

	it('will finish loading when state.loading change to false', () => {
		const filterBlocksContainer = mount(<FilterBlocksContainer />)
		const tag = filterBlocksContainer.find('div.filter-block-container')

		filterBlocksContainer.setState({isLoading: false})

		expect(filterBlocksContainer.state('isLoading')).to.be.false
		expect(tag.hasClass('loading')).to.be.false
	})

	it('will render filter blocks according to props.filters if no overflow filter', () => {
		let filters = [{
			value: {
				name: 'type',
				value: 'Event'
			}
		}, {
			value: {
				name: 'address',
				value: 'Hongkong'
			}
		}]
		const filterBlocksContainer = mount(<FilterBlocksContainer filters={filters} />)
		const pureFilterContainer = filterBlocksContainer.find('.pure-filter-block')
		const filterBlocks = pureFilterContainer.find('.filter-block')

		filterBlocksContainer.setState({doesAnyFiltersOverflow: false})

		expect(filterBlocksContainer.state('doesAnyFiltersOverflow')).to.be.false
		expect(pureFilterContainer.hasClass('short')).to.be.false
		expect(filterBlocks).to.have.length(filters.length)
	})

	it('will render this.refs.pureFilterBlocksContainer as div', () => {
		let filters = [{
			value: {
				name: 'type',
				value: 'Event'
			}
		}, {
			value: {
				name: 'address',
				value: 'Hongkong'
			}
		}]
		const filterBlocksContainer = mount(<FilterBlocksContainer filters={filters} />)

		expect(filterBlocksContainer.instance().refs.pureFilterBlocksContainer.tagName).to.be.equal('DIV')
	})

	describe('#More button', () => {
		it('will be rendered if exists overflow filter', () => {
			const filterBlocksContainer = mount(<FilterBlocksContainer />)
			const pureFilterContainer = filterBlocksContainer.find('.pure-filter-block')

			filterBlocksContainer.setState({
				doesAnyFiltersOverflow: true
			})

			expect(filterBlocksContainer.state('doesAnyFiltersOverflow')).to.be.true
			expect(pureFilterContainer.hasClass('short')).to.be.true
			expect(filterBlocksContainer.find('.btn-show-more-filter')).to.have.length(1)
		})

		it('will be rendered without .showing class by default if exists overflow filter', () => {
			const filterBlocksContainer = mount(<FilterBlocksContainer />)

			filterBlocksContainer.setState({
				doesAnyFiltersOverflow: true
			})

			expect(filterBlocksContainer.find('.btn-show-more-filter')).to.have.length(1)
			expect(filterBlocksContainer.find('.btn-show-more-filter').hasClass('showing')).to.be.false
		})

		it('will toggle .showing class when clicked', () => {
			const filterBlocksContainer = mount(<FilterBlocksContainer />)
			let moreButtn

			filterBlocksContainer.setState({
				doesAnyFiltersOverflow: true
			})

			moreButtn = filterBlocksContainer.find('.btn-show-more-filter')

			expect(moreButtn).to.have.length(1)
			expect(moreButtn.hasClass('showing')).to.be.false

			moreButtn.simulate('click')
			expect(moreButtn.hasClass('showing')).to.be.true

			moreButtn.simulate('click')
			expect(moreButtn.hasClass('showing')).to.be.false
		})

		it('will be removed .showing class when trigger #hideMoreFilterPanel()', () => {
			const filterBlocksContainer = mount(<FilterBlocksContainer />)
			let moreButtn

			filterBlocksContainer.setState({
				doesAnyFiltersOverflow: true
			})

			moreButtn = filterBlocksContainer.find('.btn-show-more-filter')

			expect(moreButtn.hasClass('showing')).to.be.false

			moreButtn.simulate('click')
			expect(moreButtn.hasClass('showing')).to.be.true

			filterBlocksContainer.instance().hideMoreFilterPanel()

			expect(moreButtn.hasClass('showing')).to.be.false
		})
	})

	describe('#Overflow filters panel', () => {
		it('will render overflow filters in more filters panel', () => {
			let filters = [{
				value: {
					name: 'type',
					value: 'Event'
				}
			}, {
				value: {
					name: 'address',
					value: 'Hongkong'
				}
			}]
			const filterBlocksContainer = mount(<FilterBlocksContainer filters={filters} />)
			let overflowFilters = filterBlocksContainer.state('overflowFilters')
			let overflowFiltersPanel

			overflowFilters.push(filters[1])

			filterBlocksContainer.setState({
				doesAnyFiltersOverflow: true,
				showingMore: true,
				overflowFilters: overflowFilters
			})

			overflowFiltersPanel = filterBlocksContainer.find('.more-filters-panel')

			expect(overflowFiltersPanel).to.have.length(1)
			expect(overflowFiltersPanel.find('li')).to.have.length(overflowFilters.length)
		})

		it('will hide when trigger #pageClickedOrResized when state.clickingOnMoreFilterPanel equal false', () => {
			let filters = [{
				value: {
					name: 'type',
					value: 'Event'
				}
			}, {
				value: {
					name: 'address',
					value: 'Hongkong'
				}
			}]
			const filterBlocksContainer = mount(<FilterBlocksContainer filters={filters} />)
			let overflowFilters = filterBlocksContainer.state('overflowFilters')

			overflowFilters.push(filters[1])

			filterBlocksContainer.setState({
				doesAnyFiltersOverflow: true,
				showingMore: true,
				overflowFilters: overflowFilters
			})

			expect(filterBlocksContainer.find('.more-filters-panel')).to.have.length(1)

			filterBlocksContainer.instance().pageClickedOrResized()

			expect(filterBlocksContainer.state('showingMore')).to.be.false
			expect(filterBlocksContainer.find('.more-filters-panel')).to.have.length(0)
		})

		it('will not hide when trigger #pageClickedOrResized when state.clickingOnMoreFilterPanel equal true', () => {
			let filters = [{
				value: {
					name: 'type',
					value: 'Event'
				}
			}, {
				value: {
					name: 'address',
					value: 'Hongkong'
				}
			}]
			const filterBlocksContainer = mount(<FilterBlocksContainer filters={filters} />)
			let overflowFilters = filterBlocksContainer.state('overflowFilters')

			overflowFilters.push(filters[1])

			filterBlocksContainer.setState({
				doesAnyFiltersOverflow: true,
				showingMore: true,
				overflowFilters: overflowFilters,
				clickingOnMoreFilterPanel: true
			})

			expect(filterBlocksContainer.find('.more-filters-panel')).to.have.length(1)

			filterBlocksContainer.instance().pageClickedOrResized()

			expect(filterBlocksContainer.state('showingMore')).to.be.true
			expect(filterBlocksContainer.find('.more-filters-panel')).to.have.length(1)
		})
	})

	describe('#props.onRemoveOneFilter', () => {
		it('will trigger by clicked filter block', () => {
			let filters = [{
				value: {
					name: 'type',
					value: 'Event'
				}
			}, {
				value: {
					name: 'address',
					value: 'Hongkong'
				}
			}]
			const removeEvent = sinon.spy()
			const filterBlocksContainer = mount(<FilterBlocksContainer filters={filters} onRemoveOneFilter={removeEvent} />)
			const firstFilterBlocks = filterBlocksContainer.find('.pure-filter-block .filter-block').first()

			firstFilterBlocks.simulate('click')

			expect(removeEvent.calledOnce).to.be.true
		})

		it('will trigger by clicked the cross icon of overflow filter', () => {
			let filters = [{
				value: {
					name: 'type',
					value: 'Event'
				}
			}, {
				value: {
					name: 'address',
					value: 'Hongkong'
				}
			}]
			const removeEvent = sinon.spy()
			const filterBlocksContainer = mount(<FilterBlocksContainer filters={filters} onRemoveOneFilter={removeEvent} />)
			let overflowFilters = filterBlocksContainer.state('overflowFilters')
			let overflowFiltersPanel
			let firstOverflowFilter

			overflowFilters.push(filters[1])

			filterBlocksContainer.setState({
				doesAnyFiltersOverflow: true,
				showingMore: true,
				overflowFilters: overflowFilters
			})

			overflowFiltersPanel = filterBlocksContainer.find('.more-filters-panel')
			firstOverflowFilter = overflowFiltersPanel.find('li').first()

			firstOverflowFilter.find('.icon-more-filter-close').simulate('click')

			expect(removeEvent.calledOnce).to.be.true
		})
	})

	describe('#state.showingMore', () => {
		it('will toggle change by trigger #toggleMoreFilterPanel', () => {
			const filterBlocksContainer = mount(<FilterBlocksContainer />)
			let showingMore = filterBlocksContainer.state('showingMore')

			filterBlocksContainer.instance().toggleMoreFilterPanel()

			expect(filterBlocksContainer.state('showingMore')).to.not.equal(showingMore)
		})

		it('will set as false by trigger #hideMoreFilterPanel', () => {
			const filterBlocksContainer = mount(<FilterBlocksContainer />)

			filterBlocksContainer.instance().hideMoreFilterPanel()

			expect(filterBlocksContainer.state('showingMore')).to.be.false
		})
	})

	describe('#clickOnMoreFilterPanel', () => {
		it('will set state.clickingOnMoreFilterPanel to be true', () => {
			const filterBlocksContainer = mount(<FilterBlocksContainer />)
			filterBlocksContainer.instance().clickOnMoreFilterPanel()

			expect(filterBlocksContainer.state('clickingOnMoreFilterPanel')).to.be.true
		})
	})
})

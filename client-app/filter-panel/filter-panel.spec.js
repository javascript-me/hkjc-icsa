import React from 'react'
import { mount, shallow } from 'enzyme'
import PubSub from '../pubsub'

import FilterPanel from './index'
import FilterPanelRow from './filter-panel-row'
import FilterPanelColumn from './filter-panel-column'

describe('<FilterPanel /> component', () => {
	it('will render a div with "filter-panel" class for component', () => {
		const filterPanel = shallow(<FilterPanel />)
		expect(filterPanel.find('div.filter-panel')).to.have.length(1)
	})

	it('will render panel-footer div with reset and submit button', () => {
		const filterPanel = shallow(<FilterPanel />)
		const panelFooter = filterPanel.find('div.filter-panel div.pannel-footer')

		expect(panelFooter).to.have.length(1)

		expect(panelFooter.find('.btn.btn-link').text()).to.equal('Reset')
		expect(panelFooter.find('.btn.btn-primary').text()).to.equal('Search')
	})

	it('will not display mandatory remind if does not exist any required column', () => {
		const filterPanel = mount(<FilterPanel>
			<FilterPanelRow>
				<FilterPanelColumn filterName='filter1' filterTitle='filter title' />
			</FilterPanelRow>
		</FilterPanel>)
		const panelFooter = filterPanel.find('div.filter-panel div.pannel-footer')

		expect(panelFooter.find('.item-text').text().indexOf('mandatory') >= 0).to.be.false
	})

	it('will display mandatory remind if exists any required column', () => {
		const filterPanel = mount(<FilterPanel>
			<FilterPanelRow>
				<FilterPanelColumn filterName='filter1' filterTitle='filter title' isRequired />
			</FilterPanelRow>
		</FilterPanel>)
		const panelFooter = filterPanel.find('div.filter-panel div.pannel-footer')

		expect(panelFooter.find('.item-text').text().indexOf('* These fields are mandatory') >= 0).to.be.true
	})

	it('will display error message when any column has error', () => {
		const filterPanel = mount(<FilterPanel>
			<FilterPanelRow>
				<FilterPanelColumn filterName='filter1' filterTitle='filter title' />
			</FilterPanelRow>
		</FilterPanel>)
		const panelFooter = filterPanel.find('div.filter-panel div.pannel-footer')
		const panelItemText = panelFooter.find('.item-text')

		filterPanel.setState({
			hasError: true
		})

		expect(panelItemText.find('.color-red')).to.have.length(1)
	})

	it('will trigger reset handle after click reset button', () => {
		const resetHandle = sinon.spy()
		const filterPanel = mount(<FilterPanel onReset={resetHandle} />)
		const panelFooter = filterPanel.find('div.filter-panel div.pannel-footer')

		panelFooter.find('button.btn.btn-link').simulate('click')
		expect(resetHandle.called).to.be.true
	})

	it('will trigger submit handle after click search button and has no error', () => {
		const submitHandle = sinon.spy()
		const filterPanel = mount(<FilterPanel onSubmit={submitHandle} />)
		const panelFooter = filterPanel.find('div.filter-panel div.pannel-footer')

		panelFooter.find('button.btn.btn-primary').simulate('click')
		expect(submitHandle.called).to.be.true
	})

	it('will not trigger submit handle after click search button when filters have some error', () => {
		const submitHandle = sinon.spy()
		const filterPanel = mount(<FilterPanel onSubmit={submitHandle} />)
		const panelFooter = filterPanel.find('div.filter-panel div.pannel-footer')

		filterPanel.setState({
			filters: {
				'filter1': {
					value: 'filter1',
					defaultValue: 'filter1',
					isValid: false
				}
			}
		})

		panelFooter.find('button.btn.btn-primary').simulate('click')
		expect(submitHandle.called).to.be.false
	})

	it('will cache filters after initial', () => {
		const filterPanel = mount(<FilterPanel>
			<FilterPanelRow>
				<FilterPanelColumn filterName='filter1' filterTitle='filter title' filterValue='value 1' />
			</FilterPanelRow>
		</FilterPanel>)

		expect(filterPanel.state('filters')).to.be.deep.equal({
			'filter1': {
				value: 'value 1',
				defaultValue: 'value 1',
				isValid: true
			}
		})
	})

	it('will cache filters event handles after initial', () => {
		const filter1Name = 'filter1'
		const filter2Name = 'filter2'
		const filterPanel = mount(<FilterPanel>
			<FilterPanelRow>
				<FilterPanelColumn filterName={filter1Name} filterTitle='filter title' filterValue='value 1' />
				<FilterPanelColumn filterName={filter2Name} filterTitle='filter title 2' filterValue='value 2' />
			</FilterPanelRow>
		</FilterPanel>)
		const filter1Handles = filterPanel.state('filterHandles')[filter1Name]
		const filter2Handles = filterPanel.state('filterHandles')[filter2Name]

		expect(typeof filter1Handles.reset).to.equal('function')
		expect(typeof filter1Handles.setValid).to.equal('function')
		expect(typeof filter1Handles.showWarning).to.equal('function')

		expect(typeof filter2Handles.reset).to.equal('function')
		expect(typeof filter2Handles.setValid).to.equal('function')
		expect(typeof filter2Handles.showWarning).to.equal('function')
	})

	it('will set state.existRequiredColumn as true when exists required column', () => {
		const filterPanel = mount(<FilterPanel>
			<FilterPanelRow>
				<FilterPanelColumn filterName='filter1' filterTitle='filter title' filterValue='value 1' isRequired />
			</FilterPanelRow>
		</FilterPanel>)

		expect(filterPanel.state('existRequiredColumn')).to.be.true
	})

	it('will set state.existRequiredColumn as false when does not exist required column', () => {
		const filterPanel = mount(<FilterPanel>
			<FilterPanelRow>
				<FilterPanelColumn filterName='filter1' filterTitle='filter title' filterValue='value 1' />
			</FilterPanelRow>
		</FilterPanel>)

		expect(filterPanel.state('existRequiredColumn')).to.be.false
	})

	it('will count the max column in every rows', () => {
		const filterPanel = mount(<FilterPanel>
			<FilterPanelRow>
				<FilterPanelColumn filterName='filter1' filterTitle='filter title 1' filterValue='value 1' />
			</FilterPanelRow>
			<FilterPanelRow>
				<FilterPanelColumn filterName='filter2' filterTitle='filter title 2' filterValue='value 2' />
				<FilterPanelColumn filterName='filter3' filterTitle='filter title 3' filterValue='value 3' />
			</FilterPanelRow>
		</FilterPanel>)

		expect(filterPanel.state('columnCount')).to.equal(2)
	})

	it('will register pubsub topic when exists topics in props', () => {
		let tokenTriggerSearch = 'someTopic1'
		let tokenRemoveFilter = 'someTopic2'
		let tokenResetFilters = 'someTopic3'

		expect(FilterPanel.__get__('tokenTriggerSearch')).to.be.null
		expect(FilterPanel.__get__('tokenRemoveFilter')).to.be.null
		expect(FilterPanel.__get__('tokenResetFilters')).to.be.null

		const filterPanel = mount(<FilterPanel
			triggerSearchTopic={tokenTriggerSearch}
			resetFiltersTopic={tokenResetFilters}
			removeOneFilterTopic={tokenRemoveFilter} />)

		expect(filterPanel.instance().props.triggerSearchTopic).to.equal(tokenTriggerSearch)
		expect(filterPanel.instance().props.resetFiltersTopic).to.equal(tokenResetFilters)
		expect(filterPanel.instance().props.removeOneFilterTopic).to.equal(tokenRemoveFilter)

		expect(FilterPanel.__get__('tokenTriggerSearch')).to.not.be.null
		expect(FilterPanel.__get__('tokenRemoveFilter')).to.not.be.null
		expect(FilterPanel.__get__('tokenResetFilters')).to.not.be.null
	})

	it('will un-register pubsub topic 3 times when unmount component', () => {
		let tokenTriggerSearch = 'someTopic1'
		let tokenRemoveFilter = 'someTopic2'
		let tokenResetFilters = 'someTopic3'

		sinon.spy(FilterPanel.prototype, 'componentWillUnmount')
		sinon.spy(PubSub, 'unsubscribe')

		const filterPanel = mount(<FilterPanel
			triggerSearchTopic={tokenTriggerSearch}
			resetFiltersTopic={tokenRemoveFilter}
			removeOneFilterTopic={tokenResetFilters} />)

		filterPanel.instance().componentWillUnmount()
		expect(FilterPanel.prototype.componentWillUnmount).to.have.property('callCount', 1)
		FilterPanel.prototype.componentWillUnmount.restore()

		expect(PubSub.unsubscribe).to.have.property('callCount', 3)
		PubSub.unsubscribe.restore()
	})

	it('will trigger props.onReset and reset all filters when run handleReset function', () => {
		const resetHandle = sinon.spy()

		const filterPanel = mount(<FilterPanel onReset={resetHandle}>
			<FilterPanelRow>
				<FilterPanelColumn filterName='filter1' filterTitle='filter title' filterValue='value 1' isRequired />
			</FilterPanelRow>
		</FilterPanel>)

		filterPanel.setState({
			filters: [],
			hasError: true
		})

		expect(resetHandle.calledOnce).to.be.false
		expect(filterPanel.state('filters')).to.not.be.deep.equal(filterPanel.state('originFilters'))
		expect(filterPanel.state('hasError')).to.be.true

		filterPanel.instance().handleReset()

		expect(resetHandle.calledOnce).to.be.true
		expect(filterPanel.state('filters')).to.be.deep.equal(filterPanel.state('originFilters'))
		expect(filterPanel.state('hasError')).to.be.false
	})

	it('will trigger props.onSubmit when run handleSubmit function without error', () => {
		const submitHandle = sinon.spy()

		const filterPanel = mount(<FilterPanel onSubmit={submitHandle}>
			<FilterPanelRow>
				<FilterPanelColumn filterName='filter1' filterTitle='filter title' filterValue='value 1' isRequired />
			</FilterPanelRow>
		</FilterPanel>)
		const wrapFilterToSubmitFormat = filterPanel.instance().wrapFilterToSubmitFormat
		const wrappedFilters = wrapFilterToSubmitFormat()

		filterPanel.instance().handleSubmit()

		expect(submitHandle.calledOnce).to.be.true
		expect(submitHandle.calledWith(wrappedFilters)).to.be.true
		expect(filterPanel.state('hasError')).to.be.false
	})

	it('will not trigger props.onSubmit when run handleSubmit function with error', () => {
		const submitHandle = sinon.spy()
		const filterShowWarning = sinon.spy()

		const filterPanel = mount(<FilterPanel onSubmit={submitHandle}>
			<FilterPanelRow>
				<FilterPanelColumn filterName='filter1' filterTitle='filter title' />
			</FilterPanelRow>
		</FilterPanel>)
		let filters = filterPanel.state('filters')
		let filterHandles = filterPanel.state('filterHandles')

		filters.filter1.isValid = false
		filterHandles.filter1.showWarning = filterShowWarning

		filterPanel.setState({
			filters: filters,
			filterHandles: filterHandles
		})

		filterPanel.instance().handleSubmit()

		expect(submitHandle.calledOnce).to.be.false
		expect(filterPanel.state('hasError')).to.be.true
		expect(filterShowWarning.calledOnce).to.be.true
	})

	it('#preSubmit will reset state.hasClickedSubmit and state.hasError', () => {
		const filterPanel = mount(<FilterPanel>
			<FilterPanelRow>
				<FilterPanelColumn filterName='filter1' filterTitle='filter title' />
			</FilterPanelRow>
		</FilterPanel>)

		filterPanel.setState({
			hasClickedSubmit: false,
			hasError: true
		})

		expect(filterPanel.state('hasClickedSubmit')).to.be.false
		expect(filterPanel.state('hasError')).to.be.true

		filterPanel.instance().handleSubmit()

		expect(filterPanel.state('hasClickedSubmit')).to.be.true
		expect(filterPanel.state('hasError')).to.be.false
	})

	it('#checkDoesAnyFilterInvalid will check whether any filter is invalid', () => {
		const filterPanel = mount(<FilterPanel>
			<FilterPanelRow>
				<FilterPanelColumn filterName='filter1' filterTitle='filter title' />
			</FilterPanelRow>
		</FilterPanel>)
		let filters = filterPanel.state('filters')

		expect(filterPanel.instance().checkDoesAnyFilterInvalid()).to.be.false

		filters.filter1.isValid = false
		filterPanel.setState({
			filters: filters
		})

		expect(filterPanel.instance().checkDoesAnyFilterInvalid()).to.be.true
	})

	it('#wrapFilterToSubmitFormat will return filter name/value mapping without other attributes ', () => {
		const filterPanel = mount(<FilterPanel>
			<FilterPanelRow>
				<FilterPanelColumn filterName='filter1' filterTitle='filter title' />
			</FilterPanelRow>
		</FilterPanel>)
		let filters = filterPanel.state('filters')
		let wrappedFilter = filterPanel.instance().wrapFilterToSubmitFormat()

		expect(wrappedFilter).to.not.be.deep.equal(filters)
		expect(wrappedFilter.filter1).to.equal(filters.filter1.value)
	})

	it('#changeFilter will modify filters value by parameters ', () => {
		let filters
		let filterName = 'filter1'
		let filterValue = 'filterValue1'
		let filterIsvalid = false
		const filterPanel = mount(<FilterPanel>
			<FilterPanelRow>
				<FilterPanelColumn filterName={filterName} filterTitle='filter title' />
			</FilterPanelRow>
		</FilterPanel>)

		filterPanel.instance().changeFilter(filterName, filterValue, filterIsvalid)

		filters = filterPanel.state('filters')

		expect(filters[filterName].value).to.equal(filterValue)
		expect(filters[filterName].isValid).to.equal(filterIsvalid)
	})

	describe('pairing verify', () => {
		it('will do pairing verify when needed pairing verify filters changed', () => {
			let filter1Name = 'filter1'
			let filter2Name = 'filter2'
			let filter1Value = '1'
			let filter2Value = '2'
			let filter1PairingVerify = [{
				operation: '<=',
				partners: [filter2Name]
			}]
			let filter2PairingVerify = [{
				operation: '>=',
				partners: [filter1Name]
			}]
			let validChangedFilter1Value = 2
			let invalidChangedFilter1Value = 5
			let eFilter1ValidChange = {
				target: {
					value: validChangedFilter1Value
				}
			}
			let eFilter1InvalidChange = {
				target: {
					value: invalidChangedFilter1Value
				}
			}

			let validChangedFilter2Value = 10
			let invalidChangedFilter2Value = 1
			let eFilter2ValidChange = {
				target: {
					value: validChangedFilter2Value
				}
			}
			let eFilter2InvalidChange = {
				target: {
					value: invalidChangedFilter2Value
				}
			}

			const filterPanel = mount(<FilterPanel>
				<FilterPanelRow>
					<FilterPanelColumn filterName={filter1Name}
						filterTitle='filter 1'
						filterValue={filter1Value}
						pairingVerify={filter1PairingVerify} />
					<FilterPanelColumn filterName={filter2Name}
						filterTitle='filter 2'
						filterValue={filter2Value}
						pairingVerify={filter2PairingVerify} />
				</FilterPanelRow>
			</FilterPanel>)

			const filter1Component = filterPanel.find(FilterPanelColumn).first()
			const filter2Component = filterPanel.find(FilterPanelColumn).last()

			filter1Component.find('input').first().simulate('change', eFilter1InvalidChange)
			expect(filterPanel.state('filters')[filter1Name].isValid).to.be.false

			filter1Component.find('input').first().simulate('change', eFilter1ValidChange)
			expect(filterPanel.state('filters')[filter1Name].isValid).to.be.true

			filter2Component.find('input').first().simulate('change', eFilter2InvalidChange)
			expect(filterPanel.state('filters')[filter2Name].isValid).to.be.false

			filter2Component.find('input').first().simulate('change', eFilter2ValidChange)
			expect(filterPanel.state('filters')[filter2Name].isValid).to.be.true
		})

		it('will trigger all setValid of partners when pairing verify fail', () => {
			let filter1Name = 'filter1'
			let filter2Name = 'filter2'
			let filter1Value = '1'
			let filter2Value = '2'
			let filter1PairingVerify = [{
				operation: '<=',
				partners: [filter2Name]
			}]
			let invalidChangedFilter1Value = 5
			let eInvalidChange = {
				target: {
					value: invalidChangedFilter1Value
				}
			}
			const filter1SetValidHandle = sinon.spy()
			const filter2SetValidHandle = sinon.spy()

			const filterPanel = mount(<FilterPanel>
				<FilterPanelRow>
					<FilterPanelColumn filterName={filter1Name}
						filterTitle='filter 1'
						filterValue={filter1Value}
						pairingVerify={filter1PairingVerify} />
					<FilterPanelColumn filterName={filter2Name}
						filterTitle='filter 2'
						filterValue={filter2Value} />
				</FilterPanelRow>
			</FilterPanel>)
			const filter1Component = filterPanel.find(FilterPanelColumn).first()
			let filterHandles = filterPanel.state('filterHandles')

			filterHandles[filter1Name].setValid = filter1SetValidHandle
			filterHandles[filter2Name].setValid = filter2SetValidHandle

			filterPanel.setState({
				filterHandles: filterHandles
			})

			filter1Component.find('input').first().simulate('change', eInvalidChange)

			expect(filterPanel.state('filters')[filter1Name].isValid).to.be.false
			expect(filter2SetValidHandle.calledOnce).to.be.true
		})
	})
})

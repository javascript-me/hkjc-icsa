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
					<FilterPanelColumn filterName='filter1' filterTitle='filter title'/>
				</FilterPanelRow>
			</FilterPanel>)
		const panelFooter = filterPanel.find('div.filter-panel div.pannel-footer')

		expect(panelFooter.find('.item-text').text().indexOf('mandatory') >= 0).to.be.false
	})

	it('will display mandatory remind if exists any required column', () => {
		const filterPanel = mount(<FilterPanel>
				<FilterPanelRow>
					<FilterPanelColumn filterName='filter1' filterTitle='filter title' isRequired={true}/>
				</FilterPanelRow>
			</FilterPanel>)
		const panelFooter = filterPanel.find('div.filter-panel div.pannel-footer')

		expect(panelFooter.find('.item-text').text().indexOf('* These fields are mandatory') >= 0).to.be.true
	})

	it('will display error message when any column has error', () => {
		const filterPanel = mount(<FilterPanel>
				<FilterPanelRow>
					<FilterPanelColumn filterName='filter1' filterTitle='filter title'/>
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
		const filterPanel = mount(<FilterPanel onReset={resetHandle}/>)
		const panelFooter = filterPanel.find('div.filter-panel div.pannel-footer')

		panelFooter.find('button.btn.btn-link').simulate('click')
		expect(resetHandle.called).to.be.true
	})

	it('will trigger submit handle after click search button and has no error', () => {
		const submitHandle = sinon.spy()
		const filterPanel = mount(<FilterPanel onSubmit={submitHandle}/>)
		const panelFooter = filterPanel.find('div.filter-panel div.pannel-footer')

		panelFooter.find('button.btn.btn-primary').simulate('click')
		expect(submitHandle.called).to.be.true
	})

	it('will not trigger submit handle after click search button when filters have some error', () => {
		const submitHandle = sinon.spy()
		const filterPanel = mount(<FilterPanel onSubmit={submitHandle}/>)
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
			'filter1' : {
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
					<FilterPanelColumn filterName='filter1' filterTitle='filter title' filterValue='value 1' isRequired={true} />
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
		let tokenTriggerSearch = "someTopic1"
		let tokenRemoveFilter = "someTopic2"
		let tokenResetFilters = "someTopic3"

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
		let tokenTriggerSearch = "someTopic1"
		let tokenRemoveFilter = "someTopic2"
		let tokenResetFilters = "someTopic3"

		sinon.spy(FilterPanel.prototype, 'componentWillUnmount');
		sinon.spy(PubSub, 'unsubscribe');

		const filterPanel = mount(<FilterPanel 
			triggerSearchTopic={tokenTriggerSearch}
			resetFiltersTopic={tokenRemoveFilter}
			removeOneFilterTopic={tokenResetFilters} />)

		filterPanel.instance().componentWillUnmount()
		expect(FilterPanel.prototype.componentWillUnmount).to.have.property('callCount', 1);
		FilterPanel.prototype.componentWillUnmount.restore();

		expect(PubSub.unsubscribe).to.have.property('callCount', 3);
		PubSub.unsubscribe.restore();
	})

	it('will trigger props.onReset and reset all filters when run handleReset function', () => {
		const resetHandle = sinon.spy()

		const filterPanel = mount(<FilterPanel onReset={resetHandle}>
				<FilterPanelRow>
					<FilterPanelColumn filterName='filter1' filterTitle='filter title' filterValue='value 1' isRequired={true} />
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
					<FilterPanelColumn filterName='filter1' filterTitle='filter title' filterValue='value 1' isRequired={true} />
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


	
})
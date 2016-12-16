import React from 'react'
import { mount, shallow } from 'enzyme'

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

	it('will check whether exists required column or not and cache right value in state', () => {
		const filterPanel = mount(<FilterPanel>
				<FilterPanelRow>
					<FilterPanelColumn filterName='filter1' filterTitle='filter title' filterValue='value 1' isRequired={true} />
				</FilterPanelRow>
			</FilterPanel>)
		
		expect(filterPanel.state('existRequiredColumn')).to.be.true
	})

	it('will count the max column in every rows', () => {
		// const filterPanel = mount(<FilterPanel>
		// 		<FilterPanelRow>
		// 			<FilterPanelColumn filterName='filter1' filterTitle='filter title 1' filterValue='value 1' />
		// 		</FilterPanelRow>
		// 		<FilterPanelRow>
		// 			<FilterPanelColumn filterName='filter2' filterTitle='filter title 2' filterValue='value 2' />
		// 			<FilterPanelColumn filterName='filter3' filterTitle='filter title 3' filterValue='value 3' />
		// 		</FilterPanelRow>
		// 	</FilterPanel>)

		
		// expect(filterPanel.state('columnCount')).to.equal(2)
	})


	
})
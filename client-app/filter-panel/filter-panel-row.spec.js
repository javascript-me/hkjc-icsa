import React from 'react'
import { shallow } from 'enzyme'

import FilterPanelRow from './filter-panel-row'
import FilterPanelColumn from './filter-panel-column'

describe('<FilterPanelRow /> component', () => {
	it('will render a div with "row" class for component', () => {
		const filterPanelRow = shallow(<FilterPanelRow />)
		expect(filterPanelRow.find('div.row')).to.have.length(1)
	})

	it('will render filter-panel-column component inside if exists', () => {
		const filterPanelRow = shallow(<FilterPanelRow>
			<FilterPanelColumn filterName='filter1' filterTitle='filter title' />
		</FilterPanelRow>)

		expect(filterPanelRow.find('div.row').children()).to.have.length(1)
		expect(filterPanelRow.find(FilterPanelColumn)).to.have.length(1)
	})

	it('will past property to filter-panel-column component', () => {
		const changeFilter = () => {}
		const filterPanelRow = shallow(<FilterPanelRow changeFilter={changeFilter}>
			<FilterPanelColumn filterName='filter1' filterTitle='filter title' />
		</FilterPanelRow>)

		const columnComponent = filterPanelRow.find(FilterPanelColumn)

		expect(typeof columnComponent.prop('onChange')).to.equal('function')
		expect(typeof columnComponent.prop('doPairingVerify')).to.equal('function')
		expect(typeof columnComponent.prop('registerColumnHandles')).to.equal('function')
	})
})

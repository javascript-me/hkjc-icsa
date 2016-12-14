import React from 'react'
import { mount, shallow } from 'enzyme'

import FilterPanelColumn from './filter-panel-column'

const selectDataSource = [{
	id: 1,
	value: 'one'
}, {
	id: 2,
	value: 'two'
}]

describe('<FilterPanelColumn /> component', () => {
	it('will renders a div with form-group class for component', () => {
		const filterPanelColumn = shallow(<FilterPanelColumn filterName='filter1' filterTitle='Filter 1' />)

		expect(filterPanelColumn.find('div.form-group')).to.have.length(1)
	})

	describe('check default value of props,', () => {
		it('check default value of props', () => {
			const filterPanelColumn = shallow(<FilterPanelColumn filterName='filter1' filterTitle='Filter 1' />)
			const filterPanelColumnInstance = filterPanelColumn.instance()

			expect(filterPanelColumnInstance.props.ctrlType).to.equal('textbox')
			expect(filterPanelColumnInstance.props.isRequired).to.be.false
			expect(filterPanelColumnInstance.props.pairingVerify).to.deep.equal([])
			expect(typeof filterPanelColumnInstance.props.onChange).to.equal('function')
			expect(typeof filterPanelColumnInstance.props.doPairingVerify).to.equal('function')
			expect(typeof filterPanelColumnInstance.props.registerColumnHandles).to.equal('function')
		})
	})

	describe('check default value of state,', () => {
		it('when props.ctrlType is blank', () => {
			const textboxFilterPanelColumn = shallow(<FilterPanelColumn filterName='filter1' filterTitle='Filter 1' />)

			expect(textboxFilterPanelColumn.state('isValid')).to.be.true
			expect(textboxFilterPanelColumn.state('showWarning')).to.be.false
			expect(textboxFilterPanelColumn.state('filterValue')).to.equal('')
		})

		it('when props.ctrlType is "multi-select"', () => {
			const multiSelectFilterPanelColumn = shallow(<FilterPanelColumn filterName='filter2' filterTitle='Filter 2' ctrlType='multi-select' dataSource={selectDataSource} />)

			expect(multiSelectFilterPanelColumn.instance().props.ctrlType).to.equal('multi-select')
			expect(multiSelectFilterPanelColumn.state('filterValue')).to.deep.equal([])
		})
	})

	describe('will get inputed props,', () => {
		it('base props: filterName, filterTitle, filterValue', () => {
			const inputFilterName = 'filter1'
			const inputFilterTitle = 'Filter 1'
			const inputFilterValue = 'filter value 1'
			const filterPanelColumn = shallow(<FilterPanelColumn filterName={inputFilterName} filterTitle={inputFilterTitle} filterValue={inputFilterValue} />)
			const filterTitleLabel = filterPanelColumn.find('div.form-group label.column-title')
			const filterTitleDisplay = filterTitleLabel.text()
			const filterPanelColumnInstance = filterPanelColumn.instance()

			expect(filterPanelColumnInstance.props.filterName).to.be.equal(inputFilterName)
			expect(filterTitleDisplay.indexOf(inputFilterTitle) >= 0).to.be.true
			expect(filterPanelColumn.state('filterValue')).to.equal(inputFilterValue)
		})

		it('props.isRequired = true', () => {
			const filterPanelColumn = shallow(<FilterPanelColumn filterName='filter1' filterTitle='Filter 1' isRequired />)
			const filterRequiredSpan = filterPanelColumn.find('div.form-group label.column-title span.required')
			const spanText = filterRequiredSpan.text()

			expect(filterRequiredSpan).to.have.length(1)
			expect(spanText.indexOf('*') >= 0).to.be.true
		})
	})

	describe('will register column handles,', () => {
		let registedInfoCache = {}
		const registerColumnHandles = (filterName, reset, setValid, showError) => {
			registedInfoCache.filterName = filterName
			registedInfoCache.reset = reset
			registedInfoCache.setValid = setValid
			registedInfoCache.showError = showError
		}
		const inputFilterName = 'filter1'
		const inputFilterTitle = 'Filter 1'
		const inputFilterValue = 'filter value 1'
		const filterPanelColumn = mount(<FilterPanelColumn
			filterName={inputFilterName}
			filterTitle={inputFilterTitle}
			filterValue={inputFilterValue}
			registerColumnHandles={registerColumnHandles} />)

		it('initial by input properties', () => {
			expect(registedInfoCache.filterName).to.equal(inputFilterName)
			expect(filterPanelColumn.state('filterValue')).to.equal(inputFilterValue)
			expect(filterPanelColumn.state('isValid')).to.be.true
		})

		it('state.isValid will change after trigger setValid handle which registed outside', () => {
			registedInfoCache.setValid(false)
			expect(filterPanelColumn.state('isValid')).to.be.false

			registedInfoCache.setValid(true)
			expect(filterPanelColumn.state('isValid')).to.be.true
		})

		it('state.showWarning will be true after trigger showError handle which registed outside', () => {
			registedInfoCache.showError()
			expect(filterPanelColumn.state('showWarning')).to.be.true
		})

		it('state will reset as props.filterValue after trigger reset handle which registed outside', () => {
			let newFilterValue = 'new filter value 1'

			filterPanelColumn.setState({
				filterValue: newFilterValue,
				isValid: false,
				showWarning: true
			})

			expect(filterPanelColumn.state('filterValue')).to.equal(newFilterValue)
			expect(filterPanelColumn.state('isValid')).to.be.false
			expect(filterPanelColumn.state('showWarning')).to.be.true

			registedInfoCache.reset()
			expect(filterPanelColumn.state('filterValue')).to.equal(inputFilterValue)
			expect(filterPanelColumn.state('isValid')).to.be.true
			expect(filterPanelColumn.state('showWarning')).to.be.false
		})
	})

	describe('generates filter control,', () => {

	})

	describe('changes filter control value,', () => {

	})

	describe('will verify by props.customVerification,', () => {

	})

	describe('will verify pairing with other filter-panel-column component by props.pairingVerify,', () => {

	})
})

import React from 'react'
import { mount, shallow } from 'enzyme'

import Calendar from '../calendar'
import SelectCom from '../select/select'
import MultiSelect from '../muti-select'

import FilterPanelColumn from './filter-panel-column'

const selectDataSource = [{
	id: 1,
	value: 'one'
}, {
	id: 2,
	value: 'two'
}]

describe('<FilterPanelColumn /> component', () => {
	it('will render a div with form-group class for component', () => {
		const filterPanelColumn = shallow(<FilterPanelColumn filterName='filter1' filterTitle='Filter 1' />)

		expect(filterPanelColumn.find('div.form-group')).to.have.length(1)
	})

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

		it('initial by input properties', () => {
			registedInfoCache = {}
			
			const filterPanelColumn = mount(<FilterPanelColumn
				filterName={inputFilterName}
				filterTitle={inputFilterTitle}
				filterValue={inputFilterValue}
				registerColumnHandles={registerColumnHandles} />)

			expect(registedInfoCache.filterName).to.equal(inputFilterName)
			expect(filterPanelColumn.state('filterValue')).to.equal(inputFilterValue)
			expect(filterPanelColumn.state('isValid')).to.be.true
		})

		it('state.isValid will change after trigger setValid handle which registed outside', () => {
			registedInfoCache = {}
			
			const filterPanelColumn = mount(<FilterPanelColumn
				filterName={inputFilterName}
				filterTitle={inputFilterTitle}
				filterValue={inputFilterValue}
				registerColumnHandles={registerColumnHandles} />)

			registedInfoCache.setValid(false)
			expect(filterPanelColumn.state('isValid')).to.be.false

			registedInfoCache.setValid(true)
			expect(filterPanelColumn.state('isValid')).to.be.true
		})

		it('state.showWarning will be true after trigger showError handle which registed outside', () => {
			registedInfoCache = {}
			
			const filterPanelColumn = mount(<FilterPanelColumn
				filterName={inputFilterName}
				filterTitle={inputFilterTitle}
				filterValue={inputFilterValue}
				registerColumnHandles={registerColumnHandles} />)

			registedInfoCache.showError()
			expect(filterPanelColumn.state('showWarning')).to.be.true
		})

		it('state will reset as props.filterValue after trigger reset handle which registed outside', () => {
			registedInfoCache = {}
			
			let newFilterValue = 'new filter value 1'
			const filterPanelColumn = mount(<FilterPanelColumn
				filterName={inputFilterName}
				filterTitle={inputFilterTitle}
				filterValue={inputFilterValue}
				registerColumnHandles={registerColumnHandles} />)

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
		it('when no props.ctrlType provided ', () => {
			const filterPanelColumn = shallow(<FilterPanelColumn filterName='filter1' filterTitle='Filter 1' />)
			const filterPanelColumnInstance = filterPanelColumn.instance()

			expect(filterPanelColumn.prop('ctrlType')).to.equal(undefined)
			expect(filterPanelColumnInstance.props.ctrlType).to.equal('textbox')
			expect(filterPanelColumn.find('input[type="text"]')).to.have.length(1)
		})

		it('when props.ctrlType is textbox', () => {
			let filterValue = 'filter value 1'
			const filterPanelColumn = mount(<FilterPanelColumn filterName='filter1' filterTitle='Filter 1' filterValue={filterValue} />)
			const filterPanelColumnInstance = filterPanelColumn.instance()

			expect(filterPanelColumnInstance.props.ctrlType).to.equal('textbox')
			expect(filterPanelColumn.find('input[type="text"]')).to.have.length(1)
			expect(filterPanelColumn.find('input[type="text"]').prop('value')).to.equal(filterValue)


		})

		it('when props.ctrlType is select', () => {
			let filterValue = '1'
			const filterPanelColumn = mount(<FilterPanelColumn filterName='filter1' filterTitle='Filter 1' ctrlType='select' dataSource={selectDataSource} filterValue={filterValue} />)
			const filterPanelColumnInstance = filterPanelColumn.instance()

			expect(filterPanelColumnInstance.props.ctrlType).to.equal('select')
			expect(filterPanelColumn.find('select')).to.have.length(1)
			expect(filterPanelColumn.find('select option')).to.have.length(selectDataSource.length + 1)
			expect(filterPanelColumn.find('select').prop('value')).to.equal(filterValue)			
		})

		it('when props.ctrlType is multi-select', () => {
			let filterValue = [{
				value: 1,
				label: 'one'
			}]
			const multiSelectDataSource = [{
				value: 1,
				label: 'one'
			}, {
				value: 2,
				label: 'two'
			}]
			const filterPanelColumn = mount(<FilterPanelColumn filterName='filter1' filterTitle='Filter 1' ctrlType='multi-select' dataSource={selectDataSource} filterValue={filterValue} />)
			const filterPanelColumnInstance = filterPanelColumn.instance()

			expect(filterPanelColumnInstance.props.ctrlType).to.equal('multi-select')
			expect(filterPanelColumn.find(MultiSelect)).to.have.length(1)
			expect(filterPanelColumn.find(MultiSelect).prop('options')).to.deep.equal(multiSelectDataSource)
			expect(filterPanelColumn.find(MultiSelect).prop('selectedOptions')).to.deep.equal(filterValue)
			expect(filterPanelColumn.find(MultiSelect).prop('style')).to.deep.equal({
				width: '200px',
				height: '30px'
			})
		})

		it('when props.ctrlType is calendar', () => {
			let filterValue = '05 Oct 2016 00:00'
			const filterPanelColumn = mount(<FilterPanelColumn filterName='filter1' filterTitle='Filter 1' ctrlType='calendar' filterValue={filterValue} />)
			const filterPanelColumnInstance = filterPanelColumn.instance()

			expect(filterPanelColumnInstance.props.ctrlType).to.equal('calendar')
			expect(filterPanelColumn.find(Calendar)).to.have.length(1)
			expect(filterPanelColumn.find(Calendar).prop('value')).to.equal(filterValue)
		})
	})

	describe('changes filter control value,', () => {
		it('when props.ctrlType is textbox', () => {
			let filterName = 'filter1'
			let filterValue = 'filter value 1'
			let changedFilterValue = 'filter value 2'
			let e = {
				target: {
					value: changedFilterValue
				}
			}
			const changeHandle = sinon.spy()
			const filterPanelColumn = mount(<FilterPanelColumn filterName={filterName} filterTitle='Filter 1' filterValue={filterValue} onChange={changeHandle} />)
			
			filterPanelColumn.find('input').simulate('change', e)

			expect(filterPanelColumn.state('filterValue')).to.equal(changedFilterValue)
			expect(changeHandle.called).to.be.true
			expect(changeHandle.calledWith(filterName, changedFilterValue)).to.be.true
		})

		it('when props.ctrlType is select', () => {
			let filterName = 'filter1'
			let filterValue = '1'
			let changedFilterValue = '2'
			let e = {
				target: {
					value: changedFilterValue
				}
			}
			const changeHandle = sinon.spy()
			const filterPanelColumn = mount(<FilterPanelColumn 
				filterName={filterName} 
				filterTitle='Filter 1' 
				ctrlType='select' 
				filterValue={filterValue} 
				onChange={changeHandle} 
				dataSource={selectDataSource} />)
			
			filterPanelColumn.find('select').simulate('change', e)

			expect(filterPanelColumn.state('filterValue')).to.equal(changedFilterValue)
			expect(changeHandle.called).to.be.true
			expect(changeHandle.calledWith(filterName, changedFilterValue)).to.be.true
		})

		it('when props.ctrlType is multi-select', () => {
			let filterValue = [{
				value: 1,
				label: 'one'
			}]
			let filterName = 'filter1'
			let selectedFilterValue = [{
				value: 2,
				label: 'two'
			}]
			let allSelectedOptions = filterValue.concat(selectedFilterValue)
			const changeHandle = sinon.spy()
			const filterPanelColumn = mount(<FilterPanelColumn 
				filterName={filterName} 
				filterTitle='Filter 1' 
				ctrlType='multi-select' 
				dataSource={selectDataSource} 
				filterValue={filterValue} 
				onChange={changeHandle} />)
			
			filterPanelColumn.find('div.option').last().simulate('click')

			expect(filterPanelColumn.state('filterValue')).to.deep.equal(allSelectedOptions)
			expect(changeHandle.called).to.be.true
			expect(changeHandle.calledWith(filterName, allSelectedOptions)).to.be.true
		})

		it('when props.ctrlType is calendar', () => {
			jsdom()
			let filterValue = '05 Oct 2016 00:00'
			let firstDayOfCurrentCalendar = '28 Sep 2016 00:00'
			const changeHandle = sinon.spy()
			const filterPanelColumn = mount(<FilterPanelColumn 
				filterName='filter1' 
				filterTitle='Filter 1' 
				ctrlType='calendar' 
				filterValue={filterValue} 
				onChange={changeHandle}/>)
			const calendar = filterPanelColumn.find(Calendar)

			calendar.find('.input-group').simulate('click')
			calendar.find('.rdtDay').first().simulate('click')
			calendar.find('.rdtDay').last().simulate('click')

			expect(changeHandle.calledTwice).to.be.true
		})
	})

	describe('will verify by props.customVerification,', () => {
		it('when typeof props.customVerification is regular expression', () => {
			let filterName = 'filter1'
			let filterValue = 'filter value 1'
			let validChangedFilterValue = 'valid'
			let invalidChangedFilterValue = 'invalid'
			let eValidChange = {
				target: {
					value: validChangedFilterValue
				}
			}
			let eInvalidChange = {
				target: {
					value: invalidChangedFilterValue
				}
			}
			let customReg = /^valid$/
			const filterPanelColumn = mount(<FilterPanelColumn 
				filterName={filterName} 
				filterTitle='Filter 1' 
				filterValue={filterValue} 
				customVerification={customReg} />)

			expect(filterPanelColumn.state('isValid')).to.be.false

			filterPanelColumn.find('input').simulate('change', eInvalidChange)
			expect(filterPanelColumn.state('isValid')).to.be.false

			filterPanelColumn.find('input').simulate('change', eValidChange)
			expect(filterPanelColumn.state('isValid')).to.be.true
		})

		it('when typeof props.customVerification is function', () => {
			let filterName = 'filter1'
			let filterValue = 'valid'
			let validChangedFilterValue = 'valid'
			let invalidChangedFilterValue = 'invalid'
			let eValidChange = {
				target: {
					value: validChangedFilterValue
				}
			}
			let eInvalidChange = {
				target: {
					value: invalidChangedFilterValue
				}
			}
			let customVerifyFunc = filterValue => {
				return filterValue === 'valid'
			}
			const filterPanelColumn = mount(<FilterPanelColumn 
				filterName={filterName} 
				filterTitle='Filter 1' 
				filterValue={filterValue} 
				customVerification={customVerifyFunc} />)

			expect(filterPanelColumn.state('isValid')).to.be.true

			filterPanelColumn.find('input').simulate('change', eInvalidChange)
			expect(filterPanelColumn.state('isValid')).to.be.false

			filterPanelColumn.find('input').simulate('change', eValidChange)
			expect(filterPanelColumn.state('isValid')).to.be.true
		})
	})

	describe('will verify pairing with other filter-panel-column component by props.pairingVerify,', () => {
		it('when has props.pairingVerify as object array', () => {
			let filterName = 'filter1'
			let filterValue = '2'
			let validChangedFilterValue = 10
			let invalidChangedFilterValue = 40
			let eValidChange = {
				target: {
					value: validChangedFilterValue
				}
			}
			let eInvalidChange = {
				target: {
					value: invalidChangedFilterValue
				}
			}
			let partnersValue = {
				smallest: 1,
				middle: 10,
				largest: 20
			}
			let pairingVerifyCount = 0
			const pairingVerifySetting = [{
				operation: '>',
				partners: ['smallest']
			}, {
				operation: '>=',
				partners: ['smallest']
			}, {
				operation: '==',
				partners: ['middle']
			}, {
				operation: '<=',
				partners: ['largest']
			}, {
				operation: '<',
				partners: ['largest']
			}]
			const doPairingVerifyFunc = (filterValue, ctrlType, pairingVerify) => {
				let isValid = true
				let me = this
				let operation
				let partners

				if(!pairingVerify || !pairingVerify.length) {
					return isValid;
				}

				pairingVerifyCount = pairingVerify.length

				pairingVerify.every(function(verify) {
					operation = verify.operation
					partners = verify.partners

					partners.every(function(partner) {
						switch (operation) {
							case '>':
								isValid = filterValue > partnersValue[partner]
								break
							case '>=':
								isValid = filterValue >= partnersValue[partner]
								break
							case '==':
								isValid = filterValue == partnersValue[partner]
								break
							case '<=':
								isValid = filterValue <= partnersValue[partner]

								break
							case '<':
								isValid = filterValue < partnersValue[partner]
								break
							default:
								break
						}

						return isValid
					})

					return isValid
				})

				return isValid
			}
			const filterPanelColumn = mount(<FilterPanelColumn 
				filterName={filterName} 
				filterTitle='Filter 1' 
				filterValue={filterValue} 
				pairingVerify={pairingVerifySetting}
				doPairingVerify={doPairingVerifyFunc} />)

			expect(filterPanelColumn.state('isValid')).to.be.false
			expect(pairingVerifyCount).to.equal(pairingVerifySetting.length)

			filterPanelColumn.find('input').simulate('change', eInvalidChange)
			expect(filterPanelColumn.state('isValid')).to.be.false

			filterPanelColumn.find('input').simulate('change', eValidChange)
			expect(filterPanelColumn.state('isValid')).to.be.true
		})
	})
})

import React from 'react'
import { shallow } from 'enzyme'

import RolesContainer, {TableHeader, TableRow} from './rolescontainer'

describe('<RolesContainer />', () => {
	it('test TableHeader', () => {
		let selStr = ''
		const header = [
			{label: 'User Role', field: 'roleName'}
		]
		const currentSortInfo = { index: 0, sortType: 'up' }
		const handleSort = sinon.spy()
		const handleCheckAll = sinon.spy()
		const wrapper = shallow(<TableHeader header={header} handleSort={handleSort} sortInfo={currentSortInfo} checkedAll={false} handleCheckAll={handleCheckAll} />)

		selStr = 'thead.table-header'
		expect(wrapper.find(selStr)).to.have.length(1)

		selStr = 'thead.table-header tr th .my-checkbox'
		expect(wrapper.find(selStr)).to.have.length(1)
		wrapper.find(selStr).simulate('click')
		expect(handleCheckAll.calledOnce).to.be.true

		selStr = 'thead.table-header tr th.sort-icon'
		expect(wrapper.find(selStr)).to.have.length(1)
		wrapper.find(selStr).simulate('click')
		expect(handleSort.calledOnce).to.be.true
	})

	it('test TableRow', () => {
		let selStr = ''
		const showItems = [{
			'roleId': '001',
			'roleName': 'Trading Solutions Analyst',
			'functionNames': [{
				'functionName': 'Event Template - Data Feed Rating - Fixture Before Start Sell',
				'create': 'Yes',
				'read': 'Yes',
				'update': 'Yes',
				'delete': 'No'
			}, {
				'functionName': 'Event Template - General & Structure Setting',
				'create': 'Yes',
				'read': 'Yes',
				'update': 'Yes',
				'delete': 'Yes'
			}]
		}]
		const fields = ['roleName']
		const handleItemClick = sinon.spy()
		const wrapper = shallow(<TableRow data={showItems} fields={fields} handleItemClick={handleItemClick} />)

		selStr = 'tbody'
		expect(wrapper.find(selStr)).to.have.length(1)

		selStr = 'tbody tr td.tr-header .my-checkbox'
		expect(wrapper.find(selStr)).to.have.length(1)
		wrapper.find(selStr).simulate('click')
		expect(handleItemClick.calledOnce).to.be.true
	})

	it('test RolesContainer', async () => {
		const inputSelected = [{
			'assignedUserRole': 'Trading User Administrator'
		}, {
			'assignedUserRole': 'Trading Supervisor'
		}]

		const response = [{
			'roleId': '001',
			'roleName': 'Trading Solutions Analyst',
			'functionNames': [{
				'functionName': 'Event Template - Data Feed Rating - Fixture Before Start Sell',
				'create': 'Yes',
				'read': 'Yes',
				'update': 'Yes',
				'delete': 'No'
			}, {
				'functionName': 'Event Template - General & Structure Setting',
				'create': 'Yes',
				'read': 'Yes',
				'update': 'Yes',
				'delete': 'Yes'
			}]
		}]

		rewire(RolesContainer.__get__('UserProfileService').__set__('getRoles', () => {
			return Promise.resolve(response)
		}))

		const wrapper = shallow(<RolesContainer inputSelected={inputSelected} />)
		const instance = wrapper.instance()
		await instance.getRoles()
		rewire()
		expect(instance.state.showItems).to.have.length(1)

		let selStr = ''

		selStr = 'div.roles-container'
		expect(wrapper.find(selStr)).to.have.length(1)

		selStr = 'div.roles-container .serch-header input'
		expect(wrapper.find(selStr)).to.have.length(1)
		wrapper.find(selStr).simulate('change', {target: {value: ''}})

		selStr = 'div.roles-container .content table TableHeader'
		expect(wrapper.find(selStr)).to.have.length(1)
		instance.handleSort(0)
		instance.handleCheckAll()

		selStr = 'div.roles-container .content table TableRow'
		expect(wrapper.find(selStr)).to.have.length(1)
		instance.handleItemClick({})

		const updateRoles = instance.getUpdateRoles()
		expect(updateRoles).to.be.an('array')
	})
})

import React from 'react'
import { shallow } from 'enzyme'

import RolesContainer, {TableHeader, TableRow} from './rolespermission'

describe('<RolesContainer />', () => {
	it('test TableHeader', () => {
		let selStr = ''
		const header = [
			{label: 'User Role', field: 'roleName'}
		]
		const wrapper = shallow(<TableHeader header={header} />)

		selStr = 'thead.table-header'
		expect(wrapper.find(selStr)).to.have.length(1)
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
		const wrapper = shallow(<TableRow data={showItems} fields={fields} />)

		selStr = 'tbody'
		expect(wrapper.find(selStr)).to.have.length(1)
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

		let selStr = ''

		selStr = 'div.roles-detail'
		expect(wrapper.find(selStr)).to.have.length(1)

		selStr = 'div.roles-detail table TableHeader'
		expect(wrapper.find(selStr)).to.have.length(1)

		selStr = 'div.roles-detail table TableRow'
		expect(wrapper.find(selStr)).to.have.length(1)
	})
})

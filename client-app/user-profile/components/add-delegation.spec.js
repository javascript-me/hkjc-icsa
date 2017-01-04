import React from 'react'
import { shallow } from 'enzyme'

import Adddelegation, {TableHeader, TableRow} from './add-delegation'

describe('<Adddelegation />', () => {
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

		selStr = 'thead.table-header tr th.sort-icon'
		expect(wrapper.find(selStr)).to.have.length(1)
		wrapper.find(selStr).simulate('click')
		expect(handleSort.calledOnce).to.be.true
	})

	it('test TableRow', () => {
		let selStr = ''
		const showItems = [{
			'userID': 'JC10003',
			'displayName': 'Mike Wang',
			'position': 'Trader'
		}]
		const fields = ['displayName']
		const handleItemClick = sinon.spy()
		const wrapper = shallow(<TableRow data={showItems} fields={fields} handleItemClick={handleItemClick} />)

		selStr = 'tbody'
		expect(wrapper.find(selStr)).to.have.length(1)

		selStr = 'tbody tr td.tr-header input'
		expect(wrapper.find(selStr)).to.have.length(1)
		wrapper.find(selStr).simulate('click')
		expect(handleItemClick.calledOnce).to.be.true
	})

	it('test Adddelegation', async () => {
		const response = [{
			'displayName': 'Mike Wang',
			'emailAddress': 'mike_wang@hkjc.com',
			'firstName': 'Mike',
			'homeAddress': 'Flat 8, HKJC Building, Block 1 Jockey Road, Konglong, Hong Kong',
			'id': 'id003',
			'lastName': 'Wang',
			'phoneNumber': '(+852) 9232 1223',
			'position': 'Trader',
			'staffID': '0000003',
			'userID': 'JC10003'
		},
			{
				'displayName': 'Albert Choi',
				'emailAddress': 'albert_choi_ac@hkjc.com',
				'firstName': 'Albert',
				'homeAddress': 'Flat 8, HKJC Building, Block 1 Jockey Road, Konglong, Hong Kong',
				'id': 'id004',
				'lastName': 'Choi',
				'phoneNumber': '(+852) 9232 1223',
				'position': 'Trader',
				'staffID': '0000004',
				'userID': 'JC10004'
			}]

		rewireService(Adddelegation, 'UserProfileService', 'getDelegations', response)

		const wrapper = shallow(<Adddelegation />)
		const instance = wrapper.instance()
		await instance.getUsers()
		rewire()
		expect(instance.state.showItems).to.have.length(2)

		let selStr = ''

		selStr = 'div.users-container'
		expect(wrapper.find(selStr)).to.have.length(1)

		selStr = 'div.users-container .serch-header input'
		expect(wrapper.find(selStr)).to.have.length(1)
		wrapper.find(selStr).simulate('change', {target: {value: ''}})

		selStr = 'div.users-container .content table TableHeader'
		expect(wrapper.find(selStr)).to.have.length(1)
		instance.handleSort(0)

		selStr = 'div.users-container .content table TableRow'
		expect(wrapper.find(selStr)).to.have.length(1)
		instance.handleItemClick({})

		instance.getDelegation()
		instance.doSort(0, {})
		instance.handleInputChange({target: {value: 'vb'}})
	})
})

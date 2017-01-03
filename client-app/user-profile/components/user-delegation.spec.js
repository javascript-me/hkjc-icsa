import React from 'react'
import { shallow } from 'enzyme'

import UserDelegation from './user-delegation'

const myAccountProfile = {
	'assignedUserRoles': [
		{
			'assignedUserRole': 'Trading User Administrator'
		},
		{
			'assignedUserRole': 'Trading Support Supervisor'
		}
	]
}

const userDelegation = [
	{
		'delegationID': '0001',
		'lastModifyTime': '16/11/2016',
		'userName': 'Mike Wang',
		'position': 'Trader',
		'delegatedRoles': [
			{
				'delegatedRole': 'Trading Supervisor'
			}
		],
		'delegationFrom': '16/11/2016',
		'delegationTo': '22/12/2016',
		'delegateStatus': 'Active',
		'secondaryApprover': 'Albert Choi'
	},
	{
		'delegationID': '0002',
		'lastModifyTime': '16/11/2016',
		'userName': 'Mike Wang',
		'position': 'Trader',
		'delegatedRoles': [
			{
				'delegatedRole': 'Trading Supervisor'
			}
		],
		'delegationFrom': '24/12/2016',
		'delegationTo': '12/01/2017',
		'delegateStatus': 'Pending',
		'secondaryApprover': 'Albert Choi'
	}
]

const newDelegation = {
	checked: true,
	displayName: 'Acton Chang',
	emailAddress: 'acton_chang@hkjc.com',
	firstName: 'Acton',
	homeAddress: 'Flat 8, HKJC Building, Block 1 Jockey Road, Causewaybay, Hong Kong',
	id: 'id005',
	lastName: 'Chang',
	phoneNumber: '+852 9232 1223',
	position: 'Trader',
	staffID: '0000005',
	userID: 'JC10005'
}

describe('<UserDelegation />', () => {
	it('test render none', () => {
		const wrapper = shallow(<UserDelegation userDelegation={null} />)
		expect(wrapper.find('div.user-delegation')).to.have.length(1)
	})
})

describe('<UserDelegation />', () => {
	it('test render normal', () => {
		const wrapper = shallow(<UserDelegation userDelegation={userDelegation} delegationUpdate={false} myAccountProfile={myAccountProfile} />)
		expect(wrapper.find('div.user-delegation')).to.have.length(1)
	})
})

describe('<UserDelegation />', () => {
	it('test render update', () => {
		const wrapper = shallow(<UserDelegation userDelegation={userDelegation} delegationUpdate myAccountProfile={myAccountProfile} />)
		let instance = wrapper.instance()
		let refs = instance.refs = {}
		expect(wrapper.find('div.user-delegation')).to.have.length(1)

		const showCallback = sinon.spy()
		refs.addDelegation = {
			show: showCallback
		}
		wrapper.find('.user-delegation .header .action').simulate('click')
		expect(showCallback.calledOnce).to.be.true

		const getDelegationCallback = sinon.stub().returns(newDelegation)
		refs.delegationShow = {
			getDelegation: getDelegationCallback
		}
		instance.onAddDelegation(instance.refs.delegationShow)
		expect(getDelegationCallback.calledOnce).to.be.true

		instance.getCalendarFormat('delegationFrom')('2016/09/17')
		instance.geterrClassNameFormat('userRole')({}, {})
		instance.roleFormat()
		instance.getLastData()
		instance.checkVaild()
		instance.getDeleteData()
		instance.getChangeResult()
		instance.resetDelegtionData()
		instance.highLightNew({})
		instance.sortByDate(userDelegation[0], userDelegation[1], 'desc', 'delegationFrom')
	})
})

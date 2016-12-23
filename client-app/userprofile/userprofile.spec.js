import React from 'react'
import { shallow } from 'enzyme'

import UserProfile from './userprofile'

const userProfile = {
	user: {
		'id': 'id001',
		'firstName': 'Bing',
		'lastName': 'Hu',
		'displayName': 'Bing Hu',
		'userID': 'JC10001',
		'position': 'Trading Manager',
		'staffID': '0000001',
		'phoneNumber': '+852 9232 1223',
		'emailAddress': 'bing_hu@hkjc.com',
		'homeAddress': 'Flat 8, HKJC Building, Block 1 Jockey Road, Central, Hong Kong'
	},
	account: {
		'id': '0001',
		'displayName': 'Bing Hu',
		'status': 'Active',
		'assignedUserRoles': [
			{
				'assignedUserRole': 'Trading Supervisor'
			}
		],
		'activationDate': '16/09/2016',
		'deactivationDate': '16/09/2017',
		'createApprovalStatus': '1',
		'updateApprovalStatus': '1',
		'deleteApprovalStatus': '1',
		'lastModifiedUserID': 'JC10000',
		'userID': 'JC10001',
		'departmentId': 'TR',
		'delegationList': [
			{
				'delegationID': '0004',
				'lastModifyTime': '16/11/2016',
				'userName': 'Alma Ma',
				'position': 'Trader',
				'delegatedRoles': [
					{
						'delegatedRole': 'Trading Support Analyst'
					}
				],
				'delegationFrom': '07/12/2016',
				'delegationTo': '24/01/2017',
				'delegateStatus': 'Active',
				'secondaryApprover': 'Mike Wang'
			}
		],
		'subscribedCategoryMessages': [
			{
				'messageCatogory': 'Refund',
				'subscribedMessages': [
					{
						'message': 'Participant Scratch'
					},
					{
						'message': 'K.O. / Start Time Update'
					},
					{
						'message': 'Venue Update'
					},
					{
						'message': 'Void Event'
					},
					{
						'message': 'Concluded Event'
					}
				]
			}
		]
	}
}

describe('<UserProfile />', () => {
	it('renders a UserProfile div', async () => {
		const response = userProfile
		const params = {
			userId: 'JC10001'
		}
		const wrapper = shallow(<UserProfile params={params} />)
		let instance = wrapper.instance()
		expect(wrapper.find('div.user-profile')).to.have.length(1)

		rewireService(UserProfile, 'UserProfileService', 'getUserProfile', response)
		await instance.getUserProfile()
		rewire()
		expect(instance.state.userBasic).to.be.deep.equal(response.user)

		expect(instance.state.accountUpdate).to.be.false
		wrapper.find('button.profile-btn-edit').simulate('click')
		expect(instance.state.accountUpdate).to.be.true
		wrapper.find('button.profile-btn-cancel').simulate('click')
		expect(instance.state.accountUpdate).to.be.true
		wrapper.find('button.profile-btn-reset').simulate('click')
		expect(instance.state.accountUpdate).to.be.true
		wrapper.find('button.profile-btn-update').simulate('click')
		expect(instance.state.accountUpdate).to.be.true
	})
})

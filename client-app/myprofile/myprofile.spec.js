import React from 'react'
import { shallow } from 'enzyme'

import MyProfile from './myprofile'

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
				'assignedUserRole': 'Trading User Administrator'
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

describe('<MyProfile />', () => {
	it('MyProfile render', async () => {
		const getProfileCallback = sinon.stub().returns({userId: 'JC10001'})
		rewireKeyVal(MyProfile, 'LoginService', {
			getProfile: getProfileCallback
		})
		rewireService(MyProfile, 'UserProfileService', 'getUserProfile', userProfile)

		const wrapper = shallow(<MyProfile />)
		const instance = wrapper.instance()
		const refs = instance.refs = {}

		expect(wrapper.find('div.my-profile')).to.have.length(1)
		expect(getProfileCallback.calledOnce).to.be.true

		expect(instance.state.bAdmin).to.be.false
		await instance.getUserProfile()
		expect(instance.state.bAdmin).to.be.true

		expect(instance.state.delegationUpdate).to.be.false
		const resetDelegtionCallback = sinon.spy()
		const getDeleteCallback = sinon.stub().returns([])
		const getChangeCallback = sinon.stub().returns(null)
		const checkVaildCallback = sinon.spy()
		refs.delegationCmp = {
			resetDelegtionData: resetDelegtionCallback,
			getDeleteData: getDeleteCallback,
			getChangeResult: getChangeCallback,
			checkVaild: checkVaildCallback
		}
		instance.onEditClick()
		expect(instance.state.delegationUpdate).to.be.true
		expect(resetDelegtionCallback.calledOnce).to.be.true

		instance.onDeleteClick(refs.delegationCmp)
		expect(getDeleteCallback.calledOnce).to.be.true

		const getDelete2Callback = sinon.stub().returns(['JC10001'])
		refs.delegationCmp.getDeleteData = getDelete2Callback
		instance.onDeleteClick(refs.delegationCmp)
		expect(getDeleteCallback.calledOnce).to.be.true
		expect(getChangeCallback.calledOnce).to.be.true

		const getChange2Callback = sinon.stub().returns([''])
		refs.delegationCmp.getChangeResult = getChange2Callback
		instance.onDeleteClick(refs.delegationCmp)
		expect(getChange2Callback.calledOnce).to.be.true

		instance.onCancelClick()
		instance.onUpdateClick(refs.delegationCmp)
		expect(checkVaildCallback.calledOnce).to.be.true

		rewireService(MyProfile, 'UserProfileService', 'deleteDelegation', null)
		instance.deleteUserDelegation(['JC10001'])

		rewire()
	})
})

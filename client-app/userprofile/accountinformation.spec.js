import React from 'react'
import { shallow } from 'enzyme'

import AccountInformation from './accountinformation'

const userAccount = {
	'id': '0001',
	'displayName': 'Bing Hu',
	'status': 'Active',
	'assignedUserRoles': [{
		'assignedUserRole': 'Trading User Administrator'
	}, {
		'assignedUserRole': 'Trading Supervisor'
	}],
	'activationDate': '16/09/2016',
	'deactivationDate': '16/09/2017',
	'createApprovalStatus': '1',
	'updateApprovalStatus': '1',
	'deleteApprovalStatus': '1',
	'lastModifiedUserID': 'JC10000',
	'userID': 'JC10001'
}

describe('<AccountInformation />', () => {
	it('AccountInformation renderNoDate', () => {
		const wrapper = shallow(<AccountInformation userAccount={userAccount} updateMode={false} showDate={false} />)
		expect(wrapper.find('div.account-information')).to.have.length(1)
	})

	it('AccountInformation renderNormal', () => {
		const wrapper = shallow(<AccountInformation userAccount={userAccount} updateMode={false} />)
		expect(wrapper.find('div.account-information')).to.have.length(1)
	})

	it('AccountInformation renderNormal', () => {
		const wrapper = shallow(<AccountInformation userAccount={userAccount} updateMode />)
		expect(wrapper.find('div.account-information')).to.have.length(1)

		const instance = wrapper.instance()
		instance.resetData()
		instance.onActivationDateChange({format: () => '20 Jun 2016 00:00'})
		instance.onDeactivationDateChange({format: () => '20 Jun 2017 00:00'})
		expect(instance.getData()).to.have.property('userID')
		expect(instance.verifyData()).to.be.true

		const rolesCmp = {
			getUpdateRoles: () => {}
		}
		const getUpdateRoles = sinon.stub(rolesCmp, 'getUpdateRoles', () => {
			return ['Trading Supervisor']
		})
		instance.onEditRoleUpdate(userAccount, rolesCmp)
		expect(getUpdateRoles.calledOnce).to.be.true

		const editRoleCmp = {
		}
		editRoleCmp.show = sinon.spy()
		instance.onEditRoleClick(editRoleCmp)
		expect(editRoleCmp.show.calledOnce).to.be.true

		let selStr = ''

		selStr = 'div.account-information .content input.display-name'
		expect(wrapper.find(selStr)).to.have.length(1)
		wrapper.find(selStr).simulate('change', {target: {value: 'some name'}})

		selStr = 'div.account-information .content input[type=\'radio\'][checked=true]'
		expect(wrapper.find(selStr)).to.have.length(1)
		wrapper.find(selStr).simulate('change', {target: {value: 'Active'}})
	})
})

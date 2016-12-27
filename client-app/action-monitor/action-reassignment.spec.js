import React from 'react'
import { shallow } from 'enzyme'

import ActionReassignment from './action-reassignment'

const reassignTask = {}

const usersData = [
	{
		displayName: 'Mike Wang',
		userID: 'JC10003',
		position: 'Trader'
	}
]
const rolesData = [
	{
		roleId: '001',
		roleName: 'Trading Solutions Analyst'
	}
]

describe('<ActionReassignment />', () => {
	it('test render', () => {
		const wrapper = shallow(<ActionReassignment task={reassignTask} users={usersData} roles={rolesData} />)
		expect(wrapper.find('div.action-reassignment')).to.have.length(1)
	})
})

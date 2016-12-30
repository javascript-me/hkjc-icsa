import React from 'react'
import { shallow } from 'enzyme'

import ActionReassignment from './action-reassignment'

const reassignTask = {taskID: 'TK1'}

const usersData = [
	{
		displayName: 'Mike Wang1',
		userID: 'JC10003',
		position: 'Trader'
	},
	{
		displayName: 'Mike Wang2',
		userID: 'JC10002',
		position: 'Trader'
	}
]
const rolesData = [
	{
		roleId: '001',
		roleName: 'Trading Solutions Analyst'
	},
	{
		roleId: '002',
		roleName: 'Trader Viewer'
	}
]

describe('<ActionReassignment />', () => {
	it('test render', () => {
		const wrapper = shallow(<ActionReassignment task={reassignTask} />)
		const instance = wrapper.instance()
		expect(wrapper.find('div.action-reassignment')).to.have.length(1)

		instance.getData()
		wrapper.setState({ usersData })
		expect(instance.state.usersData).to.have.length(2)
		wrapper.setState({ rolesData })
		expect(instance.state.rolesData).to.have.length(2)

		wrapper.find('.serch-header input').at(0).simulate('change', {target: {value: 'Mike Wang'}})
		expect(instance.state.keyword === 'Mike Wang').to.be.true

		expect(instance.state.radioValue === 0).to.be.true
		let reassignment = instance.getSelectData()
		expect(reassignment.data).to.have.length(0)

		wrapper.find('.serch-header input').at(2).simulate('change')
		expect(instance.state.radioValue === 1).to.be.true
		expect(instance.state.keyword === '').to.be.true

		reassignment = instance.getSelectData()
		expect(reassignment.data).to.have.length(0)
	})
})

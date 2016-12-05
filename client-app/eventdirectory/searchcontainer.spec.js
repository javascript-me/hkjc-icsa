import React from 'react'
import { shallow } from 'enzyme'

import SearchContainer from './searchcontainer'

describe('<SearchContainer />', () => {
	it('renders a SearchContainer div', () => {
		const service = {
			getEventDirectoryFilter () {
				return Promise.resolve({
					scenario: {
						options: ['All', 'Assigned', 'In-Play', 'Archive', 'Today', 'Pre-Event', 'Prelim', 'Defined', 'Major'],
						default: 'Assigned'
					},
					competition: {
						options: ['All', 'Premier', 'FA Cup', 'League Cup', 'Championship'],
						default: 'All'
					}
				})
			},
			getEventDirectoryResult () {
				return Promise.resolve({
					result: []
				})
			}
		}

		const wrapper = shallow(<SearchContainer type={0} />)
		const instance = wrapper.instance()

		expect(wrapper.find('div.ed-container')).to.have.length(1)
		instance.getFilter(service)
		instance.getResult(service, {})
	})
})

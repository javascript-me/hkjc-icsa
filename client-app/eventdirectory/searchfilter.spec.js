import React from 'react'
import { shallow } from 'enzyme'

import SearchFilter from './searchfilter'

describe('<SearchFilter />', () => {
	it('renders a SearchFilter form', () => {
		const filter = {
			scenario: {
				options: ['All', 'Assigned', 'In-Play', 'Archive', 'Today', 'Pre-Event', 'Prelim', 'Defined', 'Major'],
				default: 'Assigned'
			},
			competition: {
				options: ['All', 'Premier', 'FA Cup', 'League Cup', 'Championship'],
				default: 'All'
			}
		}

		const onSearch = sinon.spy();
		const searchFilter = shallow(<SearchFilter filter={filter} onSearch={onSearch} />)
		expect(searchFilter.find('div.ed-filter')).to.have.length(1)
	})
})

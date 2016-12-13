import React from 'react'
import { shallow } from 'enzyme'

import SearchFilter from './searchfilter'

describe('<SearchFilter />', () => {
	it('SearchFilter render', () => {
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

		const onSearch = sinon.spy()
		const wrapper = shallow(<SearchFilter filter={filter} onSearch={onSearch} />)
		// const instance = wrapper.instance()
		// instance.refs.search = {value: 'key'}
		// instance.refs.scenario = {value: 'Assigned'}
		// instance.refs.competition = {value: 'All'}

		expect(wrapper.find('div.ed-filter')).to.have.length(1)

		expect(wrapper.find('#ed-filter-keyword')).to.have.length(1)
		wrapper.find('#ed-filter-keyword').simulate('keyUp', {keyCode: 13})
		expect(onSearch.calledOnce).to.be.true
	})
})

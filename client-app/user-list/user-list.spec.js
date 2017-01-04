import React from 'react'
import { shallow } from 'enzyme'
import Moment from 'moment'

import UserList from './user-list'

const getOrginDateTimeFrom = UserList.__get__('getOrginDateTimeFrom')
const getOrginDateTimeTo = UserList.__get__('getOrginDateTimeTo')

describe('<UserList /> component', () => {
	describe('#removeSearchCriteriaFilter(filter)', () => {
		it('will clear state.keyword and state.selectedKeyword when filter.name equals "keyword"', () => {
			const userList = shallow(<UserList />)
			const filter = {
				name: 'keyword', value: 'keyword1'
			}

			userList.setState({
				keyword: filter.value,
				selectedKeyword: filter.value
			})
			userList.instance().removeSearchCriteriaFilter(filter)

			expect(userList.state('keyword').length).to.equal(0)
			expect(userList.state('selectedKeyword').length).to.equal(0)
		})

		it('will reset dateTimeFrom of state.selectedFilters when filter.name equals "dateTimeFrom"', () => {
			const userList = shallow(<UserList />)
			const filter = {
				name: 'dateTimeFrom', value: '05 Oct 2016 00:00'
			}
			const originDateTimeFrom = getOrginDateTimeFrom()
			let stateDateTimeFrom

			userList.setState({
				selectedFilters: [{
					name: 'dateTimeFrom',
					value: Moment(filter.value, 'DD MMM YYYY HH:mm')
				}]
			})
			userList.instance().removeSearchCriteriaFilter(filter)

			stateDateTimeFrom = userList.state('selectedFilters').filter((f) => {
				return f.name === 'dateTimeFrom'
			})[0] || {}

			expect(stateDateTimeFrom.value.isSame(originDateTimeFrom)).to.be.true
		})

		it('will reset dateTimeTo of state.selectedFilters when filter.name equals "dateTimeTo"', () => {
			const userList = shallow(<UserList />)
			const filter = {
				name: 'dateTimeTo', value: '07 Dec 2016 23:59'
			}
			const originDateTimeTo = getOrginDateTimeTo()
			let stateDateTimeTo

			userList.setState({
				selectedFilters: [{
					name: 'dateTimeTo',
					value: Moment(filter.value, 'DD MMM YYYY HH:mm')
				}]
			})
			userList.instance().removeSearchCriteriaFilter(filter)

			stateDateTimeTo = userList.state('selectedFilters').filter((f) => {
				return f.name === 'dateTimeTo'
			})[0] || {}

			expect(stateDateTimeTo.value.isSame(originDateTimeTo)).to.be.true
		})
	})
})

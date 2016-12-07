import React from 'react'
import { shallow } from 'enzyme'

import UserList from './userlist'

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
			let stateDateTimeFrom

			userList.setState({
				selectedFilters: [{
					name: 'dateTimeFrom',
					value: '05 Oct 2016 00:00'
				}]
			})
			userList.instance().removeSearchCriteriaFilter(filter)

			stateDateTimeFrom = userList.state('selectedFilters').filter((f) => {
				return f.name === 'dateTimeFrom'
			})[0] || {}

			expect(stateDateTimeFrom.value).to.equal(getOrginDateTimeFrom())
		})

		it('will reset dateTimeTo of state.selectedFilters when filter.name equals "dateTimeTo"', () => {
			const userList = shallow(<UserList />)
			const filter = {
				name: 'dateTimeTo', value: '07 Dec 2016 23:59'
			}
			let stateDateTimeTo

			userList.setState({
				selectedFilters: [{
					name: 'dateTimeTo',
					value: '07 Dec 2016 23:59'
				}]
			})
			userList.instance().removeSearchCriteriaFilter(filter)

			stateDateTimeTo = userList.state('selectedFilters').filter((f) => {
				return f.name === 'dateTimeTo'
			})[0] || {}

			expect(stateDateTimeTo.value).to.equal(getOrginDateTimeTo())
		})
	})
})

import React from 'react'
import { shallow } from 'enzyme'
import _ from 'lodash'

import Filter from './index.js'
import Container from '../add-account/index.js'
let filterData = require('../../server-simulator/API/json/baseUserProfile.json')

describe('<Filter />', () => {
	it('renders filter pannel', () => {
		const filterCmp = shallow(<Filter />)
		expect(filterCmp.find('div.body')).to.have.length(1)
	})

	it('renders header', () => {
		let HeaderCmp = Filter.__get__('TableHeader')
		const headerData = Container.__get__('header')
		const sortInfo = { index: null, sortType: null }
		const header = shallow(<HeaderCmp header={headerData} sortInfo={sortInfo} />)
		expect(header.find('th')).to.have.length(headerData.length + 1)
	})

	it('renders body', () => {
		let BodyCmp = Filter.__get__('TableRow')
		const data = filterData
		const headerData = Container.__get__('header')
		const fields = _.map(headerData, item => item.field)
		const body = shallow(<BodyCmp data={data} fields={fields} />)
		expect(body.find('tr')).to.have.length(data.length)
	})
})

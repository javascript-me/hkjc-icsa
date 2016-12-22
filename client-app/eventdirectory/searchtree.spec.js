import React from 'react'
import { shallow } from 'enzyme'

import SearchTree from './searchtree'

describe('<SearchTree />', () => {
	it('SearchTree render null', () => {
		const result = null
		const wrapper = shallow(<SearchTree result={result} />)
		expect(wrapper.find('div.ed-tree')).to.have.length(1)
	})

	it('SearchTree render []', () => {
		const result = {
			match: 'None',
			data: []
		}
		const wrapper = shallow(<SearchTree result={result} />)
		expect(wrapper.find('div.ed-tree')).to.have.length(1)
	})

	it('SearchTree render all', () => {
		const result = {
			'match': 'L1',
			'data': [
				{
					'name': 'France',
					'children': [
						{
							'name': 'Premier League',
							'records': [
								{
									'status': 'In-Play',
									't1': 'ARS',
									't1Tip': 'Arsenal',
									't2': 'ASV',
									't2Tip': 'Aston Villa',
									'active': 0
								},
								{
									'status': 'In-Play',
									't1': 'SOU',
									't1Tip': 'Southampton',
									't2': 'LIV',
									't2Tip': 'Liverpool',
									'active': 0
								}
							]
						}
					]
				}
			]
		}
		const wrapper = shallow(<SearchTree result={result} />)
		expect(wrapper.find('div.ed-tree')).to.have.length(1)
	})
})

import React from 'react'
import { shallow } from 'enzyme'

import SearchTree from './searchtree'

describe('<SearchTree />', () => {
	it('renders a SearchTree div', () => {
		const result = [
			{
				"name": "Finland",
				"children": [
					{
						"name": "Premier",
						"competitions": [
							{
								"active": 1,
								"t1": "ARS",
								"t2": "ASV"
							},
							{
								"active": 1,
								"t1": "ARS",
								"t2": "ASV"
							},
							{
								"active": 1,
								"t1": "ARS",
								"t2": "ASV"
							},
							{
								"t1": "MID",
								"t2": "NEW"
							}
						]
					}
				]
			}
		]
		const wrapper = shallow(<SearchTree result={result} />)
		expect(wrapper.find('div.ed-tree')).to.have.length(1)
	})
})

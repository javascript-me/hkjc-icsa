import React from 'react'
import { shallow } from 'enzyme'

import SearchContainer from './search-container'

const edResult = []

describe('<SearchContainer />', () => {
	it('renders a SearchContainer div', async () => {
		const wrapper = shallow(<SearchContainer type={0} />)
		const instance = wrapper.instance()

		expect(wrapper.find('div.ed-container')).to.have.length(1)
		rewireService(SearchContainer, 'EventDirectoryService', 'getEventDirectoryResult', edResult)
		await instance.getResult({})
		rewire()
		expect(instance.state.result).to.be.deep.equal(edResult)
	})
})

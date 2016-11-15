import React from 'react'
import { shallow } from 'enzyme'

import TabContent from './tabcontent'

describe('<TabContent />', () => {
	it('renders a TabContent div', () => {
		const tabContent = shallow(<TabContent />)
		expect(tabContent.find('div.ed-tabcontent')).to.have.length(1)
	})
})

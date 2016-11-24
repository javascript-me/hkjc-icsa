import React from 'react'
import { shallow } from 'enzyme'

import SubscriptionContainer from './subscriptioncontainer'

describe('<SubscriptionContainer />', () => {
	it('renders a SubscriptionContainer div', () => {
		const wrapper = shallow(<SubscriptionContainer />)
		expect(wrapper.find('div.subscription-container')).to.have.length(1)
	})
})

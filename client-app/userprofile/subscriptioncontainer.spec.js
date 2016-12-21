import React from 'react'
import { shallow } from 'enzyme'

import SubscriptionContainer from './subscriptioncontainer'

const userSubscription = [
	{
		'messageCatogory': 'Payout',
		'subscribedMessages': [
			{
				'message': 'Participant Scratch'
			},
			{
				'message': 'Concluded Event'
			}
		]
	},
	{
		'messageCatogory': 'Refund',
		'subscribedMessages': [
			{
				'message': 'Participant Scratch'
			},
			{
				'message': 'Concluded Event'
			}
		]
	}
]

describe('<SubscriptionContainer />', () => {
	it('render normal', () => {
		const wrapper = shallow(<SubscriptionContainer userSubscription={userSubscription}><div /></SubscriptionContainer>)
		expect(wrapper.find('div.subscription-container')).to.have.length(1)
	})

	it('render update', () => {
		const wrapper = shallow(<SubscriptionContainer userSubscription={userSubscription} update><div /></SubscriptionContainer>)
		expect(wrapper.find('div.subscription-container')).to.have.length(1)
	})
})

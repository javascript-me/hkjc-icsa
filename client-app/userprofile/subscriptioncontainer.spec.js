import React from 'react'
import { shallow } from 'enzyme'

import SubscriptionContainer from './subscriptioncontainer'

const userSubscription = [
	{
		'messageCatogory': 'Payout',
		'subscribedMessages': [
			{
				'subscribed': true,
				'message': 'Participant Scratch'
			},
			{
				'subscribed': false,
				'message': 'Concluded Event'
			}
		]
	},
	{
		'messageCatogory': 'Refund',
		'subscribedMessages': [
			{
				'subscribed': false,
				'message': 'Participant Scratch'
			},
			{
				'subscribed': true,
				'message': 'Concluded Event'
			}
		]
	}
]

describe('<SubscriptionContainer />', () => {
	it('render normal', () => {
		const wrapper = shallow(<SubscriptionContainer userSubscription={userSubscription}><div /></SubscriptionContainer>)
		expect(wrapper.find('div.subscription-container')).to.have.length(1)
		expect(wrapper.find('.col-category .item.changed')).to.have.length(0)
		expect(wrapper.find('.col-message .item.changed')).to.have.length(0)
	})

	it('render update', () => {
		const wrapper = shallow(<SubscriptionContainer userSubscription={userSubscription} update><div /></SubscriptionContainer>)
		const instance = wrapper.instance()

		expect(wrapper.find('div.subscription-container')).to.have.length(1)

		expect(wrapper.find('.col-category .item.changed')).to.have.length(0)
		expect(wrapper.find('.col-message .item.changed')).to.have.length(0)
		let changeData = instance.getChangedData()
		expect(changeData).to.be.null
		wrapper.find('.col-message .item .input-check').at(0).simulate('click')
		expect(wrapper.find('.col-category .item.changed')).to.have.length(1)
		expect(wrapper.find('.col-message .item.changed')).to.have.length(1)
		changeData = instance.getChangedData()
		expect(changeData).to.have.length(2)
	})
})

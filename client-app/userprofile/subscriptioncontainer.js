import React, { PropTypes } from 'react'
import classNames from 'classnames'
import _ from 'underscore'

function checkChanged (category) {
	const subscribedMessages = category.subscribedMessages
	let bRet = _.some(subscribedMessages, (message) => {
		return message.checked !== message.subscribed
	})
	return bRet
}

export default React.createClass({
	displayName: 'SubscriptionContainer',
	propTypes: {
		update: PropTypes.bool,
		userSubscription: PropTypes.array,
		children: PropTypes.any
	},
	getInitialState () {
		this.cloneData()
		return {
			curIndex: 0
		}
	},
	onClickCatogory (index) {
		this.setState({curIndex: index})
	},
	cloneData () {
		let userSubscription = this.userSubscription = _.clone(this.props.userSubscription)
		userSubscription.forEach((catogory) => {
			catogory.subscribedMessages.forEach((message) => {
				message.checked = message.subscribed
			})
		})
	},
	resetData () {
		this.cloneData()
		this.forceUpdate()
	},
	getChangedData () {
		let userSubscription = this.userSubscription

		let bChanged = false
		userSubscription.forEach((category) => {
			if (checkChanged(category)) {
				bChanged = true
			}
		})

		let results = null
		if (bChanged) {
			results = userSubscription.map((category) => {
				let cloneCategory = _.clone(category)
				cloneCategory.subscribedMessages.forEach((message) => {
					message.subscribed = message.checked
					delete message.checked
				})
				return cloneCategory
			})
		}

		return results
	},
	render () {
		let bUpdate = this.props.update
		let userSubscription = bUpdate ? this.userSubscription : this.props.userSubscription

		const profileButtons = this.props.children
		const categorys = userSubscription.map((category, index) => {
			return (
				<div key={index} className={classNames('item', {active: index === this.state.curIndex, changed: checkChanged(category)})} onClick={() => { this.onClickCatogory(index) }}>
					{category.messageCatogory}
					<i className='arrow pull-right' />
				</div>
			)
		})

		let subscribedMessages = []
		userSubscription.forEach((catogory, index) => {
			if (index === this.state.curIndex) {
				subscribedMessages = catogory.subscribedMessages
			}
		})

		let messages
		if (bUpdate) {
			messages = subscribedMessages.map((item, index) => {
				return (
					<div key={index} className={classNames('item', {changed: item.checked !== item.subscribed})}>
						<div className={classNames('input-check', {checked: item.checked})} onClick={(e) => { item.checked = !item.checked; this.forceUpdate() }} />
						{item.message}
					</div>
				)
			})
		} else {
			messages = subscribedMessages.filter(item => item.subscribed).map((item, index) => {
				return <div key={index} className='item'>{item.message}</div>
			})
		}

		return (
			<div ref='root' className='subscription-container'>
				<div className='row header'>
					<div className='col col-category'>Category</div>
					<div className='col'>Message Name</div>
				</div>
				<div className='row content'>
					<div className='col col-category'>
						{categorys}
					</div>
					<div className='col col-message'>
						{messages}
					</div>
				</div>
				<div className='row'>
					{profileButtons}
				</div>
			</div>
		)
	}
})

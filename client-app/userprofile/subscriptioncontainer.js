import React, { PropTypes } from 'react'
import classNames from 'classnames'
import _ from 'underscore'

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
		this.userSubscription = _.clone(this.props.userSubscription)
	},
	resetData () {
		this.cloneData()
		this.forceUpdate()
	},
	render () {
		let bUpdate = this.props.update
		let userSubscription = bUpdate ? this.userSubscription : this.props.userSubscription

		const profileButtons = this.props.children
		const category = userSubscription.map((item, index) => {
			return (
				<div key={index} className={classNames('item', {active: index === this.state.curIndex})} onClick={() => { this.onClickCatogory(index) }}>
					{item.messageCatogory}
					<i className='arrow pull-right' />
				</div>
			)
		})

		const subscribedMessages = userSubscription.length > 0 ? userSubscription[this.state.curIndex].subscribedMessages : []
		let messages
		if (bUpdate) {
			messages = subscribedMessages.filter(item => item.subscribed).map((item, index) => {
				return <div key={index} className='item'>{item.message}</div>
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
						{category}
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

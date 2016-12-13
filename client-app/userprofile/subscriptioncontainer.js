import React, { PropTypes } from 'react'
import classNames from 'classnames'

export default React.createClass({
	displayName: 'SubscriptionContainer',
	propTypes: {
		userSubscription: PropTypes.array,
		children: PropTypes.any
	},
	getInitialState () {
		return {
			curIndex: 0
		}
	},
	onClickCatogory (index) {
		this.setState({curIndex: index})
	},
	render () {
		const profileButtons = this.props.children
		const category = this.props.userSubscription.map((item, index) => {
			return (
				<div key={index} className={classNames('item', {active: index === this.state.curIndex})} onClick={() => { this.onClickCatogory(index) }}>
					{item.messageCatogory}
					<i className='arrow pull-right' />
				</div>
			)
		})
		const messages = this.props.userSubscription.length > 0 ? this.props.userSubscription[this.state.curIndex].subscribedMessages.map((item, index) => {
			return (
				<div key={index} className='item'>{item.message}</div>
			)
		}) : ''

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

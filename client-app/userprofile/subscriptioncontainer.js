import React, { PropTypes } from 'react'
// import classNames from 'classnames'

export default React.createClass({
	displayName: 'SubscriptionContainer',
	propTypes: {
		someProp: PropTypes.bool
	},
	render () {
		return (
			<div ref='root' className='subscription-container'>
				<div className='nopage'>Coming Soon</div>
			</div>
		)
	}
})

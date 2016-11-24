import React, { PropTypes } from 'react'
// import classNames from 'classnames'

export default React.createClass({
	displayName: 'AccountInformation',
	propTypes: {
		someProp: PropTypes.bool
	},
	getInitialState () {
		return {
		}
	},
	componentDidMount () {
	},
	render () {
		return (
			<div ref='root' className='account-information'>
				account-information
			</div>
		)
	}
})

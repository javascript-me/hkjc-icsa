import React, { PropTypes } from 'react'

export default React.createClass({
	displayName: 'ProfileButtons',
	propTypes: {
		children: PropTypes.any
	},
	getInitialState () {
		return {
		}
	},
	componentDidMount () {
	},
	render () {
		return (
			<div ref='root' className='profile-buttons'>
				{this.props.children}
			</div>
		)
	}
})

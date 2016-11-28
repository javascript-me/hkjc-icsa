import React, { PropTypes } from 'react'
// import classNames from 'classnames'

export default React.createClass({
	displayName: 'ProfileContainer',
	propTypes: {
		children: PropTypes.array.isRequired
	},
	render () {
		return (
			<div ref='root' className='profile-container'>
				<div className='row'>
					{this.props.children[0]}
					{this.props.children[1]}
				</div>
				<div className='row'>
					{this.props.children[2]}
				</div>
			</div>
		)
	}
})

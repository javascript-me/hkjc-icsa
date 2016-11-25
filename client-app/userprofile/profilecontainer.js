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
					<div className='col'>
						{this.props.children[0]}
					</div>
					<div className='col'>
						{this.props.children[1]}
					</div>
				</div>
				<div className='row'>
					<div className='col'>
						{this.props.children[2]}
					</div>
				</div>
			</div>
		)
	}
})

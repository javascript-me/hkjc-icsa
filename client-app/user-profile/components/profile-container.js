import React, { PropTypes } from 'react'
// import classNames from 'classnames'

export default React.createClass({
	displayName: 'ProfileContainer',
	propTypes: {
		children: PropTypes.array.isRequired
	},
	render () {
		const basicInformation = this.props.children[0]
		const accountInformation = this.props.children[1]
		const userDelegation = this.props.children[2]
		const profileButtons = this.props.children[3]

		return (
			<div ref='root' className='profile-container'>
				<div className='row'>
					{basicInformation}
					{accountInformation}
				</div>
				<div className='row'>
					{userDelegation}
				</div>
				<div className='row'>
					{profileButtons}
				</div>
			</div>
		)
	}
})

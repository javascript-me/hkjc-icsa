import React, { PropTypes } from 'react'
// import classNames from 'classnames'

export default React.createClass({
	displayName: 'BasicInformation',
	propTypes: {
		userBasic: PropTypes.object
	},
	render () {
		return (
			<div ref='root' className='basic-information'>
				<div className='header'>
					<h2>Basic Information</h2>
				</div>
				<div className='content'>
					<div className='row name'>
						<div className='col col-xs-3'>First Name</div>
						<div className='col col-xs-3'>Last Name</div>
						<div className='col col-xs-3'>Display Name</div>
					</div>
					<div className='row value'>
						<div className='col col-xs-3'>{this.props.userBasic.firstName}</div>
						<div className='col col-xs-3'>{this.props.userBasic.lastName}</div>
						<div className='col col-xs-3'>{this.props.userBasic.displayName}</div>
					</div>

					<div className='row name'>
						<div className='col col-xs-3'>User ID</div>
						<div className='col col-xs-3'>Staff ID</div>
						<div className='col col-xs-3'>Position / Title</div>
						<div className='col col-xs-3'>Email address</div>
					</div>
					<div className='row value'>
						<div className='col col-xs-3'>{this.props.userBasic.userID}</div>
						<div className='col col-xs-3'>{this.props.userBasic.staffID}</div>
						<div className='col col-xs-3'>{this.props.userBasic.position}</div>
						<div className='col col-xs-3'>{this.props.userBasic.emailAddress}</div>
					</div>

					<div className='row name'>
						<div className='col col-xs-3'>Phone Number</div>
						<div className='col col-xs-9'>Location</div>
					</div>
					<div className='row value margin0'>
						<div className='col col-xs-3'>{this.props.userBasic.phoneNumber}</div>
						<div className='col col-xs-9'>{this.props.userBasic.homeAddress}</div>
					</div>
				</div>
			</div>
		)
	}
})

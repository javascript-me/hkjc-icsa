import React, { PropTypes } from 'react'

export default React.createClass({
	displayName: 'BasicInformation',
	propTypes: {
		userBasic: PropTypes.object.isRequired
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
						<div className='col col-xs-3'>Position / Title</div>
						<div className='col col-xs-3'>Email Address</div>
					</div>
					<div className='row value'>
						<div className='col col-xs-3'>{this.props.userBasic.userID}</div>
						<div className='col col-xs-3'>{this.props.userBasic.position}</div>
						<div className='col col-xs-3'>{this.props.userBasic.emailAddress}</div>
					</div>

					<div className='row name'>
						<div className='col col-xs-3'>Phone No.</div>
					</div>
					<div className='row value margin0'>
						<div className='col col-xs-3'>{this.props.userBasic.phoneNumber}</div>
					</div>
				</div>
			</div>
		)
	}
})

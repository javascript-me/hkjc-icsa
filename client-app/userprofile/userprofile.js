import React, { PropTypes } from 'react'

import UserProfileService from './userprofile-service'

import ProfileTabs from './profiletabs'
import ProfileContainer from './profilecontainer'
import SubscriptionContainer from './subscriptioncontainer'
import ProfileButtons from './profilebuttons'
import BasicInformation from './basicinformation'
import AccountInformation from './accountinformation'

export {
	UserProfileService,
	ProfileTabs,
	ProfileContainer,
	SubscriptionContainer,
	ProfileButtons,
	BasicInformation,
	AccountInformation
}

export default React.createClass({
	displayName: 'UserProfile',
	propTypes: {
		params: PropTypes.any
	},
	getInitialState () {
		this.userID = this.props.params.userId
		return {
			accountUpdate: false,
			userBasic: {},
			userAccount: {}
		}
	},
	componentDidMount () {
		this.getUserProfile()
	},
	onEditClick () {
		this.setState({accountUpdate: true})
	},
	onResetClick () {
		this.refs.accountCmp.resetData()
	},
	onUpdateClick () {
		if (this.refs.accountCmp.verifyData()) {
			// console.log(this.refs.accountCmp.getData())
			// this.setState({accountUpdate: false})
		}
	},
	onCancelClick () {
		window.history.back()
	},
	render () {
		return (
			<div ref='root' className='user-profile'>
				<ProfileTabs>
					<ProfileContainer>
						<BasicInformation userBasic={this.state.userBasic} />

						<AccountInformation ref='accountCmp' userAccount={this.state.userAccount} updateMode={this.state.accountUpdate} />

						<ProfileButtons>
							{this.state.accountUpdate && (<button className='btn btn-danger' onClick={this.onResetClick}>Reset</button>)}
							{!this.state.accountUpdate && (<button className='btn btn-primary pull-right' onClick={this.onEditClick}>Edit</button>)}
							{this.state.accountUpdate && (<button className='btn btn-primary pull-right' onClick={this.onUpdateClick}>Update</button>)}
							{this.state.accountUpdate && (<button className='btn btn-cancle pull-right' onClick={this.onCancelClick}>Cancel</button>)}
						</ProfileButtons>
					</ProfileContainer>

					<SubscriptionContainer />
				</ProfileTabs>
			</div>
		)
	},
	async getUserProfile () {
		const userProfile = await UserProfileService.getUserProfile(this.userID)
		if (userProfile) {
			this.setState({
				userBasic: userProfile.user,
				userAccount: userProfile.account
			})
		}
	}
})

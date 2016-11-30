import React, { PropTypes } from 'react'
import LoginService from '../login/login-service'

import {UserProfileService, ProfileTabs, ProfileContainer, SubscriptionContainer, ProfileButtons, BasicInformation, AccountInformation} from '../userprofile/userprofile'

export default React.createClass({
	displayName: 'MyProfile',
	propTypes: {
		someProp: PropTypes.bool
	},
	getInitialState () {
		let profile = LoginService.getProfile()
		this.userID = ''
		if (profile) {
			this.userID = profile.userID
		}
		this.pageTitle = 'Home \\ Tool & Adminstration \\ User'
		this.h1Title = 'My Profile'
		if (LoginService)
		return {
			userBasic: {},
			userAccount: {}
		}
	},
	componentDidMount () {
		this.getUserProfile()
	},
	onEditClick () {
	},
	render () {
		return (
			<div ref='root' className='my-profile'>
				<ProfileTabs pageTitle={this.pageTitle} h1Title={this.h1Title}>
					<ProfileContainer>
						<BasicInformation userBasic={this.state.userBasic} />

						<AccountInformation ref='accountCmp' userAccount={this.state.userAccount} updateMode={false} showDate={false} />

						<ProfileButtons>
							<button className='btn btn-primary pull-right' onClick={this.onEditClick}>Edit</button>
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

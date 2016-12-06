import React, { PropTypes } from 'react'
import LoginService from '../login/login-service'

import {UserProfileService, ProfileTabs, ProfileContainer, SubscriptionContainer, ProfileButtons, BasicInformation, AccountInformation, UserDelegation} from '../userprofile/userprofile'

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
		this.h1Title = 'My Profile'
		return {
			userBasic: {},
			userAccount: {},
			userDelegation: []
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
				<ProfileTabs h1Title={this.h1Title}>
					<ProfileContainer>
						<BasicInformation userBasic={this.state.userBasic} />

						<AccountInformation ref='accountCmp' userAccount={this.state.userAccount} updateMode={false} showDate={false} />

						<UserDelegation userDelegation={this.state.userDelegation} />

						<ProfileButtons>
							<button className='btn btn-danger' onClick={() => {}}>Delete</button>
							<button className='btn btn-primary pull-right' onClick={() => {}}>Update</button>
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

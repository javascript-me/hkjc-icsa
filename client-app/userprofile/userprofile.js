import React from 'react'

import UserProfileService from './userprofile-service'

import ProfileTabs from './profiletabs'
import ProfileContainer from './profilecontainer'
import SubscriptionContainer from './subscriptioncontainer'
import ProfileButtons from './profilebuttons'
import BasicInformation from './basicinformation'
import AccountInformation from './accountinformation'

export default React.createClass({
	displayName: 'UserProfile',
	getInitialState () {
		return {
			userBasic: {},
			userAccount: {}
		}
	},
	componentDidMount () {
		this.getUserProfile()
	},
	render () {
		return (
			<div ref='root' className='user-profile'>
				<ProfileTabs>
					<ProfileContainer>
						<BasicInformation userBasic={this.state.userBasic} />

						<AccountInformation userAccount={this.state.userAccount} />

						<ProfileButtons>
							<button className='btn btn-primary pull-right'>Edit</button>
						</ProfileButtons>
					</ProfileContainer>

					<SubscriptionContainer />
				</ProfileTabs>
			</div>
		)
	},
	async getUserProfile () {
		const userProfile = await UserProfileService.getUserProfile()
		if (userProfile) {
			this.setState({
				userBasic: userProfile.user,
				userAccount: userProfile.account
			})
		}
	}
})

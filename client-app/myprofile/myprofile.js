import React, { PropTypes } from 'react'
import LoginService from '../login/login-service'
import {PopupService} from '../popup'
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
			delegationUpdate: false,
			userBasic: {},
			userAccount: {},
			userDelegation: null,
			userSubscription: []
		}
	},
	componentDidMount () {
		this.getUserProfile()
	},
	onEditClick () {
		this.setState({
			delegationUpdate: true
		})
	},
	async onUpdateClick (delegationCmp) {
		const result = delegationCmp.onUpdateClick()
		
		let UpdateFlag = await UserProfileService.postUserDelegation(this.userID,{delegationList:result})
		
		if (UpdateFlag.status) {
			this.getUserProfile()
			
		}
	},
	onCancelClick () {
		PopupService.showMessageBox('Are you sure want to cancel?', () => {
			this.setState({
				delegationUpdate: false
			})
		})
	},
	onDeleteClick (delegationCmp) {
		delegationCmp.onDeleteClick()
	},
	render () {
		return (
			<div ref='root' className='my-profile'>
				<ProfileTabs h1Title={this.h1Title}>
					<ProfileContainer>
						<BasicInformation userBasic={this.state.userBasic} />

						<AccountInformation userAccount={this.state.userAccount} updateMode={false} showDate={false} />

						<UserDelegation ref='delegationCmp' userDelegation={this.state.userDelegation} delegationUpdate={this.state.delegationUpdate} />

						<ProfileButtons>
							{this.state.delegationUpdate && (<button className='btn btn-danger' onClick={() => { this.onDeleteClick(this.refs.delegationCmp) }}>Delete</button>)}
							{!this.state.delegationUpdate && (<button className='btn btn-primary pull-right' onClick={this.onEditClick}>Edit</button>)}
							{this.state.delegationUpdate && (<button className='btn btn-primary pull-right' onClick={() => { this.onUpdateClick(this.refs.delegationCmp) }}>Update</button>)}
							{this.state.delegationUpdate && (<button className='btn btn-cancle pull-right' onClick={this.onCancelClick}>Cancel</button>)}
						</ProfileButtons>
					</ProfileContainer>

					<SubscriptionContainer userSubscription={this.state.userSubscription}>
						<ProfileButtons>
							<button className='btn btn-primary pull-right' onClick={() => {}}>Edit</button>
						</ProfileButtons>
					</SubscriptionContainer>
				</ProfileTabs>
			</div>
		)
	},
	async getUserProfile () {
		const userProfile = await UserProfileService.getUserProfile(this.userID)
		if (userProfile) {
			this.setState({
				userBasic: userProfile.user,
				userAccount: userProfile.account,
				userDelegation: userProfile.account.delegationList,
				userSubscription: userProfile.account.subscribedCategoryMessages
			})
		}
	}
})

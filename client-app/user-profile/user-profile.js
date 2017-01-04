import React, { PropTypes } from 'react'

import { PopupService } from '../popup'
import UserProfileService from './user-profile-service'
import {ProfileTabs, ProfileContainer, SubscriptionContainer, ProfileButtons, BasicInformation, AccountInformation, UserDelegation} from './components'

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
			userAccount: {},
			userDelegation: null,
			userSubscription: []
		}
	},
	componentDidMount () {
		this.getUserProfile()
	},
	onEditClick () {
		this.refs.accountCmp && this.refs.accountCmp.resetData()
		this.setState({accountUpdate: true})
	},
	onResetClick () {
		PopupService.showMessageBox(PopupService.resetMesg, () => {
			this.refs.accountCmp.resetData()
		})
	},
	onUpdateClick () {
		if (this.refs.accountCmp && this.refs.accountCmp.verifyData()) {
			PopupService.showMessageBox(PopupService.updateMesg, () => {
				const data = this.refs.accountCmp.getData()
				UserProfileService.updateUserProfile({
					'userID': data.userID,
					'displayName': data.displayName,
					'status': data.status,
					'assignedUserRoles': JSON.stringify(data.assignedUserRoles),
					'activationDate': data.activationDate,
					'deactivationDate': data.deactivationDate
				}).then((data) => {
					if (data) {
						this.refs.accountCmp.resetDataHighlight()
						this.getUserProfile()
					}
				})
			})
		}
	},
	onCancelClick () {
		PopupService.showMessageBox(PopupService.cancelMesg, () => {
			this.setState({accountUpdate: false})
		})
	},
	render () {
		return (
			<div ref='root' className='user-profile'>
				<ProfileTabs>
					<ProfileContainer>
						<BasicInformation userBasic={this.state.userBasic} />

						<AccountInformation ref='accountCmp' userAccount={this.state.userAccount} updateMode={this.state.accountUpdate} />

						<UserDelegation userDelegation={this.state.userDelegation} delegationUpdate={false} />

						<ProfileButtons>
							{this.state.accountUpdate && (<button className='btn btn-danger profile-btn-reset' onClick={this.onResetClick}>Reset</button>)}
							{!this.state.accountUpdate && (<button className='btn btn-primary pull-right profile-btn-edit' onClick={this.onEditClick}>Edit</button>)}
							{this.state.accountUpdate && (<button className='btn btn-primary pull-right profile-btn-update' onClick={this.onUpdateClick}>Update</button>)}
							{this.state.accountUpdate && (<button className='btn btn-cancle pull-right profile-btn-cancel' onClick={this.onCancelClick}>Cancel</button>)}
						</ProfileButtons>
					</ProfileContainer>

					<SubscriptionContainer userSubscription={this.state.userSubscription}>
						<ProfileButtons>
							<button className='btn btn-primary pull-right' onClick={() => {}}>Configure Message</button>
						</ProfileButtons>
					</SubscriptionContainer>
				</ProfileTabs>
			</div>
		)
	},
	async getUserProfile () {
		const userProfile = await UserProfileService.getUserProfile({userID: this.userID})
		if (userProfile) {
			this.setState({
				accountUpdate: false,
				userBasic: userProfile.user,
				userAccount: userProfile.account,
				userDelegation: userProfile.account.delegationList,
				userSubscription: userProfile.account.subscribedCategoryMessages
			})
		}
	}
})

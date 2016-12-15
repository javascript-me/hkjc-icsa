import React, { PropTypes } from 'react'
import LoginService from '../login/login-service'
import {PopupService} from '../popup'
import {UserProfileService, ProfileTabs, ProfileContainer, SubscriptionContainer, ProfileButtons, BasicInformation, AccountInformation, UserDelegation} from '../userprofile/userprofile'
import {campareTime} from '../userprofile/userdelegation.js'

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
		this.refs.delegationCmp.resetDelegtionData()
		this.setState({
			delegationUpdate: true
		})
	},
	async onUpdateClick (delegationCmp) {
		const result = delegationCmp.getChangeResult()
		if (!result || result.length === 0) {
			return false
		}
		let errBox = {}
		delegationCmp.checkVaild()
		result.forEach((item, index) => {
			if (!item.delegatedRoles || item.delegatedRoles.length === 0) {
				errBox.roleErr = true
				return false
			}
			if (!item.delegationTo) {
				errBox.delegationToErr = true
				return false
			}
			if (!item.delegationFrom) {
				errBox.delegationFromErr = true
				return false
			}
			if (campareTime(item.delegationFrom, item.delegationTo) > 0) {
				errBox.smallerErr = true
			}
		})
		switch (true) {
		case (errBox.roleErr) : {
			PopupService.showMessageBox('You must select a role', () => {})
			return false
		}
		case (errBox.delegationToErr) : {
			PopupService.showMessageBox('You must select  delegationTo date', () => {})
			return false
		}
		case (errBox.delegationFromErr) : {
			PopupService.showMessageBox('You must select  delegationFrom date', () => {})
			return false
		}
		case (errBox.smallerErr) : {
			PopupService.showMessageBox('delegationTo date must larger then delegationFrom date', () => {})
			return false
		}
		default : break

		}

		result && result.forEach((item) => { item.changeFlag = null })
		let UpdateFlag = await UserProfileService.postUserDelegation(this.userID, {delegationList: result})

		if (UpdateFlag.status) {
			PopupService.showMessageBox('Update sucess!', () => {
				this.getUserProfile()
			})
		} else {
			PopupService.showMessageBox('Update fail,please contact the administrator', () => {
				this.setState({
					delegationUpdate: false
				})
			})
		}
	},
	onCancelClick () {
		PopupService.showMessageBox('Are you sure you want to cancel the current operation?', () => {
			this.setState({
				delegationUpdate: false
			})
		})
	},
	onDeleteClick (delegationCmp) {
		let ids = delegationCmp.getDeleteData()
		if (ids.length > 0) {
			const result = delegationCmp.getChangeResult()
			if (!result || result.length === 0) {
				PopupService.showMessageBox('Are you sure you want to delete the information?', () => {
					this.deleteUserDelegation(ids)
				})
			} else {
				PopupService.showMessageBox('Information is updated, are you sure you want to delete the information?', () => {
					this.deleteUserDelegation(ids)
				})
			}
		} else {
			PopupService.showErrorBox('You must select at least one delegation!')
		}
	},
	deleteUserDelegation (ids) {
		UserProfileService.deleteDelegation({
			userID: this.userID,
			delegationIds: ids
		}).then((data) => {
			if (data) {
				this.getUserProfile()
			}
		})
	},
	render () {
		return (
			<div ref='root' className='my-profile'>
				<ProfileTabs h1Title={this.h1Title}>
					<ProfileContainer>
						<BasicInformation userBasic={this.state.userBasic} />

						<AccountInformation userAccount={this.state.userAccount} updateMode={false} showDate={false} />

						<UserDelegation ref='delegationCmp' userDelegation={this.state.userDelegation} delegationUpdate={this.state.delegationUpdate} myAccountProfile={this.state.userAccount} />

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
		const userProfile = await UserProfileService.getUserProfile({userID: this.userID})
		if (userProfile) {
			this.setState({
				delegationUpdate: false,
				userBasic: userProfile.user,
				userAccount: userProfile.account,
				userDelegation: userProfile.account.delegationList,
				userSubscription: userProfile.account.subscribedCategoryMessages
			})
		}
	}
})

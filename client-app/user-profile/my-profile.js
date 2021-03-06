import React from 'react'
import classNames from 'classnames'
import LoginService from '../login/login-service'
import {PopupService} from '../popup'
import UserProfileService from './user-profile-service'
import {ProfileTabs, ProfileContainer, SubscriptionContainer, ProfileButtons, BasicInformation, AccountInformation, UserDelegation} from './components'

function campareTime (v1, v2) {
	let s1 = v1.split('/')
	let s2 = v2.split('/')
	let t1 = new Date()
	let t2 = new Date()
	t1.setFullYear(s1[2], +s1[1] - 1, s1[0])
	t2.setFullYear(s2[2], +s2[1] - 1, s2[0])
	return (t1.getTime() - t2.getTime())
}

export default React.createClass({
	displayName: 'MyProfile',
	getInitialState () {
		let profile = LoginService.getProfile()
		this.userID = ''
		if (profile) {
			this.userID = profile.userID
		}
		this.h1Title = 'My Profile'
		return {
			bAdmin: false,
			subscriptionUpdate: false,
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
			PopupService.showSuggestBox('warnning', 'You must select a role', () => {})
			return false
		}
		case (errBox.delegationToErr) : {
			PopupService.showSuggestBox('warnning', 'You must select "The time of Delegation To"', () => {})
			return false
		}
		case (errBox.delegationFromErr) : {
			PopupService.showSuggestBox('warnning', 'You must select "Time of Delegation From"', () => {})
			return false
		}
		case (errBox.smallerErr) : {
			PopupService.showSuggestBox('warnning', 'The "Time of Delegation To" should not be earlier than the "Time of Delegation From"', () => {})
			return false
		}
		default : break

		}
		PopupService.showMessageBox(PopupService.updateMesg, async () => {
			result && result.forEach((item) => {
				item.changeFlag = null
				item.isNewRecord = null
			})
			let UpdateFlag = await UserProfileService.postUserDelegation(this.userID, {delegationList: result})

			if (UpdateFlag.status) {
				PopupService.showSuggestBox('success', 'The operation has been proceeded successfully!', () => {
					this.getUserProfile()
				})
			} else {
				PopupService.showSuggestBox('error', 'Update fail,please contact the administrator', () => {
					this.setState({
						delegationUpdate: false
					})
				})
			}
		})
	},
	onCancelClick () {
		PopupService.showMessageBox(PopupService.cancelMesg, () => {
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
				PopupService.showMessageBox(PopupService.deleteMesg, () => {
					this.deleteUserDelegation(ids)
				})
			} else {
				PopupService.showMessageBox('Information is updated, are you sure you want to delete the information?', () => {
					this.deleteUserDelegation(ids)
				})
			}
		} else {
			PopupService.showSuggestBox('warnning', 'You must select at least one delegation!')
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
		let showEditBtn = this.state.bAdmin && !this.state.delegationUpdate
		let scChange = this.isSubscriptionChange()
		return (
			<div ref='root' className='my-profile'>
				<ProfileTabs h1Title={this.h1Title}>
					<ProfileContainer>
						<BasicInformation userBasic={this.state.userBasic} />

						<AccountInformation userAccount={this.state.userAccount} updateMode={false} showDate={false} />

						<UserDelegation ref='delegationCmp' userDelegation={this.state.userDelegation} delegationUpdate={this.state.delegationUpdate} myAccountProfile={this.state.userAccount} />

						<ProfileButtons>
							{this.state.delegationUpdate && (<button className='btn btn-danger' onClick={() => { this.onDeleteClick(this.refs.delegationCmp) }}>Delete</button>)}
							{showEditBtn && (<button className='btn btn-primary pull-right' onClick={this.onEditClick}>Edit</button>)}
							{this.state.delegationUpdate && (<button className='btn btn-primary pull-right' onClick={() => { this.onUpdateClick(this.refs.delegationCmp) }}>Update</button>)}
							{this.state.delegationUpdate && (<button className='btn btn-cancle pull-right' onClick={this.onCancelClick}>Cancel</button>)}
						</ProfileButtons>
					</ProfileContainer>

					<SubscriptionContainer ref='subscriptionCmp' userSubscription={this.state.userSubscription} update={this.state.subscriptionUpdate} onChange={this.onSubscriptionChange}>
						<ProfileButtons>
							{!this.state.subscriptionUpdate && <button className='btn btn-primary pull-right' onClick={this.onSubscriptionEditClick}>Edit</button>}

							{this.state.subscriptionUpdate && <button className={classNames('btn btn-danger', {disabled: !scChange})} onClick={this.onSubscriptionResetClick} disabled={!scChange}>Reset</button>}
							{this.state.subscriptionUpdate && <button className={classNames('btn btn-primary pull-right', {disabled: !scChange})} onClick={this.onSubscriptionUpdateClick} disabled={!scChange}>Update</button>}
							{this.state.subscriptionUpdate && <button className='btn btn-cancle pull-right' onClick={this.onSubscriptionCancelClick}>Cancel</button>}
						</ProfileButtons>
					</SubscriptionContainer>
				</ProfileTabs>
			</div>
		)
	},
	async getUserProfile () {
		const userProfile = await UserProfileService.getUserProfile({userID: this.userID})
		if (userProfile) {
			let bAdmin = false
			userProfile.account.assignedUserRoles.forEach((item) => {
				if (item.assignedUserRole.indexOf('Administrator') > -1) {
					bAdmin = true
				}
			})
			this.setState({
				bAdmin,
				delegationUpdate: false,
				userBasic: userProfile.user,
				userAccount: userProfile.account,
				userDelegation: bAdmin ? userProfile.account.delegationList : null,
				userSubscription: userProfile.account.subscribedCategoryMessages
			})
		}
	},
	onSubscriptionEditClick () {
		this.refs.subscriptionCmp.cloneData()
		this.setState({
			subscriptionUpdate: true
		})
	},
	onSubscriptionResetClick () {
		PopupService.showMessageBox(PopupService.resetMesg, () => {
			this.refs.subscriptionCmp.resetData()
			this.forceUpdate()
		})
	},
	onSubscriptionChange () {
		this.forceUpdate()
	},
	isSubscriptionChange () {
		return this.refs.subscriptionCmp && this.refs.subscriptionCmp.IsChanged()
	},
	onSubscriptionUpdateClick () {
		let changeData = this.refs.subscriptionCmp.getChangedData()
		if (!changeData) {
			PopupService.showSuggestBox('warnning', 'Nothing changed!', () => {})
			return
		}

		PopupService.showMessageBox(PopupService.updateMesg, async () => {
			let updateResult = await UserProfileService.updateUserProfile({
				'userID': this.userID,
				'subscribedCategoryMessages': JSON.stringify(changeData)
			})
			if (!updateResult) return

			let userProfileResult = await UserProfileService.getUserProfile({
				userID: this.userID
			})
			if (!userProfileResult) return

			this.setState({
				subscriptionUpdate: false,
				userSubscription: userProfileResult.account.subscribedCategoryMessages
			})
		})
	},
	onSubscriptionCancelClick () {
		PopupService.showMessageBox(PopupService.cancelMesg, () => {
			this.setState({
				subscriptionUpdate: false
			})
		})
	}
})

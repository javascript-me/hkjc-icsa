import React, { PropTypes } from 'react'
import LoginService from '../login/login-service'

import {UserProfileService, ProfileTabs, ProfileContainer, SubscriptionContainer, ProfileButtons, BasicInformation, AccountInformation, UserDelegation} from '../userprofile/userprofile'

// products will be presented by table
var products = [{
	id: 1,
	name: 'Item name 1',
	price: 100
}, {
	id: 2,
	name: 'Item name 2',
	price: 100
}, {
	id: 3,
	name: 'Item name 2',
	price: 100
}, {
	id: 4,
	name: 'Item name 2',
	price: 100
}, {
	id: 5,
	name: 'Item name 2',
	price: 100
}, {
	id: 6,
	name: 'Item name 2',
	price: 100
}, {
	id: 7,
	name: 'Item name 2',
	price: 100
}, {
	id: 8,
	name: 'Item name 2',
	price: 100
}, {
	id: 9,
	name: 'Item name 2',
	price: 100
}, {
	id: 10,
	name: 'Item name 2',
	price: 100
}]

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
			userDelegation: null
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
	onUpdateClick (delegationCmp) {
		delegationCmp.onUpdateClick()
	},
	onCancelClick () {
		this.setState({
			delegationUpdate: false
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
				userAccount: userProfile.account,
				userDelegation: products
			})
		}
	}
})

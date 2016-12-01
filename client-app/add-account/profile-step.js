import React, {Component} from 'react'
// import { hashHistory } from 'react-router'
import PopUp from '../popup'
import Pubsub from '../pubsub'
import {
	ProfileTabs,
	ProfileContainer,
	SubscriptionContainer,
	BasicInformation,
	ProfileButtons,
	AccountInformation
} from '../userprofile/userprofile.js'
import UserStore from '../userlist/user-store'

class ProfileStep extends Component {
	constructor (props) {
		super(props)
		this.state = {
			userBasic: {},
			userAccount: this.props.userAccount
		}
		this.getUserProfile = this.getUserProfile.bind(this)
		this.onCreateClick = this.onCreateClick.bind(this)
		this.onCancel = this.onCancel.bind(this)
	}
	render () {
		return (
			<div className='step2-container'>
				<ProfileTabs>
					<ProfileContainer>
						<BasicInformation userBasic={this.props.userBasic} />

						<AccountInformation userAccount={this.props.userAccount} updateMode ref='accountCmp' />
						<ProfileButtons>
							<button className='btn btn-danger' onClick={this.onResetClick}>Reset</button>
							<button className='btn btn-primary pull-right' onClick={this.onCreateClick}>Create</button>
							<button className='btn btn-cancle pull-right' onClick={this.onCancel}>Cancel</button>
						</ProfileButtons>
					</ProfileContainer>

					<SubscriptionContainer />
				</ProfileTabs>
				<PopUp hideOnOverlayClicked ref='overlay' title='Submit for Approval' onConfirm={() => { this.onCreate() }} onCancel={() => { this.refs.overlay.hide() }}>

					<div>Are you sure you want to create a new account for {this.props.userBasic.displayName}</div>
				</PopUp>
			</div>
		)
	}
	onCreateClick () {
		this.refs.overlay.show()
	}

	onCreate () {
		let postData = {}
		let accountProfiles = Object.assign(this.refs.accountCmp.getData(), {createApprovalStatus: 1, updateApprovalStatus: 0, lastModifiedUserID: 0, id: '2055', assignedUserRoles: []})
		postData = Object.assign({}, {userBasic: this.props.userBasic}, {accountProfiles})
		$.post('./API/userprofile/add', {userData: postData})
		.then((res) => {
			if (res.status) {
				UserStore.searchAuditlogs(1, {fieldName: 'userID', order: 'DESCEND'}, null)
				this.props.setStep(0)
				Pubsub.publish(Pubsub.FliterRefreshEvent)
			} else {
				alert('add user fail')
			} })
	}
	onCancel () {
		this.props.setStep(0)
	}
	componentDidMount () {
		this.getUserProfile()
	}

	async getUserProfile () {

	}

}

ProfileStep.propTypes = {
	userBasic: React.PropTypes.object,
	userAccount: React.PropTypes.object,
	setStep: React.PropTypes.func
}
export default ProfileStep

import React, {Component} from 'react'
// import { hashHistory } from 'react-router'
import Pubsub from '../pubsub'
import {
	ProfileTabs,
	ProfileContainer,
	SubscriptionContainer,
	BasicInformation,
	ProfileButtons,
	AccountInformation
} from '../userprofile/userprofile.js'

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

			</div>
		)
	}

	onCreateClick () {
		let postData = {}
		postData = Object.assign({}, {userBasic: this.props.userBasic}, {accountProfiles: this.refs.accountCmp.getData()})
		$.post('./API/userprofile/add', {userData: postData})
		.then((res) => {
			if (res.status) {
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

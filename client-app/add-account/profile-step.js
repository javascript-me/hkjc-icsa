import React, {Component} from 'react';
import {
	UserProfileService,
	ProfileTabs,
	ProfileContainer,
	SubscriptionContainer,
	ProfileButtons,
	BasicInformation,
	AccountInformation
} from '../userprofile/userprofile.js'

class ProfileStep extends Component {
	constructor(props) {
		super(props)
		this.state = {
			userBasic: {},
			userAccount: {}
		}
		this.getUserProfile = this.getUserProfile.bind(this)
	}
	render() {
		return (
			<div>
				<ProfileTabs>
					<ProfileContainer>
						<BasicInformation userBasic={this.props.userBasic} />

						<AccountInformation userAccount={this.state.userAccount} />

						
					</ProfileContainer>

					<SubscriptionContainer />
				</ProfileTabs>
				<div className="clearfix" style={{width:'100%'}}>
					<button className='btn btn-primary pull-right'>Create</button>
					<button className='btn disabled pull-left'>Reset</button>
				</div>
			</div>
		);
	}

	componentDidMount() {
		this.getUserProfile()
	}

	async getUserProfile () {
		const userProfile = await UserProfileService.getUserProfile()
		if (userProfile) {
			this.setState({
				userAccount: userProfile.account
			})
		}
	}
	
}

export default ProfileStep;
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
			userAccount: this.props.userAccount
		}
		this.getUserProfile = this.getUserProfile.bind(this)
	}
	render() {
		return (
			<div className="step2-container">
				<ProfileTabs>
					<ProfileContainer>
						<BasicInformation userBasic={this.props.userBasic} />

						<AccountInformation userAccount={this.props.userAccount} updateMode={true}/>

						
					</ProfileContainer>

					<SubscriptionContainer />
				</ProfileTabs>
				
			</div>
		);
	}

	componentDidMount() {
		this.getUserProfile()
	}
	componentDidUpdate(prevProps, prevState) {
		
	}
	
	

	async getUserProfile () {
		
	}
	
}

export default ProfileStep;
import React from 'react'
import Popup from '../popup'
import NoticeboardPopup from '../noticeboardPopup'
import LoginService from '../login/login-service'
let isBottomDisplay = "bottom"
export default React.createClass({
	getInitialState () {
	console.log("What is this"+LoginService.getProfile().noticeboardSettings.display)
		return {
			displaySettings: LoginService.getProfile().noticeboardSettings.display,
			selectedSettings: ""
		}
	},
	openPopup () {
		//this.setState({ displaySettings: 'bottom' })// reset the display settings value
		//console.log( this.refs.noticeboardPopup);
		 this.refs.noticeboardPopup.show()
	},
	applySettings () {
		//doApplySettings(this.state.displaySettings)
		let requestData = {
			username: LoginService.getProfile().username,
			display: this.state.selectedSettings,

		}

		var self = this

		$.ajax({


			url: 'api/users/updateNoticeBoardDisplaySettings',
			data: requestData,
			type: 'POST',

			success: function (data) {
				console.log("Returned JSON=>"+data.noticeboardSettings.display);
				LoginService.updateProfile()
				isBottomDisplay = data.noticeboardSettings.display
				self.updateSett(data.noticeboardSettings.display)


				//self.noticeboardSettings = data.noticeboardSettings.display
			},
			error: function (xhr, status, error) {
			}
		})
	},
	updateSett(setting) {
		this.setState({ displaySettings: setting})
	},
	onChangeSetting (setting) {
		//console.log("Changing");
		this.setState({ selectedSettings: setting })

	},
	getClassName() {
		if(this.state.displaySettings === "bottom") {
			return "bottom-noticeboard-container"
		}
		else {
			return "right-noticeboard-container"
		}

	},

	render () {
		return (
			<div>
				<Popup hideOnOverlayClicked ref='noticeboardPopup' title='Action Panel Setting' onConfirm={this.applySettings} >
					<NoticeboardPopup onChange={this.onChangeSetting} />
				</Popup>


					<div className={this.getClassName()} >
						<div className="header-container">
							<span className="noticeboard-icon-container"><i className=""><img src='icon/noticeboard.svg' /></i></span>
							<div className="pull-right">
								<span className="noticeboard-list-container"><i className=""><img src='icon/list.svg' /></i></span>
								<span className="noticeboard-settings-container"><i className=""><img src='icon/Setting.svg' onClick={this.openPopup}/></i></span>
								{/*<Popup hideOnOverlayClicked ref='noticeboardPopup' title='Action Panel Setting' onConfirm={this.applySettings} >
								 <NoticeboardPopup onChange={this.onChangeSetting} />
								 </Popup>*/}

							</div>
						</div>
						<div className="messages-container">
						</div>
					</div>

				}

			</div>

		)

	}
})

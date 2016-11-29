import React from 'react'
import Popup from '../popup'
import NoticeboardPopup from '../notice-board-popup'
import LoginService from '../login/login-service'
export default React.createClass({
	getInitialState () {
		return {
			displaySettings: LoginService.getProfile().noticeboardSettings.display,
			selectedSettings: ''
		}
	},
	openPopup () {
		this.refs.noticeboardPopup.show()
	},
	applySettings () {
		let requestData = {
			username: LoginService.getProfile().username,
			display: this.state.selectedSettings
		}
		var self = this
		$.ajax({
			url: 'api/users/updateNoticeBoardDisplaySettings',
			data: requestData,
			type: 'POST',
			success: function (data) {
				self.updateSett(data.noticeboardSettings.display)
			},
			error: function (xhr, status, error) {
			}
		})
	},
	updateSett (setting) {
		this.setState({displaySettings: setting})
	},
	onChangeSetting (setting) {
		this.setState({selectedSettings: setting})
	},
	getClassName () {
		if (this.state.displaySettings === 'bottom') {
			return 'bottom-noticeboard-container'
		} else {
			return 'right-noticeboard-container'
		}
	},

	render () {
		return (
			<div>
				<Popup hideOnOverlayClicked ref='noticeboardPopup' title='Action Panel Setting' onConfirm={this.applySettings}>
					<NoticeboardPopup onChange={this.onChangeSetting} />
				</Popup>
				<div className={this.getClassName()}>
					<div className='header-container'>
						<span className='noticeboard-icon-container'><i className=''><img
							src='icon/noticeboard.svg' /></i></span>
						<div className='pull-right'>
							<span className='noticeboard-list-container'><i className=''><img src='icon/list.svg' /></i></span>
							<span className='noticeboard-settings-container'><i className=''><img src='icon/Setting.svg' onClick={this.openPopup} /></i></span>
						</div>
					</div>
					<div className='messages-container' />
				</div>

				}

			</div>

		)
	}
})

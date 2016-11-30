import React from 'react'
import Popup from '../popup'
import NoticeboardPopup from '../notice-board-popup'
import LoginService from '../login/login-service'
import NoticeBox from '../notice-box/notice-box'
import TabBar from '../tab-bar/tab-bar'
import NoticeBoardService from './notice-board-service'

const getAllNoticesPromise = async (username) => {
	let notices = null

	try {
		notices = await NoticeBoardService.getNotices(username)
	} catch (ex) {

	}

	return notices
}

export default React.createClass({
	getInitialState () {
		return {
			displaySettings: 'bottom',
			selectedSettings: '',

			allNoticesVisible: true,
			unreadNoticesVisible: false,

			noticeBoxData: {
				allNotices: [],
				unreadNotices: []
			},

			tabData: [
				{label: 'All', isOn: true},
				{label: 'Unread', isOn: false}
			]
		}
	},
	componentDidMount: function async () {
		let userProfile = LoginService.getProfile()
		let noticePromise = getAllNoticesPromise(userProfile.username)
		let allNotices
		let unreadNotices
		let self = this

		self.setState({
			displaySettings: userProfile.noticeboardSettings.display || 'bottom'
		})

		noticePromise.then((notices) => {
			allNotices = notices || []

			unreadNotices = allNotices.filter((notice) => {
				return notice.alert_status === 'New'
			})

			self.setState({
				noticeBoxData: {
					allNotices: allNotices,
					unreadNotices: unreadNotices
				}
			})
		})
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
				self.updateSet(data.noticeboardSettings.display)
			},
			error: function (xhr, status, error) {
			}
		})
	},
	updateSet (setting) {
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
	changeTab (key) {
		if (key === 'All') {
			this.setState({
				allNoticesVisible: true,
				unreadNoticesVisible: false
			})
		}
		if (key === 'Unread') {
			this.setState({
				allNoticesVisible: false,
				unreadNoticesVisible: true
			})
		}

		this.state.tabData.forEach((item) => {
			if (item.label === key) {
				item.isOn = true
			} else {
				item.isOn = false
			}
		})
	},

	getHeadTitle () {
		return 'Noticeboard ' + this.state.noticeBoxData.allNotices.length + '(' + this.state.noticeBoxData.unreadNotices.length + ')'
	},

	render () {
		return (
			<div>
				<Popup hideOnOverlayClicked ref='noticeboardPopup' title='Action Panel Setting' onConfirm={this.applySettings}>
					<NoticeboardPopup onChange={this.onChangeSetting} />
				</Popup>
				<div className={this.getClassName()}>
					<div className='header-container'>
						<div className='pull-right'>
							<span className='noticeboard-list-container'><i className=''><img src='icon/list.svg' /></i></span>
							<span className='noticeboard-settings-container'><i className=''><img src='icon/Setting.svg' onClick={this.openPopup} /></i></span>
							<Popup hideOnOverlayClicked ref='noticeboardPopup' title='Action Panel Setting' onConfirm={this.applySettings} >
								<NoticeboardPopup onChange={this.onChangeSetting} />
							</Popup>
						</div>
						{/* <TabBar onChangeTab={this.changeTab} tabData={this.state.tabData} /> */}
						<div className='container-title'>
							<span className='noticeboard-icon-container'><img src='icon/noticeboard.svg' /></span>
							<span className='header-title'>{this.getHeadTitle()}</span>
						</div>
					</div>
					<div className='messages-container'>
						<TabBar onChangeTab={this.changeTab} tabData={this.state.tabData} displayPosition={this.state.displaySettings} />
						<NoticeBox notices={this.state.noticeBoxData.allNotices} visible={this.state.allNoticesVisible} displayPosition={this.state.displaySettings} />
						<NoticeBox notices={this.state.noticeBoxData.unreadNotices} visible={this.state.unreadNoticesVisible} displayPosition={this.state.displaySettings} />
					</div>
				</div>
			</div>
		)
	}
})

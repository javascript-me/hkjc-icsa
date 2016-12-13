import React from 'react'
import Popup from '../../popup'
import NotificationsPopup from '../../notifications-popup'
import LoginService from '../../login/login-service'
import NoticeBox from '../../notice-box/notice-box'
import TabBar from '../../tab-bar/tab-bar'
import NotificationService from './notifications-service'
import NoticeDetail from '../../notice-detail/notice-detail'

const getAllNoticesPromise = async (username) => {
	let notices = null

	try {
		notices = await NotificationService.getNotices(username)
	} catch (ex) {

	}

	return notices
}
const updateUserNoticeBoardSettingsPromise = async (username, display) => {
	let userProfile = null

	try {
		userProfile = await LoginService.updateNoticeBoardSettings(username, display)
	} catch (ex) {

	}

	return userProfile
}

export default React.createClass({
	propTypes: {
		isSlim: React.PropTypes.bool
	},

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
			],

			detail: {
				id: '',
				message_detail: '',
				alert_status: '',
				message_category: '',
				system_distribution_time: '',
				priority: ''
			}
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
		this.refs.notificationsPopup.show()
	},
	applySettings () {
		let self = this
		let userProfile = LoginService.getProfile()
		let settingPromise = updateUserNoticeBoardSettingsPromise(userProfile.username, this.state.selectedSettings)
		let userNoticeboardSettings = null
		settingPromise.then((userProfile) => {
			userNoticeboardSettings = LoginService.getNoticeBoardSettings(userProfile)
			self.updateSet(userNoticeboardSettings.display)
		})
	},
	updateSet (setting) {
		this.setState({displaySettings: setting})
	},
	onChangeSetting (setting) {
		this.setState({selectedSettings: setting})
	},

	getClassName () {
		if (this.state.displaySettings === 'right') {
			return this.props.isSlim ? 'right-noticeboard-container top-gap' : 'right-noticeboard-container'
		} else {
			return 'bottom-noticeboard-container'
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
	clearselectedSettings () {
		this.setState({selectedSettings: ''})
	},
	getHeadTitle () {
		var criticalOrHighNotices = this.state.noticeBoxData.unreadNotices.filter((e) => {
			return e.priority === 'Critical' || e.priority === 'High'
		})
		return 'Noticeboard ' + this.state.noticeBoxData.unreadNotices.length + '(' + criticalOrHighNotices.length + ')'
	},

	openDetail (notice) {
		this.setState(
			{detail: {
				id: notice.id,
				alert_name: notice.alert_name,
				message_detail: notice.message_detail,
				alert_status: notice.alert_status,
				message_category: notice.message_category,
				system_distribution_time: notice.system_distribution_time,
				priority: notice.priority
			}})

		this.refs.detailPopup.show()
	},

	getConfirmButtonLabel (alertStatus) {
		if (alertStatus === 'New') return 'Acknowledge'
		return 'Unacknowledge'
	},

	getPriorityColor (priority) {
		if (priority === 'Critical') return '#EF0000'
		if (priority === 'High') return '#FF6320'
		if (priority === 'Medium') return '#FFA400'
		if (priority === 'Low') return '#9BC14D'
		return ''
	},

	render () {
		return (
			<div>
				<Popup hideOnOverlayClicked ref='notificationsPopup' title='Noticeboard Panel Setting' onConfirm={this.applySettings} onOverlayClicked={this.clearselectedSettings} onCancel={this.clearselectedSettings}>
					<NotificationsPopup onChange={this.onChangeSetting} />
				</Popup>

				<Popup hideOnOverlayClicked ref='detailPopup'
					title={this.state.detail.alert_name}
					showCancel={false}
					showCloseIcon
					confirmBtn={this.getConfirmButtonLabel(this.state.detail.alert_status)}
					popupDialogBorderColor={this.getPriorityColor(this.state.detail.priority)}
					headerColor={this.getPriorityColor(this.state.detail.priority)}>
					<NoticeDetail alert_status={this.state.detail.alert_status}
						message_category={this.state.detail.message_category}
						system_distribution_time={this.state.detail.system_distribution_time}
						message_detail={this.state.detail.message_detail} />
				</Popup>

				<div className={this.getClassName()}>
					<div className='header-container'>
						<div className='pull-right'>
							<span className='noticeboard-list-container'><i className=''><img src='icon/list.svg' /></i></span>
							<span className='noticeboard-settings-container'><i className=''><img src='icon/Setting.svg' onClick={this.openPopup} /></i></span>
						</div>
						<div className='container-title'>
							<span className='noticeboard-icon-container'><img src='icon/noticeboard.svg' /></span>
							<span className='header-title'>{this.getHeadTitle()}</span>
						</div>
					</div>
					<div className='messages-container'>
						<TabBar onChangeTab={this.changeTab} tabData={this.state.tabData} displayPosition={this.state.displaySettings} />
						<NoticeBox notices={this.state.noticeBoxData.allNotices} visible={this.state.allNoticesVisible} displayPosition={this.state.displaySettings} onOpenDetail={this.openDetail} />
						<NoticeBox notices={this.state.noticeBoxData.unreadNotices} visible={this.state.unreadNoticesVisible} displayPosition={this.state.displaySettings} onOpenDetail={this.openDetail} />
					</div>
				</div>
			</div>
		)
	}
})

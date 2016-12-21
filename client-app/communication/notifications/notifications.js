import React from 'react'
import Popup from '../../popup'
import NotificationsPopup from '../../notifications-popup'
import LoginService from '../../login/login-service'
import NoticeBox from '../../notice-box/notice-box'
import TabBar from '../../tab-bar/tab-bar'
import NotificationService from './notifications-service'
import NoticeDetail from '../../notice-detail/notice-detail'
import PubSub from '../../pubsub'
import ClassNames from 'classnames'

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

const updateAcknowledgeStatusById = async (username, id, command) => {
	let notices = null
	try {
		notices = await NotificationService.getNoticesAndUpdateAcknowledgeStatusById(username, id, command)
	} catch (ex) {
	}
	return notices
}

let refreshNoticesToken = null
export default React.createClass({
	propTypes: {
		isSlim: React.PropTypes.bool,
		noticeboardVisible: React.PropTypes.string,
		broadcastVisible: React.PropTypes.string,
		taskVisible: React.PropTypes.string
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

		refreshNoticesToken = PubSub.subscribe(PubSub.REFRESH_TABLENOTICES, () => {
			let userProfileData = LoginService.getProfile()
			let noticePromiseSub = getAllNoticesPromise(userProfileData.username)

			let allNoticesSub
			let unreadNoticesSub
			let _self = this

			_self.setState({
				displaySettings: userProfileData.noticeboardSettings.display || 'bottom'
			})

			noticePromiseSub.then((notices) => {
				allNoticesSub = notices || []

				unreadNoticesSub = allNoticesSub.filter((notice) => {
					return notice.alert_status === 'New'
				})

				_self.setState({
					noticeBoxData: {
						allNotices: allNoticesSub,
						unreadNotices: unreadNoticesSub
					}
				})
			})
		})
	},
	componentWillUnmount: function () {
		PubSub.unsubscribe(refreshNoticesToken)
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

	getCommunicationPanelClassName () {
		if (this.state.displaySettings === 'right') {
			return ClassNames(
				'right-communication-panel',
				this.props.isSlim ? 'top-gap' : ''
			)
		}
		return 'bottom-communication-panel'
	},

	getNoticeboardClassName () {
		if (this.state.displaySettings === 'right') {
			return ClassNames(
				'right-noticeboard-container',
				this.props.noticeboardVisible ? '' : 'hidden',
				this.props.noticeboardVisible && this.props.broadcastVisible ? 'half-height' : 'full-height',
				this.props.taskVisible ? 'right-task-panel-gap' : ''
			)
		}
		return ClassNames(
			'bottom-noticeboard-container',
			this.props.noticeboardVisible ? '' : 'hidden',
			this.props.noticeboardVisible && this.props.broadcastVisible ? 'half-width' : 'full-width'
		)
	},

	getBroadcastClassName () {
		if (this.state.displaySettings === 'right') {
			return ClassNames(
				'right-broadcast-container',
				this.props.broadcastVisible ? '' : 'hidden',
				this.props.noticeboardVisible && this.props.broadcastVisible ? 'half-height' : 'full-height',
				this.props.taskVisible ? 'right-task-panel-gap' : ''
			)
		}
		return ClassNames(
			'bottom-broadcast-container',
			this.props.broadcastVisible ? '' : 'hidden',
			this.props.noticeboardVisible && this.props.broadcastVisible ? 'half-width' : 'full-width'
		)
	},

	getTaskClassName () {
		if (this.state.displaySettings === 'right') {
			return ClassNames(
				'right-task-container',
				this.props.taskVisible ? '' : 'hidden',
				'full-height'
			)
		}
		return ClassNames(
			'bottom-task-container',
			this.props.taskVisible ? '' : 'hidden',
			'full-width'
		)
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

	getCommand (alertStatus) {
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

	doAcknowledgement (id, alertStatus) {
		let userProfile = LoginService.getProfile()
		let noticePromise = updateAcknowledgeStatusById(
			userProfile.username,
			id,
			this.getCommand(alertStatus)
		)

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

			PubSub.publish(PubSub['REFRESH_NOTICES'])
		})
	},

	render () {
		return (
			<div className='noticeboard-popup-spestyle'>
				<Popup hideOnOverlayClicked ref='notificationsPopup' title='Noticeboard Panel Setting' onConfirm={this.applySettings} onOverlayClicked={this.clearselectedSettings} onCancel={this.clearselectedSettings}>
					<NotificationsPopup onChange={this.onChangeSetting} />
				</Popup>

				<Popup hideOnOverlayClicked ref='detailPopup'
					title={this.state.detail.alert_name}
					showCancel={false}
					showCloseIcon
					confirmBtn={this.getCommand(this.state.detail.alert_status)}
					popupDialogBorderColor={this.getPriorityColor(this.state.detail.priority)}
					headerColor={this.getPriorityColor(this.state.detail.priority)}
					onConfirm={() => { this.doAcknowledgement(this.state.detail.id, this.state.detail.alert_status) }}>
					<NoticeDetail alert_status={this.state.detail.alert_status}
						message_category={this.state.detail.message_category}
						system_distribution_time={this.state.detail.system_distribution_time}
						message_detail={this.state.detail.message_detail} />
				</Popup>

				<div className={this.getCommunicationPanelClassName()}>
					<div className={this.getNoticeboardClassName()}>
						<div className='header-container'>
							<div className='pull-right'>
								<span className='noticeboard-list-container'><a href={'/#/page/noticeboard'}><img src='icon/list.svg' /></a></span>
								<span className='noticeboard-settings-container'><img src='icon/Setting.svg' onClick={this.openPopup} /></span>
							</div>
							<div className='container-title'>
								<span className='noticeboard-icon-container'><img src='icon/noticeboard.svg' /></span>
								<span className='header-title'>{this.getHeadTitle()}</span>
							</div>
						</div>
						<div className='messages-container'>
							<TabBar onChangeTab={this.changeTab} tabData={this.state.tabData} displayPosition={this.state.displaySettings} />
							<NoticeBox notices={this.state.noticeBoxData.allNotices} visible={this.state.allNoticesVisible} displayPosition={this.state.displaySettings} onOpenDetail={this.openDetail} onDoAcknowledgement={this.doAcknowledgement} />
							<NoticeBox notices={this.state.noticeBoxData.unreadNotices} visible={this.state.unreadNoticesVisible} displayPosition={this.state.displaySettings} onOpenDetail={this.openDetail} onDoAcknowledgement={this.doAcknowledgement} />
						</div>
					</div>

					<div className={this.getBroadcastClassName()}>
						<div className='header-container'>
							<div className='pull-right'>
								<span className='noticeboard-list-container'><a href={'/#/page/noticeboard'}><img src='icon/list.svg' /></a></span>
								<span className='noticeboard-settings-container'><img src='icon/Setting.svg' onClick={this.openPopup} /></span>
							</div>
							<div className='container-title'>
								<span className='noticeboard-icon-container'><img src='icon/noticeboard.svg' /></span>
								<span className='header-title'>{'Broadcast'}</span>
							</div>
						</div>
						<div className='messages-container'>
							<TabBar onChangeTab={this.changeTab} tabData={this.state.tabData} displayPosition={this.state.displaySettings} />
							<NoticeBox notices={this.state.noticeBoxData.allNotices} visible={this.state.allNoticesVisible} displayPosition={this.state.displaySettings} onOpenDetail={this.openDetail} onDoAcknowledgement={this.doAcknowledgement} />
							<NoticeBox notices={this.state.noticeBoxData.unreadNotices} visible={this.state.unreadNoticesVisible} displayPosition={this.state.displaySettings} onOpenDetail={this.openDetail} onDoAcknowledgement={this.doAcknowledgement} />
						</div>
					</div>

					<div className={this.getTaskClassName()}>
						<div className='header-container'>
							<div className='pull-right'>
								<span className='noticeboard-list-container'><a href={'/#/page/noticeboard'}><img src='icon/list.svg' /></a></span>
								<span className='noticeboard-settings-container'><img src='icon/Setting.svg' onClick={this.openPopup} /></span>
							</div>
							<div className='container-title'>
								<span className='noticeboard-icon-container'><img src='icon/noticeboard.svg' /></span>
								<span className='header-title'>{'Task'}</span>
							</div>
						</div>
						<div className='messages-container colour-container'>
							<TabBar onChangeTab={this.changeTab} tabData={this.state.tabData} displayPosition={this.state.displaySettings} />
							<NoticeBox notices={this.state.noticeBoxData.allNotices} visible={this.state.allNoticesVisible} displayPosition={this.state.displaySettings} onOpenDetail={this.openDetail} onDoAcknowledgement={this.doAcknowledgement} />
							<NoticeBox notices={this.state.noticeBoxData.unreadNotices} visible={this.state.unreadNoticesVisible} displayPosition={this.state.displaySettings} onOpenDetail={this.openDetail} onDoAcknowledgement={this.doAcknowledgement} />
						</div>
					</div>

				</div>
			</div>
		)
	}
})

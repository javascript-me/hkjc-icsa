import React from 'react'
import Popup from '../../popup'
import NotificationsPopup from '../../notifications-popup'
import LoginService from '../../login/login-service'
import NoticeBox from '../../notice-box/notice-box'
import NoticeList from '../../notice-box/noticelist'
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

const updateUserTaskSettingsPromise = async (username, display) => {
	let userProfile = null
	try {
		userProfile = await LoginService.updateTaskSettings(username, display)
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
		noticeboardVisible: React.PropTypes.bool,
		broadcastVisible: React.PropTypes.bool,
		taskVisible: React.PropTypes.bool
	},

	getInitialState () {
		let profile = LoginService.getProfile()
		this.userID = ''
		if (profile) {
			this.userID = profile.userID
		}
		return {
			displaySettings: LoginService.getNoticeBoardSettings().display,
			displaySettingsForTaskPanel: LoginService.getTaskSettings().display,
			selectedSettings: LoginService.getNoticeBoardSettings().display,
			selectedSettingsForTaskPanel: LoginService.getTaskSettings().display,
			allNoticesVisible: true,
			unreadNoticesVisible: false,
			allTasksVisible: true,
			myTasksVisible: false,

			noticeBoxData: {
				allNotices: [],
				unreadNotices: []
			},

			actionsBoxData: {
				allTasks: [],
				myTasks: []
			},

			tabData: [
				{label: 'All', isOn: true},
				{label: 'Unread', isOn: false}
			],

			tabDataActions: [
				{label: 'All Tasks', isOn: true},
				{label: 'My Tasks', isOn: false}
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

		this.getAllTasks()
	},
	componentWillUnmount: function () {
		PubSub.unsubscribe(refreshNoticesToken)
	},

	openPopup () {
		this.refs.notificationsPopup.show()
	},

	openTaskPopup () {
		this.refs.taskPopup.show()
	},

	applySettings () {
		let self = this
		let settingPromise = updateUserNoticeBoardSettingsPromise(LoginService.getProfile().username, this.state.selectedSettings)
		settingPromise.then((userProfile) => {
			let userNoticeboardSettings = LoginService.getNoticeBoardSettings(userProfile)
			self.setState({displaySettings: userNoticeboardSettings.display})
		})
	},

	applySettingsForTaskPanel () {
		let self = this
		let settingPromise = updateUserTaskSettingsPromise(LoginService.getProfile().username, this.state.selectedSettingsForTaskPanel)
		settingPromise.then((userProfile) => {
			let userTaskSettings = LoginService.getTaskSettings(userProfile)
			self.setState({displaySettingsForTaskPanel: userTaskSettings.display})
		})
	},

	onChangeSetting (setting) {
		this.setState({selectedSettings: setting})
	},

	onChangeSettingForTaskPanel (setting) {
		this.setState({selectedSettingsForTaskPanel: setting})
	},

	getVerticalTwoPanelsClassName () {
		return ClassNames(
			'vertical-two-panels',
			this.props.isSlim ? 'slim-gap' : '',
			this.props.taskVisible && this.state.displaySettingsForTaskPanel === 'bottom' ? 'bottom-single-panel-gap' : 'bottom-no-gap'
		)
	},

	getNoticeboardClassName () {
		if (this.state.displaySettings === 'right') {
			return ClassNames(
				'right-noticeboard-container',
				this.props.noticeboardVisible ? '' : 'hidden',
				this.props.noticeboardVisible && this.props.broadcastVisible ? 'half-height' : 'full-height',
				this.props.taskVisible && this.state.displaySettingsForTaskPanel === 'right' ? 'right-task-panel-gap' : ''
			)
		}
		return ClassNames(
			'bottom-noticeboard-container',
			this.props.noticeboardVisible ? '' : 'hidden',
			this.props.noticeboardVisible && this.props.broadcastVisible ? 'half-width' : 'full-width',
			this.props.taskVisible && this.state.displaySettingsForTaskPanel === 'bottom' ? 'bottom-single-panel-gap' : ''
		)
	},
	getBroadcastClassName () {
		if (this.state.displaySettings === 'right') {
			return ClassNames(
				'right-broadcast-container',
				this.props.broadcastVisible ? '' : 'hidden',
				this.props.noticeboardVisible && this.props.broadcastVisible ? 'half-height' : 'full-height',
				this.props.taskVisible && this.state.displaySettingsForTaskPanel === 'right' ? 'right-task-panel-gap' : ''
			)
		}
		return ClassNames(
			'bottom-broadcast-container',
			this.props.broadcastVisible ? '' : 'hidden',
			this.props.noticeboardVisible && this.props.broadcastVisible ? 'half-width' : 'full-width',
			this.props.noticeboardVisible && this.props.broadcastVisible ? 'left-50-percent-gap' : '',
			this.props.taskVisible && this.state.displaySettingsForTaskPanel === 'bottom' ? 'bottom-single-panel-gap' : ''
		)
	},

	getTaskClassName () {
		if (this.state.displaySettingsForTaskPanel === 'right') {
			return ClassNames(
				'right-task-container',
				this.props.taskVisible ? '' : 'hidden',
				this.props.isSlim ? 'slim-gap' : '',
				this.state.displaySettings === 'bottom' && (this.props.noticeboardVisible || this.props.broadcastVisible) ? 'bottom-single-panel-gap' : 'bottom-no-gap'
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
	changeActionsTab (key) {
		if (key === 'All Tasks') {
			this.setState({
				allTasksVisible: true,
				myTasksVisible: false
			})
		}
		if (key === 'My Tasks') {
			this.setState({
				allTasksVisible: false,
				myTasksVisible: true
			})
		}

		this.state.tabDataActions.forEach((item) => {
			if (item.label === key) {
				item.isOn = true
			} else {
				item.isOn = false
			}
		})
	},
	clearSelectedSettings () {
		this.setState({selectedSettings: ''})
	},
	clearSelectedSettingsForTaskPanel () {
		this.setState({selectedSettingsForTaskPanel: ''})
	},

	getHeadTitle () {
		var criticalOrHighNotices = this.state.noticeBoxData.unreadNotices.filter((e) => {
			return e.priority === 'Critical' || e.priority === 'High'
		})
		return 'Noticeboard ' + this.state.noticeBoxData.unreadNotices.length + '(' + criticalOrHighNotices.length + ')'
	},

	getActionsHeadTitle () {
		var criticalOrHighNotices = this.state.actionsBoxData.allTasks.filter((e) => {
			return e.priority === 'Critical' || e.priority === 'High'
		})
		return 'Actions ' + this.state.actionsBoxData.allTasks.length + '(' + criticalOrHighNotices.length + ')'
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
		let noticeboardPanel = <div className={this.getNoticeboardClassName()}>
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

		let broadcastPanel = <div className={this.getBroadcastClassName()}>
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

		let taskPanel = <div className={this.getTaskClassName()}>
			<div className='header-container'>
				<div className='pull-right'>
					<span className='noticeboard-list-container'><a href={'/#/page/noticeboard'}><img src='icon/list.svg' /></a></span>
					<span className='noticeboard-settings-container'><img src='icon/Setting.svg' onClick={this.openTaskPopup} /></span>
				</div>
				<div className='container-title'>
					<span className='noticeboard-icon-container'><img src='icon/icon-action.svg' /></span>
					<span className='header-title'>{this.getActionsHeadTitle()}</span>
				</div>
			</div>
			<div className='messages-container colour-container'>
				<TabBar onChangeTab={this.changeActionsTab} tabData={this.state.tabDataActions} displayPosition={this.state.displaySettingsForTaskPanel} />
				<NoticeList data={this.state.actionsBoxData.allTasks} visible={this.state.allTasksVisible} displayPosition={this.state.displaySettingsForTaskPanel} />
				<NoticeList data={this.state.actionsBoxData.myTasks} visible={this.state.myTasksVisible} displayPosition={this.state.displaySettingsForTaskPanel} />
			</div>
		</div>

		let complexBox =
			<div>
				<div className={this.getVerticalTwoPanelsClassName()}>
					{noticeboardPanel}
					{broadcastPanel}
				</div>
				{taskPanel}
			</div>

		let simpleBox =
			<div>
				{noticeboardPanel}
				{broadcastPanel}
				{taskPanel}
			</div>

		return (
			<div className='noticeboard-popup-style'>
				<Popup hideOnOverlayClicked ref='notificationsPopup' title='Noticeboard And Broadcast Setting' onConfirm={this.applySettings} onOverlayClicked={this.clearSelectedSettings} onCancel={this.clearSelectedSettings}>
					<NotificationsPopup setting={this.state.selectedSettings} onChange={this.onChangeSetting} />
				</Popup>

				<Popup hideOnOverlayClicked ref='taskPopup' title='Task Setting' onConfirm={this.applySettingsForTaskPanel} onOverlayClicked={this.clearSelectedSettingsForTaskPanel} onCancel={this.clearSelectedSettingsForTaskPanel}>
					<NotificationsPopup setting={this.state.selectedSettingsForTaskPanel} onChange={this.onChangeSettingForTaskPanel} />
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
				{this.state.displaySettings === 'right' ? complexBox : simpleBox}
			</div>
		)
	},
	async getAllTasks () {
		let tasks = []
		let myTasks = []
		tasks = await NotificationService.getTasks(this.userID, 'allTasks')
		myTasks = await NotificationService.getTasks(this.userID, 'myTasks')
		this.setState({
			actionsBoxData: {
				allTasks: tasks,
				myTasks: myTasks
			}
		})
	}
})

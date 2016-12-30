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
import PanelPosition from './panel-position'
import BroadcastsService from '../broadcasts/broadcasts-service'

const getNoticesPromise = async (username) => {
	let notices = null
	try {
		notices = await NotificationService.getNotices(username)
	} catch (ex) {
	}
	return notices
}
const updateNoticeboardAndBroadcastSettingPromise = async (username, position) => {
	let userProfile = null
	try {
		userProfile = await LoginService.updateNoticeboardAndBroadcastSetting(username, position)
	} catch (ex) {
	}
	return userProfile
}

const updateTaskSettingPromise = async (username, position) => {
	let userProfile = null
	try {
		userProfile = await LoginService.updateTaskSetting(username, position)
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

		let noticeboardAndBroadcastPanelPosition = LoginService.getNoticeboardAndBroadcastSetting().position || PanelPosition.BOTTOM
		let taskPanelPosition = LoginService.getTaskSetting().position || PanelPosition.BOTTOM

		return {
			noticeboardAndBroadcastPanelPosition: noticeboardAndBroadcastPanelPosition,
			taskPanelPosition: taskPanelPosition,
			selectedNoticeboardAndBroadcastPanelPosition: noticeboardAndBroadcastPanelPosition,
			selectedTaskPanelPosition: taskPanelPosition,

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
			},
			broadCastsList: []
		}
	},

	componentDidMount: function async () {
		let userProfile = LoginService.getProfile()
		let noticePromise = getNoticesPromise(userProfile.username)

		let allNotices
		let unreadNotices
		let self = this
		BroadcastsService.getBroadcasts(userProfile.username)

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
			let noticePromiseSub = getNoticesPromise(userProfileData.username)

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
		this.interval = clearInterval(this.interval)
	},

	openPopup () {
		this.refs.notificationsPopup.show()
	},

	openTaskPopup () {
		this.refs.taskPopup.show()
	},

	applySettings () {
		let self = this
		let settingPromise = updateNoticeboardAndBroadcastSettingPromise(LoginService.getProfile().username, this.state.selectedNoticeboardAndBroadcastPanelPosition)
		settingPromise.then((userProfile) => {
			let noticeboardAndBroadcastSetting = LoginService.getNoticeboardAndBroadcastSetting(userProfile)
			self.setState({noticeboardAndBroadcastPanelPosition: noticeboardAndBroadcastSetting.position})
		})
	},

	applySettingsForTaskPanel () {
		let self = this
		let settingPromise = updateTaskSettingPromise(LoginService.getProfile().username, this.state.selectedTaskPanelPosition)
		settingPromise.then((userProfile) => {
			let userTaskSettings = LoginService.getTaskSetting(userProfile)
			self.setState({taskPanelPosition: userTaskSettings.position})
		})
	},

	onChangeSetting (setting) {
		this.setState({selectedNoticeboardAndBroadcastPanelPosition: setting})
	},

	onChangeSettingForTaskPanel (setting) {
		this.setState({selectedTaskPanelPosition: setting})
	},

	getVerticalTwoPanelsClassName () {
		return ClassNames(
			'vertical-two-panels',
			this.props.isSlim ? 'slim-gap' : '',
			this.props.taskVisible && this.state.taskPanelPosition === PanelPosition.BOTTOM ? 'bottom-single-panel-gap' : 'bottom-no-gap'
		)
	},

	getNoticeboardClassName () {
		if (this.state.noticeboardAndBroadcastPanelPosition === PanelPosition.RIGHT) {
			return ClassNames(
				'right-noticeboard-container',
				this.props.noticeboardVisible ? '' : 'hidden',
				this.props.noticeboardVisible && this.props.broadcastVisible ? 'half-height' : 'full-height',
				this.props.taskVisible && this.state.taskPanelPosition === PanelPosition.RIGHT ? 'right-task-panel-gap' : ''
			)
		}
		return ClassNames(
			'bottom-noticeboard-container',
			this.props.noticeboardVisible ? '' : 'hidden',
			this.props.noticeboardVisible && this.props.broadcastVisible ? 'half-width' : 'full-width',
			this.props.taskVisible && this.state.taskPanelPosition === PanelPosition.BOTTOM ? 'bottom-single-panel-gap' : ''
		)
	},

	getBroadcastClassName () {
		if (this.state.noticeboardAndBroadcastPanelPosition === PanelPosition.RIGHT) {
			return ClassNames(
				'right-broadcast-container',
				this.props.broadcastVisible ? '' : 'hidden',
				this.props.noticeboardVisible && this.props.broadcastVisible ? 'half-height' : 'full-height',
				this.props.taskVisible && this.state.taskPanelPosition === PanelPosition.RIGHT ? 'right-task-panel-gap' : ''
			)
		}
		return ClassNames(
			'bottom-broadcast-container',
			this.props.broadcastVisible ? '' : 'hidden',
			this.props.noticeboardVisible && this.props.broadcastVisible ? 'half-width' : 'full-width',
			this.props.noticeboardVisible && this.props.broadcastVisible ? 'left-50-percent-gap' : '',
			this.props.taskVisible && this.state.taskPanelPosition === PanelPosition.BOTTOM ? 'bottom-single-panel-gap' : ''
		)
	},

	getTaskClassName () {
		if (this.state.taskPanelPosition === PanelPosition.RIGHT) {
			return ClassNames(
				'right-task-container',
				this.props.taskVisible ? '' : 'hidden',
				this.props.isSlim ? 'slim-gap' : '',
				this.state.noticeboardAndBroadcastPanelPosition === PanelPosition.BOTTOM && (this.props.noticeboardVisible || this.props.broadcastVisible)
					? 'bottom-single-panel-gap' : 'bottom-no-gap'
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

	syncNoticeboardAndBroadcastPanelPosition () {
		this.setState({selectedNoticeboardAndBroadcastPanelPosition: this.state.noticeboardAndBroadcastPanelPosition})
	},

	syncTaskPanelPosition () {
		this.setState({selectedTaskPanelPosition: this.state.taskPanelPosition})
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
		if (priority === 'Critical') return '#D3221B'
		if (priority === 'High') return '#FF433E'
		if (priority === 'Medium') return '#FF8F00'
		if (priority === 'Low') return '#85B612'
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
				<TabBar onChangeTab={this.changeTab} tabData={this.state.tabData} displayPosition={this.state.noticeboardAndBroadcastPanelPosition} />
				<NoticeBox notices={this.state.noticeBoxData.allNotices} visible={this.state.allNoticesVisible} displayPosition={this.state.noticeboardAndBroadcastPanelPosition} onOpenDetail={this.openDetail} onDoAcknowledgement={this.doAcknowledgement} />
				<NoticeBox notices={this.state.noticeBoxData.unreadNotices} visible={this.state.unreadNoticesVisible} displayPosition={this.state.noticeboardAndBroadcastPanelPosition} onOpenDetail={this.openDetail} onDoAcknowledgement={this.doAcknowledgement} />
			</div>
		</div>

		let broadcastPanel = <div className={this.getBroadcastClassName()}>
			<div className='header-container'>
				<div className='pull-right'>
					<span className='noticeboard-list-container'><a href={'/#/page/broadcast'}><img src='icon/list.svg' /></a></span>
					<span className='noticeboard-settings-container'><img src='icon/Setting.svg' onClick={this.openPopup} /></span>
				</div>
				<div className='container-title'>
					<span className='noticeboard-icon-container'><img src='icon/broadcast-off.svg' style={{'width': '16px', 'height': '16px'}} /></span>
					<span className='header-title'>{'Broadcast'}</span>
				</div>
			</div>
			<div className='messages-container broad-cast-container'>
				<NoticeBox notices={BroadcastsService.broadCastsList} visible displayPosition={this.state.noticeboardAndBroadcastPanelPosition} />
			</div>
		</div>

		let taskPanel = <div className={this.getTaskClassName()}>
			<div className='header-container'>
				<div className='pull-right'>
					<span className='noticeboard-list-container'><a href={'/#/page/actionmonitor'}><img src='icon/list.svg' /></a></span>
					<span className='noticeboard-settings-container'><img src='icon/Setting.svg' onClick={this.openTaskPopup} /></span>
				</div>
				<div className='container-title'>
					<span className='noticeboard-icon-container'><img src='icon/icon-action.svg' /></span>
					<span className='header-title'>{this.getActionsHeadTitle()}</span>
				</div>
			</div>
			<div className='messages-container colour-container'>
				<TabBar onChangeTab={this.changeActionsTab} tabData={this.state.tabDataActions} displayPosition={this.state.taskPanelPosition} />
				<NoticeList onTaskAproved={this.onTaskAproved} data={this.state.actionsBoxData.allTasks} visible={this.state.allTasksVisible} displayPosition={this.state.taskPanelPosition} />
				<NoticeList onTaskAproved={this.onTaskAproved} data={this.state.actionsBoxData.myTasks} visible={this.state.myTasksVisible} displayPosition={this.state.taskPanelPosition} />
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
				<Popup hideOnOverlayClicked ref='notificationsPopup' title='Noticeboard And Broadcast Setting' onConfirm={this.applySettings} onOverlayClicked={this.syncNoticeboardAndBroadcastPanelPosition} onCancel={this.syncNoticeboardAndBroadcastPanelPosition}>
					<NotificationsPopup setting={this.state.selectedNoticeboardAndBroadcastPanelPosition} onChangePosition={this.onChangeSetting} />
				</Popup>
				<div className='task-panel'>
					<Popup hideOnOverlayClicked ref='taskPopup' title='Task Setting' onConfirm={this.applySettingsForTaskPanel} onOverlayClicked={this.syncTaskPanelPosition} onCancel={this.syncTaskPanelPosition}>
						<NotificationsPopup setting={this.state.selectedTaskPanelPosition} onChangePosition={this.onChangeSettingForTaskPanel} />
					</Popup>
				</div>
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
				{this.state.noticeboardAndBroadcastPanelPosition === PanelPosition.RIGHT ? complexBox : simpleBox}
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
	},
	onTaskAproved (data) {
		$.post('api/actions/edit', {
			data: data
		}).then((data) => {
			if (data.status) {
				this.getAllTasks()
			}
		})
	}
})

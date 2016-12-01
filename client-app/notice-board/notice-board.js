import React from 'react'
import Popup from '../popup'
import NoticeboardPopup from '../notice-board-popup'
import LoginService from '../login/login-service'
import NoticeBox from '../notice-box/notice-box'
import TabBar from '../tab-bar/tab-bar'
import NoticeBoardService from './notice-board-service'
let latestDisplaySettings = ''
const getAllNoticesPromise = async (username) => {
	let notices = null

	try {
		notices = await NoticeBoardService.getNotices(username)
	} catch (ex) {

	}

	return notices
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
				// [
				// 	{icon: 'Critical', date: '22:32:14', title: 'title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title ', isAcknowledged: true},
				// 	{icon: 'High', date: '22:32:14', title: 'title title title title title title title title title title ', isAcknowledged: false},
				// 	{icon: 'Low', date: '22:32:14', title: 'title title title title title title title title title title ', isAcknowledged: true},
				// 	{icon: 'Critical', date: '22:32:14', title: 'title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title ', isAcknowledged: true},
				// 	{icon: 'High', date: '22:32:14', title: 'title title title title title title title title title title ', isAcknowledged: false},
				// 	{icon: 'Low', date: '22:32:14', title: 'title title title title title title title title title title ', isAcknowledged: true},
				// 	{icon: 'Critical', date: '22:32:14', title: 'title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title ', isAcknowledged: true},
				// 	{icon: 'High', date: '22:32:14', title: 'title title title title title title title title title title ', isAcknowledged: false},
				// 	{icon: 'Low', date: '22:32:14', title: 'title title title title title title title title title title ', isAcknowledged: true},
				// 	{icon: 'Critical', date: '22:32:14', title: 'title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title ', isAcknowledged: true},
				// 	{icon: 'High', date: '22:32:14', title: 'title title title title title title title title title title ', isAcknowledged: false},
				// 	{icon: 'Low', date: '22:32:14', title: 'title title title title title title title title title title ', isAcknowledged: true},
				// 	{icon: 'Critical', date: '22:32:14', title: 'title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title ', isAcknowledged: true},
				// 	{icon: 'High', date: '22:32:14', title: 'title title title title title title title title title title ', isAcknowledged: false},
				// 	{icon: 'Low', date: '22:32:14', title: 'title title title title title title title title title title ', isAcknowledged: true},
				// 	{icon: 'Critical', date: '22:32:14', title: 'title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title ', isAcknowledged: true},
				// 	{icon: 'High', date: '22:32:14', title: 'title title title title title title title title title title ', isAcknowledged: false},
				// 	{icon: 'Low', date: '22:32:14', title: 'title title title title title title title title title title ', isAcknowledged: true},
				// 	{icon: 'Medium', date: '22:32:14', title: 'title title title title title title title title title title ', isAcknowledged: true}
				// ],

				unreadNotices: []
				// [
				// 	{icon: 'Critical', date: '22:32:14', title: 'unacknowledged unacknowledged unacknowledged unacknowledged ', isAcknowledged: true},
				// 	{icon: 'Low', date: '22:32:14', title: 'unacknowledged unacknowledged unacknowledged unacknowledged ', isAcknowledged: false},
				// 	{icon: 'Medium', date: '22:32:14', title: 'unacknowledged unacknowledged unacknowledged unacknowledged ', isAcknowledged: true}
				// ]
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
		var self = this
		if (this.state.selectedSettings === '') {
			let requestData = {
				username: LoginService.getProfile().username
			}
			if (latestDisplaySettings !== self.state.displaySettings) {
				$.ajax({
					url: 'api/users/getNoticeBoardDisplaySettings',
					data: requestData,
					type: 'POST',
					success: function (data) {
						self.setState({
							selectedSettings: data.noticeboardSettings.display
						})
					},
					error: function (xhr, status, error) {
					}
				})
			}
		}
		let requestData = {
			username: LoginService.getProfile().username,
			display: this.state.selectedSettings
		}
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
		let requestData = {
			username: LoginService.getProfile().username
		}
		var self = this
		if (latestDisplaySettings !== self.state.displaySettings) {
			$.ajax({
				url: 'api/users/getNoticeBoardDisplaySettings',
				data: requestData,
				type: 'POST',
				success: function (data) {
					self.setState({ displaySettings: data.noticeboardSettings.display })
					latestDisplaySettings = data.noticeboardSettings.display
				},
				error: function (xhr, status, error) {
				}
			})
		}
		if (self.state.displaySettings === 'right') {
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

	render () {
		return (
			<div>
				<Popup hideOnOverlayClicked ref='noticeboardPopup' title='Noticeboard Panel Setting' onConfirm={this.applySettings}>
					<NoticeboardPopup onChange={this.onChangeSetting} />
				</Popup>
				<div className={this.getClassName()}>
					<div className='header-container'>
						<div className='pull-right'>
							<span className='noticeboard-list-container'><i className=''><img src='icon/list.svg' /></i></span>
							<span className='noticeboard-settings-container'><i className=''><img src='icon/Setting.svg' onClick={this.openPopup} /></i></span>
						</div>
						<div className='container-title'>
							<span className='noticeboard-icon-container'><img src='icon/noticeboard.svg' /></span>
							<span className='header-title'>Noticeboard 8(4)</span>
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

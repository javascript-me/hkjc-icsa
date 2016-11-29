import React from 'react'
import Popup from '../popup'
import NoticeboardPopup from '../notice-board-popup'
import LoginService from '../login/login-service'
import NoticeBox from '../notice-box/notice-box'
import TabBar from '../tab-bar/tab-bar'

export default React.createClass({
	getInitialState () {
		return {
			displaySettings: LoginService.getProfile().noticeboardSettings.display,
			selectedSettings: '',

			allNoticesVisible: true,
			unreadNoticesVisible: false,

			noticeBoxData: {
				allNotices: [
					{icon: 'Critical', date: '22:32:14', title: 'title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title ', isAcknowledged: true},
					{icon: 'High', date: '22:32:14', title: 'title title title title title title title title title title ', isAcknowledged: false},
					{icon: 'Low', date: '22:32:14', title: 'title title title title title title title title title title ', isAcknowledged: true},
					{icon: 'Critical', date: '22:32:14', title: 'title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title ', isAcknowledged: true},
					{icon: 'High', date: '22:32:14', title: 'title title title title title title title title title title ', isAcknowledged: false},
					{icon: 'Low', date: '22:32:14', title: 'title title title title title title title title title title ', isAcknowledged: true},
					{icon: 'Critical', date: '22:32:14', title: 'title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title ', isAcknowledged: true},
					{icon: 'High', date: '22:32:14', title: 'title title title title title title title title title title ', isAcknowledged: false},
					{icon: 'Low', date: '22:32:14', title: 'title title title title title title title title title title ', isAcknowledged: true},
					{icon: 'Critical', date: '22:32:14', title: 'title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title ', isAcknowledged: true},
					{icon: 'High', date: '22:32:14', title: 'title title title title title title title title title title ', isAcknowledged: false},
					{icon: 'Low', date: '22:32:14', title: 'title title title title title title title title title title ', isAcknowledged: true},
					{icon: 'Critical', date: '22:32:14', title: 'title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title ', isAcknowledged: true},
					{icon: 'High', date: '22:32:14', title: 'title title title title title title title title title title ', isAcknowledged: false},
					{icon: 'Low', date: '22:32:14', title: 'title title title title title title title title title title ', isAcknowledged: true},
					{icon: 'Critical', date: '22:32:14', title: 'title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title title ', isAcknowledged: true},
					{icon: 'High', date: '22:32:14', title: 'title title title title title title title title title title ', isAcknowledged: false},
					{icon: 'Low', date: '22:32:14', title: 'title title title title title title title title title title ', isAcknowledged: true},
					{icon: 'Medium', date: '22:32:14', title: 'title title title title title title title title title title ', isAcknowledged: true}
				],

				unreadNotices: [
					{icon: 'Critical', date: '22:32:14', title: 'unacknowledged unacknowledged unacknowledged unacknowledged ', isAcknowledged: true},
					{icon: 'Low', date: '22:32:14', title: 'unacknowledged unacknowledged unacknowledged unacknowledged ', isAcknowledged: false},
					{icon: 'Medium', date: '22:32:14', title: 'unacknowledged unacknowledged unacknowledged unacknowledged ', isAcknowledged: true}
				]
			},

			tabData: [
				{label: 'All', isOn: true},
				{label: 'Unread', isOn: false}
			]
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
		let requestData = {
			username: LoginService.getProfile().username
		}
		var self = this
		$.ajax({
			url: 'api/users/getNoticeBoardDisplaySettings',
			data: requestData,
			type: 'POST',
			success: function (data) {
				self.setState({ displaySettings: data.noticeboardSettings.display })
			},
			error: function (xhr, status, error) {
			}
		})
		if (self.state.displaySettings === 'bottom') {
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
						<TabBar onChangeTab={this.changeTab} tabData={this.state.tabData} />
						<div className='container-title'>
							<span className='noticeboard-icon-container'><img src='icon/noticeboard.svg' /></span>
							<span className='header-title'>Noticeboard 8(4)</span>
						</div>
					</div>
					<div className='messages-container'>
						<NoticeBox notices={this.state.noticeBoxData.allNotices} visible={this.state.allNoticesVisible} />
						<NoticeBox notices={this.state.noticeBoxData.unreadNotices} visible={this.state.unreadNoticesVisible} />
					</div>
				</div>

				}

			</div>

		)
	}
})

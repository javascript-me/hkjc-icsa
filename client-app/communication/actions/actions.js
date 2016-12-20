import React from 'react'

export default React.createClass({
	propTypes: {
		sample: React.PropTypes.bool
	},

	getInitialState () {
		return {
			displaySettings: 'bottom',
			selectedSettings: ''
		}
	},
	componentDidMount: function async () {
	},
	render () {
		return (
			<div className='container-actions'>
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

					<div className={this.getClassName()}>
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
				</div>
			</div>
		)
	}
})

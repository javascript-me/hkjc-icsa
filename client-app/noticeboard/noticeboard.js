import React from 'react'
import Popup from '../popup'
import NoticeboardPopup from '../noticeboardPopup'
let isBottomDisplay = false

export default React.createClass({
	openPopup () {
		this.setState({ displaySettings: 'bottom' })// reset the display settings value
		console.log( this.refs.noticeboardPopup);
		 this.refs.noticeboardPopup.show()
	},
	applySettings () {
		//doApplySettings(this.state.displaySettings)
	},
	onChangeSetting (setting) {
		console.log(setting);
		this.setState({ displaySettings: setting })
	},

	render () {
		if (this.props.isBottomDisplay) {
			return 	<div className="bottom-noticeboard-container">
				<div className="header-container">
					<span className="noticeboard-icon-container"><i className=""><img src='icon/noticeboard.svg' /></i></span>
					<div className="pull-right">
						<span className="noticeboard-list-container"><i className=""><img src='icon/list.svg' /></i></span>
						<span className="noticeboard-settings-container"><i className=""><img src='icon/Setting.svg' onClick={this.openPopup}/></i></span>
						<Popup hideOnOverlayClicked ref='noticeboardPopup' title='Action Panel Setting' onConfirm={this.applySettings} >
							<NoticeboardPopup onChange={this.onChangeSetting} />
						</Popup>
					</div>
				</div>
				<div className="messages-container">
				</div>
			</div>
		}
		return 	<div className="right-noticeboard-container">
			<div className="header-container">
				<span className="noticeboard-icon-container"><i className=""><img src='icon/noticeboard.svg' /></i></span>
				<div className="pull-right">
					<span className="noticeboard-list-container"><i className=""><img src='icon/list.svg' /></i></span>
					<span className="noticeboard-settings-container"><i className=""><img src='icon/Setting.svg' /></i></span>

				</div>
			</div>
			<div className="messages-container">
			</div>
		</div>

	}
})

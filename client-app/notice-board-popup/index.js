import React from 'react'
import LoginService from '../login/login-service'

const settings = { BOTTOM: 'bottom', RIGHT: 'right' }
export default React.createClass({
	displayName: 'NoticeboardPopup',
	propTypes: {
		onChange: React.PropTypes.func
	},
	getInitialState () {
		let userNoticeboardSettings = LoginService.getNoticeBoardSettings()
		
		return { setting: userNoticeboardSettings.display || 'bottom' }
	},
	onSettingChange (e) {},
	changeSetting (e) {
		this.setState({ setting: e.currentTarget.attributes['value'].nodeValue })
		if (this.props.onChange) {
			this.props.onChange(e.currentTarget.attributes['value'].nodeValue)
		}
	},
	render () {
		return (
			<div className='noticeboard-content'>
				<div className='panel-position-header setting-label'>Panel Position</div>
				<div className='pull-left bottom-radio-container'>
					<span className='radio-inline' onClick={this.changeSetting} value={settings.BOTTOM}>
						<input id='bottom' name='setting' type='radio' value={settings.BOTTOM} checked={this.state.setting === settings.BOTTOM} />
						Bottom
					</span>
					<div className='style-div'>
						<div className='bordered-div'>
							<div className='pull-left' />
							<div className='pull-right' />
						</div>
					</div>
				</div>
				<div className='pull-right right-radio-container'>
					<span className='radio-inline' onClick={this.changeSetting} value={settings.RIGHT}>
						<input id='righ' name='setting' type='radio' value={settings.RIGHT} checked={this.state.setting === settings.RIGHT} />
						Right
					</span>
					<div className='style-div'>
						<div className='bordered-div'>
							<div>
								<span className='pull-right top-gap' />
							</div>
							<div>
								<span className='pull-right top-gap' />
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
})


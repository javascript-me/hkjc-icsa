import React from 'react'

const settings = { BOTTOM: 'bottom', RIGHT: 'right' }

export default React.createClass({
	displayName: 'NoticeboardPopup',
	propTypes: {
		onChange: React.PropTypes.func
	},
	getInitialState () {
		return { setting: settings.BOTTOM }
	},
	onSettingChange (e) {

	},
	changeSetting (e) {
		this.setState({ setting: e.currentTarget.attributes['value'].nodeValue })

		if (this.props.onChange) {
			this.props.onChange(e.currentTarget.attributes['value'].nodeValue)
		}
	},
	render () {
		return (
			<div className='form-group noticeboard-content'>
				<span className='setting-label'>Settings:</span>
				<span className='radio-inline' onClick={this.changeSetting} value={settings.BOTTOM}>
					<input id='bottom' name='setting' type='radio' value={settings.BOTTOM} checked={this.state.setting === settings.BOTTOM} />
					Bottom Display
				</span>
				<span className='radio-inline' onClick={this.changeSetting} value={settings.RIGHT}>
					<input id='righ' name='setting' type='radio' value={settings.RIGHT} checked={this.state.setting === settings.RIGHT} />
					Right Display
				</span>
			</div>
				)
	}
})


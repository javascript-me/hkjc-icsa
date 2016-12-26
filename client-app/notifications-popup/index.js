import React from 'react'
import PanelPosition from '../communication/notifications/panel-position'

export default React.createClass({

	propTypes: {
		onChangePosition: React.PropTypes.func,
		setting: React.PropTypes.string
	},

	changePosition (e) {
		if (this.props.onChangePosition) {
			this.props.onChangePosition(e.currentTarget.attributes['value'].nodeValue)
		}
	},

	render () {
		return (
			<div className='noticeboard-content'>
				<div className='panel-position-header setting-label'>Panel Position</div>
				<div className='pull-left bottom-radio-container'>
					<span className='radio-inline' onClick={this.changePosition} value={PanelPosition.BOTTOM}>
						<input id='bottom' name='setting' type='radio' value={PanelPosition.BOTTOM} readOnly='readOnly' checked={this.props.setting === PanelPosition.BOTTOM} />
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
					<span className='radio-inline' onClick={this.changePosition} value={PanelPosition.RIGHT}>
						<input id='righ' name='setting' type='radio' value={PanelPosition.RIGHT} readOnly='readOnly' checked={this.props.setting === PanelPosition.RIGHT} />
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


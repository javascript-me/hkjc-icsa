import React from 'react'

const positions = { BOTTOM: 'bottom', RIGHT: 'right' }

export default React.createClass({

	propTypes: {
		onChange: React.PropTypes.func,
		setting: React.PropTypes.string
	},

	changeSetting (e) {
		if (this.props.onChange) {
			this.props.onChange(e.currentTarget.attributes['value'].nodeValue)
		}
	},

	render () {
		return (
			<div className='noticeboard-content'>
				<div className='panel-position-header setting-label'>Panel Position</div>
				<div className='pull-left bottom-radio-container'>
					<span className='radio-inline' onClick={this.changeSetting} value={positions.BOTTOM}>
						<input id='bottom' name='setting' type='radio' value={positions.BOTTOM} checked={this.props.setting === positions.BOTTOM} />
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
					<span className='radio-inline' onClick={this.changeSetting} value={positions.RIGHT}>
						<input id='righ' name='setting' type='radio' value={positions.RIGHT} checked={this.props.setting === positions.RIGHT} />
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


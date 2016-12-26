import React from 'react'

export default React.createClass({
	displayName: 'ContigencyPopup',
	propTypes: {
		popupParagraph1: React.PropTypes.string,
		popupParagraph2: React.PropTypes.string
	},
	render () {
		return (
			<div className='form-group contigency-content'>
				<div className='col-md-12'>
					<span className='warning-container-icon'><img src='icon/warning.svg' /></span>
					<p className='message1'>Are you sure you want to</p>
					<p className='message2'>{this.props.popupParagraph1}?</p>
					<p className='message3'>{this.props.popupParagraph2}</p>
				</div>
			</div>
		)
	}
})


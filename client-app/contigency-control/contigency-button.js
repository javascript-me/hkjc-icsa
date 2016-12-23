import React from 'react'

export default React.createClass({
	render () {
		return (
			<div className='container-contigency-button'>
				<div className='primary-button' style={{
					width: this.props.width,
					height: this.props.height,
					background: this.props.background
				}}>
					<span className='text-button' style={{
						'font-size': this.props.topLabelStyle,
						'line-height': this.props.topLabelLineHeight
					}}>{this.props.topText}</span>
					<span className='text-button' style={{
						'font-size': this.props.topLabelStyle,
						'line-height': this.props.topLabelLineHeight
					}}>{this.props.middleText}</span>
					<span className='text-button fade-text' style={{
						'font-size': this.props.bottomLabelStyle,
						'line-height': this.props.bottomLabelLineHeight
					}}>{this.props.bottomText}</span>
				</div>
			</div>
		)
	},
	propTypes: {
		topLabelStyle: React.PropTypes.string,
		bottomLabelStyle: React.PropTypes.string,
		topLabelLineHeight: React.PropTypes.string,
		bottomLabelLineHeight: React.PropTypes.string,
		width: React.PropTypes.string,
		height: React.PropTypes.string,
		topText: React.PropTypes.string,
		middleText: React.PropTypes.string,
		bottomText: React.PropTypes.string,
		topTextClass: React.PropTypes.string,
		middleTextClass: React.PropTypes.string,
		bottomTextClass: React.PropTypes.string,
		background: React.PropTypes.string
	}
})

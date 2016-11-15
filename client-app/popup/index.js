import React from 'react'

const isOpening = (s1, s2) => !s1.isVisible && s2.isVisible
const isClosing = (s1, s2) => s1.isVisible && !s2.isVisible

export default class Popup extends React.Component {

	constructor (props) {
		super(props)
		this.state = { isVisible: false }
	}

	componentWillUpdate (nextProps, nextState) {
		if (isOpening(this.state, nextState) && this.props.beforeOpen) {
			this.props.beforeOpen()
		}

		if (isClosing(this.state, nextState) && this.props.beforeClose) {
			this.props.beforeClose()
		}
	}

	componentDidUpdate (prevProps, prevState) {
		if (isOpening(prevState, this.state) && this.props.afterOpen) {
			this.props.afterOpen()
		}

		if (isClosing(prevState, this.state) && this.props.afterClose) {
			this.props.afterClose()
		}
	}

	show () {
		this.setState({ isVisible: true })
	}

	hide () {
		this.setState({ isVisible: false })
	}

	onOverlayClicked () {
		if (this.props.hideOnOverlayClicked) {
			this.hide()
		}

		if (this.props.onOverlayClicked) {
			this.props.onOverlayClicked()
		}
	}

	onConfirm () {
		this.hide()

		if (this.props.onConfirm) {
			this.props.onConfirm()
		}
	}

	onCancel () {
		this.hide()

		if (this.props.onCancel) {
			this.props.onCancel()
		}
	}

	render () {
		let overlay, footer
		if (this.props.showOverlay) {
			overlay = (<div className='popup-overlay' onClick={() => this.onOverlayClicked()} />)
		}
		if (this.props.showFooter) {
			footer = (<div className='panel-footer' />)
		}

		return this.state.isVisible ? (
			<section className='popup-wrapper'>
				{overlay}
				<div className='popup-dialog panel'>
					<div className='panel-heading'>
						<h1 className='title'>{this.props.title}</h1>
					</div>
					<div className='panel-body'>
						<div className='row'>
							<div className='popup-content'>{this.props.children}</div>
							<div className='popup-actions'>
								<a role='button' className='pull-right btn popup-button confirm' onClick={() => this.onConfirm()}> Confirm </a>
								<a role='button' className='pull-right btn popup-button cancel' onClick={() => this.onCancel()}> Cancel </a>
							</div>
						</div>
					</div>
					{footer}
				</div>
			</section>
		) : <div />
	}
}

Popup.displayName = 'Popup'

Popup.sharedPropTypes = {
	onCancel: React.PropTypes.func,
	onConfirm: React.PropTypes.func,
	onOverlayClicked: React.PropTypes.func,
	showOverlay: React.PropTypes.bool,
	title: React.PropTypes.string
}

Popup.propTypes = {
	...Popup.sharedPropTypes,
	afterClose: React.PropTypes.func,
	afterOpen: React.PropTypes.func,
	beforeClose: React.PropTypes.func,
	beforeOpen: React.PropTypes.func,
	hideOnOverlayClicked: React.PropTypes.bool,
	isVisible: React.PropTypes.bool
}

Popup.defaultProps = {
	title: '',
	showOverlay: true,
	hideOnOverlayClicked: false
}

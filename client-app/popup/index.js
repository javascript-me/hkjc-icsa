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

	onOther () {
		this.hide()

		if (this.props.onOther) {
			this.props.onOther()
		}
	}

	getHeaderStyles () {
		return {
			background: this.props.headerColor || '#305091'
		}
	}

	getPopupDialogStyle () {
		return {
			borderColor: this.props.popupDialogBorderColor || '#ACB8D1'
		}
	}

	render () {
		let overlay, footer, other, confirm, cancel, closeIcon
		if (this.props.showOverlay) {
			overlay = (<div className='popup-overlay' onClick={() => this.onOverlayClicked()} />)
		}
		if (this.props.showFooter) {
			footer = (<div className='panel-footer' />)
		}
		if (this.props.showOther) {
			other = (<a role='button' className='pull-left btn popup-button other' onClick={() => this.onOther()}>{this.props.otherBtn}</a>)
		}
		if (this.props.showConfirm) {
			confirm = (<a role='button' className='pull-right btn popup-button confirm' onClick={() => this.onConfirm()}> {this.props.confirmBtn} </a>)
		}
		if (this.props.showCancel) {
			cancel = (<a role='button' className='pull-right btn popup-button cancel' onClick={() => this.onCancel()}> {this.props.cancelBtn} </a>)
		}
		if (this.props.showCloseIcon) {
			closeIcon = (<span className='close-icon-span'><img className='close-icon' src={'common/close-cross.svg'} onClick={() => this.onCancel()} /></span>)
		}

		return this.state.isVisible ? (
			<section className='popup-wrapper'>
				<div className='popup-wrapper-inner'>
					{overlay}
					<div className='popup-dialog panel' style={this.getPopupDialogStyle()}>
						<div className='panel-heading' style={this.getHeaderStyles()}>
							{closeIcon}
							<h1 className='title'>{this.props.title}</h1>
						</div>
						<div className='panel-body'>
							<div className='row'>
								<div className='popup-content'>{this.props.children}</div>
								<div className='popup-actions'>
									{other}
									{confirm}
									{cancel}
								</div>
							</div>
						</div>
						{footer}
					</div>
				</div>
			</section>
		) : <div />
	}
}

Popup.displayName = 'Popup'

Popup.sharedPropTypes = {
	onCancel: React.PropTypes.func,
	onConfirm: React.PropTypes.func,
	onOther: React.PropTypes.func,
	onOverlayClicked: React.PropTypes.func,
	showOverlay: React.PropTypes.bool,
	showConfirm: React.PropTypes.bool,
	showCancel: React.PropTypes.bool,
	title: React.PropTypes.string,
	confirmBtn: React.PropTypes.string,
	cancelBtn: React.PropTypes.string,
	otherBtn: React.PropTypes.string,
	headerColor: React.PropTypes.string,
	popupDialogBorderColor: React.PropTypes.string
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
	confirmBtn: 'Confirm',
	cancelBtn: 'Cancel',
	showOverlay: true,
	showConfirm: true,
	showCancel: true,
	showCloseIcon: false,
	hideOnOverlayClicked: false
}

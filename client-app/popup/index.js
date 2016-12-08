import React from 'react'

import PopupService from './popup-service'

export {
	PopupService
}

const isOpening = (s1, s2) => !s1.isVisible && s2.isVisible
const isClosing = (s1, s2) => s1.isVisible && !s2.isVisible

export default class Popup extends React.Component {

	constructor (props) {
		super(props)
		this.custom = {}
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

	setCustom (custom) {
		this.custom = custom
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
		} else if (this.custom.onConfirm) {
			this.custom.onConfirm()
		}
	}

	onCancel () {
		this.hide()

		if (this.props.onCancel) {
			this.props.onCancel()
		} else if (this.custom.onCancel) {
			this.custom.onCancel()
		}
	}

	onOther () {
		this.hide()

		if (this.props.onOther) {
			this.props.onOther()
		}
	}

	render () {
		let overlay, footer, other, confirm, cancel

		let confirmBtn = this.custom.confirmBtn ? this.custom.confirmBtn : this.props.confirmBtn
		let cancelBtn = this.custom.cancelBtn ? this.custom.cancelBtn : this.props.cancelBtn

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
			confirm = (<a role='button' className='pull-right btn popup-button confirm' onClick={() => this.onConfirm()}> {confirmBtn} </a>)
		}
		if (this.props.showCancel) {
			cancel = (<a role='button' className='pull-right btn popup-button cancel' onClick={() => this.onCancel()}> {cancelBtn} </a>)
		}

		let title = this.props.title ? this.props.title : this.custom.title
		let children = this.props.children ? this.props.children : this.custom.children

		return this.state.isVisible ? (
			<section className='popup-wrapper'>
				{overlay}
				<div className='popup-dialog panel'>
					<div className='panel-heading'>
						<h1 className='title'>{title}</h1>
					</div>
					<div className='panel-body'>
						<div className='row'>
							<div className='popup-content'>
								{children}
							</div>
							<div className='popup-actions'>
								{other}
								{confirm}
								{cancel}
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
	onOther: React.PropTypes.func,
	onOverlayClicked: React.PropTypes.func,
	showOverlay: React.PropTypes.bool,
	showConfirm: React.PropTypes.bool,
	showCancel: React.PropTypes.bool,
	title: React.PropTypes.string,
	confirmBtn: React.PropTypes.string,
	cancelBtn: React.PropTypes.string,
	otherBtn: React.PropTypes.string

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
	hideOnOverlayClicked: false
}

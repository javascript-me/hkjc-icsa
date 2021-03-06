import React from 'react'
import classnames from 'classnames'
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
		// if (this.props.hideOnOverlayClicked) {
		// 	this.hide()
		// }

		// if (this.props.onOverlayClicked) {
		// 	this.props.onOverlayClicked()
		// }

		this.onCancel()
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

	onSecondFunc () {
		this.hide()

		if (this.props.onSecondFunc) {
			this.props.onSecondFunc()
		} else if (this.custom.onSecondFunc) {
			this.custom.onSecondFunc()
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
		let overlay, footer, other, confirm, cancel, secondFunc, closeIcon

		let confirmBtn = this.custom.confirmBtn ? this.custom.confirmBtn : this.props.confirmBtn
		let cancelBtn = this.custom.cancelBtn ? this.custom.cancelBtn : this.props.cancelBtn
		let showCancel = this.custom.showCancel !== undefined ? this.custom.showCancel : this.props.showCancel
		let secondFuncBtn = this.custom.secondFuncBtn ? this.custom.secondFuncBtn : this.props.secondFuncBtn

		if (this.props.showOverlay) {
			overlay = (<div className='popup-overlay' onClick={() => this.onOverlayClicked()} />)
		}
		if (this.props.showFooter) {
			footer = (<div className='panel-footer' />)
		}
		if (this.props.showOther) {
			other = (<a role='button' className={classnames('pull-left', 'btn', 'popup-button', 'other', {disabled: this.props.otherBtnDisabled})} onClick={() => !this.props.otherBtnDisabled && this.onOther()}>{this.props.otherBtn}</a>)
		}
		if (this.props.showConfirm) {
			confirm = (<a role='button' className={classnames('pull-right', 'btn', 'popup-button', 'confirm', {disabled: this.props.confirmBtnDisabled})} onClick={() => !this.props.confirmBtnDisabled && this.onConfirm()}> {confirmBtn} </a>)
		}
		if (this.props.showSecondFunc) {
			secondFunc = (<a role='button' className={classnames('pull-right', 'btn', 'popup-button', 'confirm', {disabled: this.props.secondFuncBtnDisabled})} onClick={() => !this.props.secondFuncBtnDisabled && this.onSecondFunc()}> {secondFuncBtn} </a>)
		}
		if (showCancel) {
			cancel = (<a role='button' className={classnames('pull-right', 'btn', 'popup-button', 'cancel', {disabled: this.props.cancelBtnDisabled})} onClick={() => !this.props.cancelBtnDisabled && this.onCancel()}> {cancelBtn} </a>)
		}
		if (this.props.showCloseIcon) {
			closeIcon = (<span className='close-icon-span'><img className='close-icon' src={'common/close-cross.svg'} onClick={() => this.onCancel()} /></span>)
		}

		let title = this.props.title ? this.props.title : this.custom.title
		let children = this.props.children ? this.props.children : this.custom.children

		return this.state.isVisible ? (
			<section className='popup-wrapper'>
				<div className='popup-wrapper-inner'>
					{overlay}
					<div className='popup-dialog panel' style={this.getPopupDialogStyle()}>
						<div className='panel-heading' style={this.getHeaderStyles()}>
							{closeIcon}
							<h1 className='title'>{title}</h1>
						</div>
						<div className='panel-body'>
							<div className='row'>
								<div className='popup-content'>{children}</div>
								<div className='popup-actions'>
									{other}
									{confirm}
									{secondFunc}
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
	onSecondFunc: React.PropTypes.func,
	onOverlayClicked: React.PropTypes.func,
	showOverlay: React.PropTypes.bool,
	showConfirm: React.PropTypes.bool,
	showCancel: React.PropTypes.bool,
	showsecondFunc: React.PropTypes.bool,
	otherBtnDisabled: React.PropTypes.bool,
	cancelBtnDisabled: React.PropTypes.bool,
	confirmBtnDisabled: React.PropTypes.bool,
	secondFuncBtnDisabled: React.PropTypes.bool,
	title: React.PropTypes.string,
	confirmBtn: React.PropTypes.string,
	cancelBtn: React.PropTypes.string,
	otherBtn: React.PropTypes.string,
	secondFuncBtn: React.PropTypes.string,
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

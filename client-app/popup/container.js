import React from 'react'
import styles from './styles'

const isOpening = (s1, s2) => !s1.isVisible && s2.isVisible
const isClosing = (s1, s2) => s1.isVisible && !s2.isVisible

export default class Container extends React.Component {

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

	onCloseClicked () {
		if (this.props.onCloseClicked) {
			this.hide()
		}

		if (this.props.onCloseClicked) {
			this.props.onCloseClicked()
		}
	}

	render () {
		const assing = (target, ...args) => {
			if (target === null) {
				throw new TypeError('Cannot convert undefined or null to object')
			}

			const newTarget = target
			for (let index = 0; index < args.length; index++) {
				const source = args[index]
				if (source !== null) {
					for (const key in source) {
						if (Object.prototype.hasOwnProperty.call(source, key)) {
							newTarget[key] = source[key]
						}
					}
				}
			}
			return newTarget
		}

		const mergeStyles = key => assing({}, styles[key], this.props[key])
		const { isVisible } = this.props
		const dialogStyles = mergeStyles('dialogStyles')
		const overlayStyles = mergeStyles('overlayStyles')
		const closeButtonStyle = mergeStyles('closeButtonStyle')
		const titleStyle = mergeStyles('titleStyle')
		overlayStyles.display = dialogStyles.display = 'block'

		let overlay
		if (this.props.showOverlay) {
			overlay = (
        <div className='popup-overlay'
	onClick={() => this.onOverlayClicked()}
	style={overlayStyles}
        />
      )
		}

		return isVisible ? (
        <section className='popup-wrapper'>
            {overlay}
            <div className='popup-dialog' style={dialogStyles}>
              <a role='button' className='popup-close-button'
	onClick={() => this.onCloseClicked()}
	style={closeButtonStyle}
              >
                &times;
               </a>
              <h2 style={titleStyle}>{this.props.title}</h2>
              {this.props.children}
            </div>
        </section>
    ) : <div />
	}
}

Container.displayName = 'Popup'

Container.sharedPropTypes = {
	closeButtonStyle: React.PropTypes.object,
	dialogStyles: React.PropTypes.object,
	onCloseClicked: React.PropTypes.func,
	onOverlayClicked: React.PropTypes.func,
	overlayStyles: React.PropTypes.object,
	showOverlay: React.PropTypes.bool,
	title: React.PropTypes.string,
	titleStyle: React.PropTypes.object
}

Container.propTypes = {
	...Container.sharedPropTypes,
	afterClose: React.PropTypes.func,
	afterOpen: React.PropTypes.func,
	beforeClose: React.PropTypes.func,
	beforeOpen: React.PropTypes.func,
	hideOnOverlayClicked: React.PropTypes.bool,
	isVisible: React.PropTypes.bool
}

Container.defaultProps = {
	title: '',
	showOverlay: true,
	overlayStyles: styles.overlayStyles,
	dialogStyles: styles.dialogStyles,
	closeButtonStyle: styles.closeButtonStyle,
	hideOnOverlayClicked: false
}

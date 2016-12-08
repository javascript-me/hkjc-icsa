import React, { Component, PropTypes } from 'react'
import classSet from 'classnames'

class PageButton extends Component {

	pageBtnClick (e) {
		e.preventDefault()
		this.props.changePage(e.currentTarget.textContent ? e.currentTarget.textContent : e.currentTarget.innerHTML)
	}

	render () {
		const classes = classSet({
			'active': this.props.active,
			'disabled': this.props.disable,
			'hidden': this.props.hidden,
			'page-item': true
		})

		const _render = () => { return { __html: this.props.children } }
		const link = !this.props.withoutLink ? <a href='#' onClick={this.pageBtnClick} className='page-link' dangerouslySetInnerHTML={_render(this.props.children)} /> : <span dangerouslySetInnerHTML={_render(this.props.children)} />
		return (
			<li className={classes}>
				{ link }
			</li>
		)
	}
}

PageButton.propTypes = {
	changePage: PropTypes.func,
	active: PropTypes.bool,
	disable: PropTypes.bool,
	hidden: PropTypes.bool,
	children: PropTypes.node,
	withoutLink: PropTypes.bool
}

export default PageButton

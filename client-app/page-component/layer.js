import React, { Component, PropTypes } from 'react'
import classSet from 'classnames'

export default React.createClass({

	getInitialState () {
		return {
			className: this.props.className,
			columns: this.props.columns
		}
	},

	componentDidMount() {
		if( this.props.onMounted ) {
			this.props.onMounted()
		}
	},

	render () {
		return <div className={this.state.className}> { this.props.children } </div>
	},

	propTypes: {
		typeLayer: PropTypes.oneOf(['top', 'body', 'bottom', 'filter']),
		columns: PropTypes.oneOf([1,2,3,4,5,6]),
		onMounted: PropTypes.func,
		children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
	},

	defaultProps: {
		className: 'col-md-6',
		columns: 6
	}
	
})

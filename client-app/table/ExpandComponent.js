/* eslint max-len: 0 */
import React, { Component, PropTypes } from 'react'
import classSet from 'classnames'

class ExpandComponent extends Component {

	render () {
		const trCss = {
			style: {
				backgroundColor: this.props.bgColor
			},
			className: classSet(
				this.props.isSelected ? this.props.selectRow.className : null,
				this.props.className
			)
		}
		return (
			<tr hidden={this.props.hidden} width={this.props.width} {...trCss}>
				<td colSpan={this.props.colSpan}>
					{ this.props.children }
				</td>
			</tr>
		)
	}
}

ExpandComponent.propTypes = {
	bgColor: PropTypes.string,
	colSpan: PropTypes.string,
	width: PropTypes.string,
	className: PropTypes.string,
	isSelected: PropTypes.bool,
	hidden: PropTypes.bool,
	children: PropTypes.object,
	selectRow: PropTypes.object
}

export default ExpandComponent

import React, { Component, PropTypes } from 'react'

class Checkbox extends Component {
	componentDidMount () { this.update(this.props.checked) }
	componentWillReceiveProps (props) { this.update(props.checked) }
	update (checked) {
		this.refs.check.indeterminate = checked === 'indeterminate'
	}
	render () {
		return (
			<input ref='check' className='react-bs-select-all {...this.props.classInput}'
				type='checkbox'
				checked={this.props.checked}
				onChange={this.props.onChange} />
		)
	}
}

Checkbox.propTypes = {
	onChange: PropTypes.func,
	checked: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
	classInput: PropTypes.number
}

export default Checkbox

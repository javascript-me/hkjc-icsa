import React from 'react'

export default class SelectCom extends React.Component {
	renderOptions () {
		return this.props.datas.map((data, index) => {
			return <option key={index} id={data.value}>{data.label}</option>
		})
	}

	render () {
		let className = `form-control ${this.props.warning ? 'has-error' : ''}`

		return <select className={className} value={this.props.selectedVal} onChange={this.props.handleVal}>
			<option value=''>All</option>
			{ this.props.datas ? this.renderOptions() : null }
		</select>
	}
}

SelectCom.propTypes = {
	datas: React.PropTypes.array,
	selectedVal: React.PropTypes.string,
	handleVal: React.PropTypes.func,
	warning: React.PropTypes.bool
}

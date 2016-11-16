import React from 'react'

export default class SelectCom extends React.Component {
	renderOptions () {
		return this.props.datas.map((data) => {
			return <option id={data.id}>{data.value}</option>
		});
	}
	render () {
		return <select className='form-control' value={this.props.selectedVal} onChange={this.props.handleVal}>
			<option value="">All</option>
			{this.renderOptions()}
		</select>;
	}
}

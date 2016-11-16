import React from 'react'

export default class SelectCom extends React.Component {
	renderOptions () {
		return this.props.datas.map((data) => {
			return <option id={data.id}>{data.value}</option>
		})
	}
	render () {
		return <select className='form-control' onChange={this.props.handelVal}>{this.renderOptions()}</select>
	}
}

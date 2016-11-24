import React from 'react'

export default class NoData extends React.Component {
	render () {
		let rowArr = []
		let tdDom = []
		let tdDomFirst = []
		for (let j = 0; j < this.props.colNum; j++) {
			tdDom.push(<td />)
			tdDomFirst.push(<td />)
		}
		tdDomFirst[0] = <td><div className='nodata'>NO Results</div></td>;
		rowArr.push(<tr className='nodata-tr'>{tdDomFirst}</tr>)
		for (let i = 0; i < 9; i++) {
			rowArr.push(<tr className='nodata-tr'>{tdDom}</tr>)
		}

		return <tbody>{rowArr}</tbody>
	}
}

NoData.propTypes = {
	colNum: React.PropTypes.number
}

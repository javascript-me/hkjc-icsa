import React from 'react'

export default class NoData extends React.Component {
	render () {
		let rowArr = []
		let tdDom = []
		for (let j = 0; j < this.props.colNum; j++) {
			tdDom.push(<td />)
		}
		for (let i = 0; i < 10; i++) {
			if (i === 0) {
				tdDom[0] = <td><div className='nodata'>NO Results</div></td>
			}
			rowArr.push(<tr className='nodata-tr'>{tdDom}</tr>)
		}
		return <tbody>{rowArr}</tbody>
	}
}

NoData.propTypes = {
	colNum: React.PropTypes.number
}

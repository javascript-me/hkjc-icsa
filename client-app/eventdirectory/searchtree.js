import React, { PropTypes } from 'react'
import Collapse, { Panel } from 'rc-collapse'
import SearchRecord from './searchrecord'

export default React.createClass({
	displayName: 'SearchTree',
	propTypes: {
		result: PropTypes.any
	},
	renderLevel2Header (level2) {
		return (
			<span>
				{level2.name}
				<span className='badge'>{level2.records.length}</span>
			</span>
		)
	},
	render () {
		if (this.props.result === null) {
			return (
				<div className='ed-tree' />
			)
		}

		let dataArray = this.props.result.data

		if (dataArray.length === 0) {
			return (
				<div className='ed-tree ed-no-result'>No Events Found</div>
			)
		}

		const beL1 = this.props.result.match !== 'L3'
		let defaultActiveKey = []
		if (beL1) {
			dataArray.forEach((level1, index) => defaultActiveKey.push(index + ''))
		} else {
			defaultActiveKey.push('0')
		}

		return (
			<div rel='root' className='ed-tree'>
				<Collapse accordion={false} defaultActiveKey={defaultActiveKey} className='level1'>
					{dataArray.map((level1, index) => (
						<Panel key={index} header={level1.name}>
							<Collapse accordion={false} defaultActiveKey={beL1 ? [] : ['0']} className='level2'>
								{level1.children.map((level2, index) => (
									<Panel key={index} header={this.renderLevel2Header(level2)}>
										{level2.records.map((competition, index) => (<SearchRecord key={index} record={competition} />))}
									</Panel>
								))}
							</Collapse>
						</Panel>
					))}
				</Collapse>
			</div>
			)
	}
})

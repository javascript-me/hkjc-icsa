import React, { PropTypes } from 'react'
import Collapse, { Panel } from 'rc-collapse'
import ResultItem from './searchresultitem'

export default React.createClass({
	displayName: 'SearchResult',
	propTypes: {
		result: PropTypes.any
	},
	renderLevel2Header (level2) {
		return (
			<span>
				{level2.name}
				<span className='badge'>{level2.competitions.length}</span>
			</span>
		)
	},
	render () {
		if (this.props.result === null) {
			return (
				<div className='ed-no-result' />
			)
		}

		if (this.props.result.length === 0) {
			return (
				<div className='ed-no-result'>No Events Found</div>
			)
		}

		return (
			<div rel='root' className='ed-result'>
				<Collapse accordion={false} defaultActiveKey={'0'} className='level1'>
					{this.props.result.map((level1, index) => (
						<Panel key={index} header={level1.name}>
							<Collapse accordion={false} defaultActiveKey={'0'} className='level2'>
								{level1.children.map((level2, index) => (
									<Panel key={index} header={this.renderLevel2Header(level2)}>
										{level2.competitions.map((competition, index) => (<ResultItem key={index} record={competition} />))}
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

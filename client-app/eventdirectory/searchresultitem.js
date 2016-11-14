import React, { PropTypes } from 'react'

export default React.createClass({
	displayName: 'SearchResultItem',
	propTypes: {
		record: PropTypes.object
	},
	componentDidMount () {
		$('.ed-result-item-icon', this.refs.root).tooltip({trigger: 'hover'})
		$('.ed-result-item-text', this.refs.root).tooltip({trigger: 'hover'})
	},
	render () {
		return (
			<div ref='root' className='ed-result-item'>
				<span className='ed-result-item-icon inplay-available' title='In-Play in progress' />
				<span className='ed-result-item-text' title='ARSENAL'>
					<span className={this.props.record.active === 1 ? 'active' : ''}>{this.props.record.t1}</span> vs <span className={this.props.record.active === 2 ? 'active' : ''}>{this.props.record.t2}</span>
				</span>
				<span className='ed-result-item-icon func-e' title='Function E' />
				<span className='ed-result-item-icon func-cc' title='Function CC' />
				<span className='ed-result-item-icon func-10' title='Function 10' />
				<span className={this.props.record.alert0 ? 'ed-result-item-icon alert-0' : 'ed-result-item-icon alert-1'} title='Alert 1' />
			</div>
			)
	}
})

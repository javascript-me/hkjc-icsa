import React, { PropTypes } from 'react'
import classNames from 'classnames'

export default React.createClass({
	displayName: 'SearchRecord',
	propTypes: {
		record: PropTypes.object
	},
	componentDidMount () {
		$('[title]', this.refs.root).tooltip({trigger: 'hover'})
	},
	render () {
		if (!this.props.record.status) {
			this.props.record.status = 'available'
		}
		const statusClasses = classNames('ed-record-icon', {['inplay-' + this.props.record.status]: true})
		return (
			<div ref='root' className='ed-record'>
				<span className={statusClasses} title={this.props.record.status} />
				<span className='ed-record-text'>
					<span className={this.props.record.active === 1 ? 'active' : ''} title={this.props.record.t1}>{this.props.record.t1}</span> vs <span className={this.props.record.active === 2 ? 'active' : ''} title={this.props.record.t2}>{this.props.record.t2}</span>
				</span>
				<span className='ed-record-icon func-e' title='Function E' />
				<span className='ed-record-icon func-cc' title='Function CC' />
				<span className='ed-record-icon func-10' title='Function 10' />
				<span className={this.props.record.alert0 ? 'ed-record-icon alert-0' : 'ed-record-icon alert-1'} title='Alert1' />
			</div>
			)
	}
})

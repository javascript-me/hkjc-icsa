import React, { PropTypes } from 'react'
import classNames from 'classnames'

const statusTips = {
	'Assigned': 'In-Play available',
	'In-Play': 'In-Play in progress',
	'Pre-Event': 'In-Play in progress',
	'Prelim': 'In-Play in progress',
	'Defined': 'In-Play available, pending for reopen sell',
	'Major': 'In-Play available, stopped selling'
}

export default React.createClass({
	displayName: 'SearchRecord',
	propTypes: {
		record: PropTypes.object,
		onClick: PropTypes.func
	},
	componentDidMount () {
		$('[title]', this.refs.root).tooltip({trigger: 'hover'})
	},
	render () {
		let record = this.props.record
		const statusClasses = classNames('ed-record-icon', {
			'inplay-available': record.status === 'Assigned',
			'inplay-in-progress': record.status === 'In-Play',
			'inplay-pending': record.status === 'Pre-Event',
			'inplay-stopped': record.status === 'Prelim' || record.status === 'Defined' || record.status === 'Major'
		})
		return (
			<div ref='root' className='ed-record' onClick={this.props.onClick}>
				<span className={statusClasses} title={statusTips[record.status]} />
				<span className='ed-record-text'>
					<span className={record.active === 1 ? 'active' : ''} title={record.t1Tip}>{record.t1}</span> vs <span className={record.active === 2 ? 'active' : ''} title={record.t2Tip}>{record.t2}</span>
				</span>
				<span className='ed-record-icon func-e' title='FEMO/EMOTR' />
				<span className='ed-record-icon func-cc' title='Customer Category Adjustment' />
				<span className='ed-record-icon func-10' title='Allowable Investment to 10k' />
				<span className={record.alert0 ? 'ed-record-icon alert-0' : 'ed-record-icon alert-1'} title='One-sided Booking' />
			</div>
			)
	}
})

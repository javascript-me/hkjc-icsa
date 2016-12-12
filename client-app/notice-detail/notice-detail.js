import React from 'react'
import DateFormatter from '../formatter/date-formatter'

export default class NoticeDetail extends React.Component {

	render () {
		return (
			<div className='notice-detail-box'>
				<ul className='detail-labels'>
					<li><span className='detail-label'>Status: </span><span className='detail-value'>{this.props.alert_status}</span></li>
					<li><span className='detail-label'>Category: </span><span className='detail-value'>{this.props.message_category}</span></li>
					<li>
						<span className='detail-label'>Received Time: </span>
						<span className='detail-value'>{DateFormatter.toDDMMMYYY(this.props.system_distribution_time)}</span>
					</li>
				</ul>

				<div className='message-detail'>{this.props.message_detail}</div>
			</div>
		)
	}
}

NoticeDetail.propTypes = {
	alert_status: React.PropTypes.string,
	message_category: React.PropTypes.string,
	system_distribution_time: React.PropTypes.string,
	message_detail: React.PropTypes.string
}

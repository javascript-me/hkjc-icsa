import React from 'react'
import ClassNames from 'classnames'
import Moment from 'moment'

export default class NoticeBox extends React.Component {

	getPriorityImageSrc (priority) {
		if (priority === 'Critical') return 'notice-board/Critical.svg'
		if (priority === 'High') return 'notice-board/High.svg'
		if (priority === 'Low') return 'notice-board/Low.svg'
		if (priority === 'Medium') return 'notice-board/Medium.svg'
		return ''
	}

	getIsAcknowledgedImageSrc (status) {
		if (status === 'Acknowledged') return 'notice-board/Tick.svg'
		return 'notice-board/Mail.svg'
	}

	getNoticeBoxClassNames () {
		return ClassNames('notice-box', this.props.visible ? '' : 'not-visible')
	}

	getListBoxClassName () {
		if (this.props.displayPosition === 'right') {
			return 'list-box' + '-' + 'right'
		} else {
			return 'list-box'
		}
	}

	getNoticeItemClassName(notice) {
		let needBlink = notice.alert_status === 'New' && (notice.priority === 'Critical' || notice.priority === 'High')

		return ClassNames(needBlink ? 'blink' : '')
	}

	getNoticeTitle (isAcknowledged) {
		return ClassNames('notice-title', isAcknowledged === 'Acknowledged' ? '' : 'bold-text')
	}

	formatDistibutionTime (dateStr) {
		return Moment(dateStr).format('hh:mm:ss')
	}

	textEllipsisWhenOverflow (text) {
		return text.length > 140 ? (text.substring(0, 140) + '...') : text
	}
	// 380

	render () {
		return (
			<div className={this.getNoticeBoxClassNames()}>
				<ul className={this.getListBoxClassName()}>
					{
						this.props.notices.map((notice, i) => {
							return <li className={this.getNoticeItemClassName(notice)}>
								<ul className='row'>

									{ this.props.displayPosition === 'right' ? <li className={this.getNoticeTitle(notice.alert_status)}><div className='wrap-text'>{this.textEllipsisWhenOverflow(notice.message_detail)}</div></li> : null}

									<li><img src={this.getPriorityImageSrc(notice.priority)} /></li>
									<li className='notice-date'>{this.formatDistibutionTime(notice.system_distribution_time)}</li>

									<li className='pull-right'><img src={this.getIsAcknowledgedImageSrc(notice.alert_status)} /></li>

									{ this.props.displayPosition === 'bottom' ? <li className={this.getNoticeTitle(notice.alert_status)}><div className='wrap-text'>{this.textEllipsisWhenOverflow(notice.message_detail)}</div></li> : null}
								</ul>
							</li>
						})
					}
				</ul>
			</div>
		)
	}
}

NoticeBox.propTypes = {
	visible: React.PropTypes.bool,
	notices: React.PropTypes.object,
	displayPosition: React.PropTypes.string
}

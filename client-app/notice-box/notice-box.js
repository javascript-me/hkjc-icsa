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
		if (this.props.displayPosition === 'bottom') {
			return 'list-box'
		}
		return 'list-box' + '-' + 'right'
	}

	getNoticeItemClassName (notice) {
		let needBlink = this.checkNoticeIsImportant(notice)

		return ClassNames(needBlink ? 'blink' : '')
	}

	checkNoticeIsImportant (notice) {
		return notice.alert_status === 'New' && (notice.priority === 'Critical' || notice.priority === 'High')
	}

	getNoticeTitle (isAcknowledged) {
		return ClassNames('notice-title', isAcknowledged === 'Acknowledged' ? '' : 'bold-text')
	}

	formatDistibutionTime (dateStr) {
		return Moment(dateStr).format('DD MMM YYYY hh:mm:ss')
	}

	textEllipsisWhenOverflow (text) {
		return text.length > 140 ? (text.substring(0, 140) + '...') : text
	}

	render () {
		return (
			<div className={this.getNoticeBoxClassNames()}>
				<ul className={this.getListBoxClassName()}>
					{
						this.props.notices.map((notice, i) => {
							var messageHTML = <li key={i} className={this.getNoticeTitle(notice.alert_status)}><div className='wrap-text'>{this.textEllipsisWhenOverflow(notice.message_detail)}</div></li>

							return <li className={this.getNoticeItemClassName(notice)}>
								<ul className='row'>
									{this.props.displayPosition !== 'bottom' ? messageHTML : null}
									<li><img src={this.getPriorityImageSrc(notice.priority)} /></li>
									<li className='notice-date'>{this.formatDistibutionTime(notice.system_distribution_time)}</li>
									<li className='pull-right'><img src={this.getIsAcknowledgedImageSrc(notice.alert_status)} /></li>
									{this.props.displayPosition === 'bottom' ? messageHTML : null}
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

import React from 'react'
import ClassNames from 'classnames'
import DataFormatter from '../formatter/date-formatter'

export default class NoticeBox extends React.Component {

	constructor (props) {
		super(props)
		this.openNoticeDetail = this.openNoticeDetail.bind(this)
		this.doAcknowledgement = this.doAcknowledgement.bind(this)
	}

	getPriorityImageSrc (priority) {
		if (priority === 'Critical') return 'notice-board/Critical.svg'
		if (priority === 'High') return 'notice-board/High.svg'
		if (priority === 'Medium') return 'notice-board/Medium.svg'
		if (priority === 'Low') return 'notice-board/Low.svg'
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
		return this.props.displayPosition === 'bottom' ? 'list-box-bottom' : 'list-box-right'
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

	textEllipsisWhenOverflow (text) {
		return text.length > 140 ? (text.substring(0, 140) + '...') : text
	}

	openNoticeDetail (notice) {
		this.props.onOpenDetail(notice)
	}

	doAcknowledgement (id, alertStatus) {
		this.props.onDoAcknowledgement(id, alertStatus)
	}

	render () {
		return (
			<div className={this.getNoticeBoxClassNames()}>
				<ul className={this.getListBoxClassName()}>
					{
						this.props.notices.map((notice, i) => {
							return <li key={i} className={this.getNoticeItemClassName(notice)}>
								<ul className='row'>
									<li className={this.getNoticeTitle(notice.alert_status)} onClick={() => this.openNoticeDetail(notice)}>
										<div className='wrap-text'>
											{this.textEllipsisWhenOverflow(notice.message_detail)}
										</div>
									</li>
									<li><img src={this.getPriorityImageSrc(notice.priority)} /></li>
									<li className='notice-date'>{DataFormatter.toDDMMMYYYHHMMSS(notice.system_distribution_time)}</li>
									<li className='pull-right use-pointer-cursor' onClick={() => this.doAcknowledgement(notice.id, notice.alert_status)}><img src={this.getIsAcknowledgedImageSrc(notice.alert_status)} /></li>
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
	onOpenDetail: React.PropTypes.func,
	onDoAcknowledgement: React.PropTypes.func,
	visible: React.PropTypes.bool,
	notices: React.PropTypes.array,
	displayPosition: React.PropTypes.string
}

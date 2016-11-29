import React from 'react'
import ClassNames from 'classnames'

export default class NoticeBox extends React.Component {

	constructor (props) {
		super(props)
	}

	getPriorityImageSrc (icon) {
		if (icon === 'Critical') return 'notice-board/Critical.svg'
		if (icon === 'High') return 'notice-board/High.svg'
		if (icon === 'Low') return 'notice-board/Low.svg'
		if (icon === 'Medium') return 'notice-board/Medium.svg'
		return ''
	}

	getIsAcknowledgedImageSrc (isAcknowledged) {
		if (isAcknowledged) return 'notice-board/Tick.svg'
		return 'notice-board/Mail.svg'
	}

	getNoticeBoxClassNames () {
		return ClassNames('notice-box', this.props.visible ? '' : 'not-visible')
	}

	render () {
		return (
            <div className={this.getNoticeBoxClassNames()}>
                <ul className='list-box'>
                    {
                        this.props.notices.map((notice, i) => {
	return <li>
                                <ul className='row'>
                                    <li><img src={this.getPriorityImageSrc(notice.icon)} /></li>
                                    <li className='notice-date'>{notice.date}</li>

                                    <li className='pull-right'><img src={this.getIsAcknowledgedImageSrc(notice.isAcknowledged)} /></li>

                                    <li className='notice-title'>
                                        <div className='wrap-text'>
                                            {notice.title}
                                        </div>
                                    </li>

                                </ul>
                            </li>
})
                    }
                </ul>
            </div>
        )
	}
}

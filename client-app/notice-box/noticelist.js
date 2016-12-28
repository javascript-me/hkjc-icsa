import React from 'react'
import ClassNames from 'classnames'
import TaskDetail from '../task-detail'

export default class NoticeList extends React.Component {

	constructor (props) {
		super(props)
		this.state = {
			currentTask: {}
		}
		this.openNoticeDetail = this.openNoticeDetail.bind(this)
		this.onTaskOpen = this.onTaskOpen.bind(this)
		this.onTaskApprove = this.onTaskApprove.bind(this)
	}

	getNoticeBoxClassNames () {
		return ClassNames('notice-box', this.props.visible ? '' : 'not-visible')
	}

	getListBoxClassName () {
		return this.props.displayPosition === 'bottom' ? 'list-box-bottom' : 'list-box-right'
	}

	getNoticeItemClassName (item) {
		let needBlink = this.checkNoticeIsImportant(item)
		return ClassNames(needBlink ? 'blink' : '')
	}

	checkNoticeIsImportant (item) {
		return (item.priority === 'Critical' || item.priority === 'High')
	}

	openNoticeDetail (item) {
		this.props.onOpenDetail(item)
	}

	onTaskApprove (data) {
		this.props.onTaskAproved(data)
	}

	onTaskOpen (taskData) {
		this.setState({currentTask: taskData}, () => {
			this.refs.task.showTask()
		})
	}

	render () {
		return (
			<div className={this.getNoticeBoxClassNames()}>
				<TaskDetail taskInfo={this.state.currentTask} ref='task' onApprove={this.onTaskApprove} />
				<ul className={this.getListBoxClassName()}>
					{
						this.props.data.map((item, index) => {
							return <li key={index} className={this.getNoticeItemClassName(item)}>
								<ul className={ClassNames('row', item.priority)}>
									<li className='notice-title' onClick={() => this.onTaskOpen(item)}>
										<div className='wrap-text'>
											{item.taskDescription}
										</div>
									</li>
									<li>{ item.priority === 'Critical' ? <i className={item.priority} /> : null }</li>
									<li className='pull-right use-pointer-cursor' ><i className={'type' + item.lockStatus} /></li>
								</ul>
							</li>
						})
					}
				</ul>
			</div>
		)
	}
}

NoticeList.propTypes = {
	onOpenDetail: React.PropTypes.func,
	onDoAcknowledgement: React.PropTypes.func,
	visible: React.PropTypes.bool,
	data: React.PropTypes.array,
	displayPosition: React.PropTypes.string,
	onTaskAproved: React.PropTypes.func
}

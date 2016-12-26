import React, {Component} from 'react'
import Popup from '../popup'

const sampleTask = {
	priority: 'medium',
	taskType: 'aproveTask',
	status: 'New',
	taskSatus: 1,
	category: 'N/A',
	taskTitle: 'MUN vs ABC -POSITION 90%',
	// taskBtnText: 'Odds Adjustment Panel',
	taskDetail: '<Odds Compilation Task> has been assigned to you due to the odds re-finalisation. Please kindly complete your Odds Compilation Task ASAP.'

}
class TaskDetailBox extends Component {
	constructor (props) {
		super(props)
		this.state = {
			isAllowApprove: false
		}
	}

	render () {
		let isSuppervicer = true
		const { priority, taskTitle, taskDetail, status, taskType, taskBtnText, approveFunc, taskExcFunc, category, receivedTime, targetTime, lockStatus } = sampleTask
		let color = this.getTitleColor(priority)
		let diffentOptions = {}
		if (taskType === 'aproveTask') {
			diffentOptions = {
				isAproveTask: true,
				inputArea: true,
				confirmBtn: taskBtnText
					? {text: taskBtnText, func: () => {}}
					: {text: 'Approve', func: approveFunc},
				secondBtn: taskBtnText
					? null
					: {text: 'Reject', func: this.handleReject},
				otherBtn: null

			}
		} else {
			diffentOptions = {
				isAproveTask: false,
				inputArea: false,
				confirmBtn: {text: taskBtnText, func: taskExcFunc},
				secondBtn: null,
				otherBtn: isSuppervicer
							? {text: 'Reassign', func: this.handleAssign}
							: null
			}
		}

		return (<div className='task-detail-box'>
			<Popup ref='detailPop'
				popupDialogBorderColor={color}
				headerColor={color}
				title={taskTitle}
				confirmBtn={diffentOptions.confirmBtn.text}
				cancelBtn={diffentOptions.secondBtn && diffentOptions.secondBtn.text}
				otherBtn={diffentOptions.otherBtn && diffentOptions.otherBtn.text}
				showOther={diffentOptions.otherBtn}
				showCancel={!!diffentOptions.secondBtn}
				onConfirm={diffentOptions.confirmBtn.func}
				onCancel={diffentOptions.secondBtn && diffentOptions.secondBtn.func}
				onOther={diffentOptions.otherBtn && diffentOptions.otherBtn.func}
				confirmBtnDisabled={diffentOptions.isAproveTask && !this.state.isAllowApprove}
				cancelBtnDisabled={diffentOptions.isAproveTask && !this.state.isAllowApprove} >
				<div className='info-part'>
					{status && <span><span className='field'>Status:</span><span className='value'>{status}</span></span>}
					{category && <span><span className='field'>Category:</span><span className='value'>{category}</span></span>}
					{receivedTime && <span><span className='field'>Received Time:</span><span className='value'>{receivedTime}</span></span>}
					{targetTime && <span><span className='field'>Target Time:</span><span className='value'>{category}</span></span>}
					<div className={this.getIconClass(lockStatus)} />
				</div>
				<div className='detail-text'>{taskDetail}</div>
				<div className='input-part' style={{display: (diffentOptions.inputArea && diffentOptions.secondBtn) ? 'block' : 'none'}}>
					<div className='tip'>Remark</div>
					<textarea placeholder='Please add mark' cols='90' rows='5' onChange={(e) => this.handleInputChange(e)} />
				</div>
			</Popup>
		</div>
		)
	}
	componentDidMount () {
		this.refs.detailPop.show()
	}
	getTitleColor (priority) {
		let color
		switch (priority) {
		case ('low'): color = '#85B612'; break
		case ('medium'): color = '#FF8F00'; break
		case ('high'): color = '#FF433E'; break
		case ('critical'): color = '#D3221B'; break
		default: color = '#85B612'; break
		}

		return color
	}

	handleInputChange (e) {
		if (e.target.value && !this.state.isAllowApprove) {
			this.setState({isAllowApprove: true})
		} else {
			if (!e.target.value && this.state.isAllowApprove) {
				this.setState({isAllowApprove: false})
			}
		}
	}

	getIconClass (taskSatus) {
		let iconClass
		switch (taskSatus) {
		case (0) : iconClass = 'none'; break
		case (1) : iconClass = 'icon lock-by-me'; break
		case (2) : iconClass = 'icon assing-to-me'; break
		case (3) : iconClass = 'icon lock-by-other'; break
		default : iconClass = 'none'; break
		}
		return iconClass
	}

}

export default TaskDetailBox

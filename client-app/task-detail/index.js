import React, {Component} from 'react'
import Popup from '../popup'
import dateTool from '../formatter/date-formatter.js'
// import LoginService from '../login/login-service.js'

// const userProfile = LoginService.getProfile()
// console.log(userProfile)

class TaskDetailBox extends Component {
	constructor (props) {
		super(props)
		this.state = {
			isAllowApprove: false
		}
		this.showTask = this.showTask.bind(this)
		this.onReAssign = this.onReAssign.bind(this)
		this.onSimpleTastApprove = this.onSimpleTastApprove.bind(this)
	}
	onSimpleTastApprove (type) {
		const TaskAction = () => {
			let result = {}
			result.remark = this.refs.textBox.value
			result.ApproveType = type
			result.taskID = this.props.taskInfo.taskID
			result.taskStatus = 'Completed'
			this.props.onApprove(result)
		}
		return TaskAction
	}

	render () {
		let isSuppervicer = true
		const { priority, taskName, taskDescription, taskStatus, taskType, buttonName, approveFunc, taskExcFunc, category, distributionDateTime, targetCompletionDateTime, lockStatus } = this.props.taskInfo
		let color = this.getTitleColor(priority)
		let diffentOptions = {}
		let statusIconClassName = this.getIconClass(lockStatus)
		let isReadonly = taskStatus !== 'New'

		switch (taskType) {
		case ('execute'): {
			diffentOptions = {
				isAproveTask: false,
				inputArea: false,
				confirmBtn: {text: buttonName, func: taskExcFunc},
				secondBtn: null,
				otherBtn: !isReadonly && isSuppervicer
								? {text: 'Reassign', func: this.onReAssign}
								: null
			}
		} break
		case ('simple'): {
			diffentOptions = {
				isAproveTask: true,
				inputArea: true,
				confirmBtn: {text: 'Approve', func: this.onSimpleTastApprove('approved')},
				secondBtn: {text: 'Reject', func: this.onSimpleTastApprove('reject')},
				otherBtn: null
			}
		} break
		case ('advance'): {
			diffentOptions = {
				isAproveTask: true,
				inputArea: false,
				confirmBtn: {text: buttonName, func: taskExcFunc},
				secondBtn: null,
				otherBtn: null
			}
		} break
		default: {
			diffentOptions = {
				isAproveTask: true,
				inputArea: true,
				confirmBtn: {text: 'Approve', func: approveFunc},
				secondBtn: {text: 'Reject', func: this.handleReject},
				otherBtn: null
			}
		}
		}

		return (<div className='task-detail-box'>
			<Popup ref='detailPop'
				popupDialogBorderColor={color}
				headerColor={color}
				title={taskName}
				showCloseIcon
				showCancel={false}
				confirmBtn={diffentOptions.confirmBtn.text}
				secondFuncBtn={diffentOptions.secondBtn && diffentOptions.secondBtn.text}
				otherBtn={diffentOptions.otherBtn && diffentOptions.otherBtn.text}
				showOther={diffentOptions.otherBtn}
				showSecondFunc={!!diffentOptions.secondBtn}
				onConfirm={diffentOptions.confirmBtn.func}
				onSecondFunc={diffentOptions.secondBtn && diffentOptions.secondBtn.func}
				onOther={diffentOptions.otherBtn && diffentOptions.otherBtn.func}
				confirmBtnDisabled={(taskType === 'simple') && !this.state.isAllowApprove || isReadonly}
				secondFuncBtnDisabled={(taskType === 'simple') && !this.state.isAllowApprove || isReadonly} >
				<div className='info-part'>
					{taskStatus && <span><span className='field'>Status:</span><span className='value'>{taskStatus}</span></span>}
					{category && <span><span className='field'>Category:</span><span className='value'>{category}</span></span>}
					{distributionDateTime && <span><span className='field'>Received Time:</span><span className='value'>{dateTool.toDDMMMYYY(distributionDateTime)}</span></span>}
					{targetCompletionDateTime && <span><span className='field'>Target Time:</span><span className='value'>{dateTool.toDDMMMYYY(targetCompletionDateTime)}</span></span>}
					<div className={statusIconClassName} />
				</div>
				<div className='task-content'>
					<div className='detail-text'>{taskDescription}</div>
					{!isReadonly && <div className='input-part' style={{display: (diffentOptions.inputArea && diffentOptions.secondBtn) ? 'block' : 'none'}}>
						<div className='tip'>Remark</div>
						<textarea placeholder='Please add mark' cols='90' rows='5' onChange={(e) => this.handleInputChange(e)} ref='textBox' />
					</div>}
				</div>

			</Popup>
		</div>
		)
	}
	componentDidMount () {

	}
	componentWillReceiveProps (nextProps) {
		this.setState({isAllowApprove: false})
	}

	showTask () {
		this.refs.detailPop.show()
	}

	onReAssign () {
		this.props.onReAssign && this.props.onReAssign(this.props.taskInfo)
	}

	getTitleColor (priority) {
		priority = priority ? priority.toLowerCase() : ''
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

	getIconClass (taskStatus) {
		let iconClass
		switch (taskStatus) {
		case (0) : iconClass = 'none'; break
		case (1) : iconClass = 'icon lock-by-me'; break
		case (2) : iconClass = 'icon assign-to-me'; break
		case (3) : iconClass = 'icon lock-by-other'; break
		default : iconClass = 'none'; break
		}

		return iconClass
	}

}

TaskDetailBox.propTypes = {
	taskInfo: React.PropTypes.object,
	onApprove: React.PropTypes.func,
	onReAssign: React.PropTypes.func
}
TaskDetailBox.defaultProps = {
	taskInfo: {}
}
export default TaskDetailBox

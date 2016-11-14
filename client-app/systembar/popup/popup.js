import React from 'react'
import Moment from 'moment'

const Draggable = React.createClass({
	getInitialState () {
		return {
			relX: 0,
			relY: 0
		}
	},
	propTypes: {
		x: React.PropTypes.number,
		y: React.PropTypes.number,
		onMove: React.PropTypes.any,
		children: React.PropTypes.object

	},
	onMouseDown (e) {
		if (e.button !== 0) return
		const ref = this.refs.handle
		const body = document.body
		const box = ref.getBoundingClientRect()
		this.setState({
			relX: e.pageX - (box.left + body.scrollLeft - body.clientLeft),
			relY: e.pageY - (box.top + body.scrollTop - body.clientTop)
		})
		document.addEventListener('mousemove', this.onMouseMove)
		document.addEventListener('mouseup', this.onMouseUp)
		e.preventDefault()
	},
	onMouseUp (e) {
		document.removeEventListener('mousemove', this.onMouseMove)
		document.removeEventListener('mouseup', this.onMouseUp)
		e.preventDefault()
	},
	onMouseMove (e) {
		const ref = this.refs.handle
		const body = document.body
		let iL = e.clientX - this.state.relX
		let iT = e.clientY - this.state.relY
		let maxL = body.clientWidth - ref.scrollWidth
		let maxT = body.clientHeight - ref.scrollHeight

		iL <= 0 && (iL = 0)
		iT <= 0 && (iT = 0)
		iL >= maxL && (iL = maxL)
		iT >= maxT && (iT = maxT)

		this.props.onMove({
			x: iL,
			y: iT
		})
		e.preventDefault()
	},
	render () {
		return (
			<div
				onMouseDown={this.onMouseDown}
				style={{
					position: 'absolute',
					left: this.props.x,
					top: this.props.y
				}}
				ref='handle'
			>{this.props.children}</div>
		)
	}
})

const Popup = React.createClass({
	getInitialState () {
		return {
			x: 145,
			y: 35
		}
	},
	propTypes: {
		hideClock: React.PropTypes.func,
		date: React.PropTypes.string
	},
	move (e) {
		this.setState(e)
	},
	render () {
		let time = this.props.date
		const {x, y} = this.state
		return (
			<Draggable x={x} y={y} onMove={this.move}>
				<div className='popup' id='clock' tabIndex='-1'>
					<div className='modal-dialog'>
						<div className='modal-content'>
							<div className='modal-header'>
								<button type='button' className='close' onClick={this.props.hideClock}><img src='icon/close.svg' /></button>
								<h4 className='modal-title' id='myModalLabel'><img src='icon/icon-clock.svg' /><span className='title'>Clock</span></h4>
							</div>
							<div className='modal-body'>
								<p>{Moment(Date(time)).format('ddd, D MMM, YYYY')}</p>
								<p className='time'>{Moment(Date(time)).format('hh:mm:ss')}</p>

							</div>
						</div>
					</div>
				</div>
			</Draggable>
		)
	}
})

export default Popup

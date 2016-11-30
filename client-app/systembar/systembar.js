import React from 'react'
import LoginService from '../login/login-service'
import classNames from 'classnames'
import PubSub from '../pubsub'
import Popup from './popup/popup'
import _ from 'underscore'
import Moment from 'moment'
import Overlay from '../popup'

import SystembarService from './systembar-service'

let token = null

const getClock = async () => {
	const time = await SystembarService.getClock()
	return time
}

export default class Systembar extends React.Component {
	constructor (props) {
		super(props)
		this.displayName = 'Systembar'
		this.state = {
			show: LoginService.hasProfile(),
			date: new Date().getTime(),
			showPopup: false,
			info: LoginService.getProfile(),
			showOther: true,
			taskNum: 0,
			text: ''
		}

		getClock().then((data) => { this.setState({date: Number(data)}) }, () => { this.setState({date: NaN}) })
	}
	tick (preState) {
		let preStateCopy = _.clone(preState)
		preStateCopy.date = Number(preStateCopy.date) + 1000
		return preStateCopy
	}
	componentDidMount () {
		this.interval = setInterval(() => {
			this.setState((preState) => { return this.tick(preState) })
		}, 1000)
	}
	componentWillUnmount () {
		PubSub.unsubscribe(token)
		this.interval = clearInterval(this.interval)
	}
	showClock () {
		this.setState((preState) => {
			let preStateCopy = _.clone(preState)
			preStateCopy.showPopup = true
			return preStateCopy
		})
	}
	hideClock () {
		this.setState((preState) => {
			let preStateCopy = _.clone(preState)
			preStateCopy.showPopup = false
			return preStateCopy
		})
	}
	showComfirmPopup () {
		LoginService.getTasksNum().then((data) => {
			let num = 0
			if (data[this.state.info.username] && data[this.state.info.username].num) {
				num = data[this.state.info.username].num
				this.setState({taskNum: num})
			}

			if (num === 0) {
				this.setState({showOther: false, text: 'Are you sure you want to log out now?'})
			} else {
				this.setState({text: 'Do you want to logout the system?'})
			}
			this.refs.logout.show()
		})
	}
	logout () {
		LoginService.logout()
		window.location.href = '#/'
	}
	goOther () {
		return
	}
	render () {
		const classes = classNames('row row-systembar', {hidden: !this.state.show})
		return (
			<div className={classes}>
				<span className='logo'><img src='HKJC_Logo.svg' /> <span><strong className=''>HKJC</strong> SPORTS BETTING</span></span>
				<a onClick={() => this.showClock()}><strong>{Moment(this.state.date).format('h:mma')},</strong> {Moment(this.state.date).format('D MMM, YYYY')}</a>
				{ this.state.showPopup ? <Popup date={this.state.date} hideClock={() => this.hideClock()} /> : null }
				<div className='username' id='dropdownMenu1'>
					<span className='hello'>
						<img src='icon/Shape.svg' />Hello, {this.state.info.username}
					</span>
					<ul className='dropdown-menu'>
						<li><a href='#/page/myprofile'>My Profile</a></li>
						<li><a onClick={() => this.showComfirmPopup()}>Logout</a></li>
					</ul>
				</div>
				<Overlay hideOnOverlayClicked ref='logout' title='Logout' onConfirm={() => this.logout()} showOther={this.state.showOther} otherBtn='My Tasks' confirmBtn='Logout' onOther={() => this.goOther()}>
					{ this.state.showOther ? <p>You still have <span className='warning'>{this.state.taskNum} of outstanding task</span> need to be completed.</p> : null }
					<p>{this.state.text}</p>
				</Overlay>
			</div>
			)
	}
}

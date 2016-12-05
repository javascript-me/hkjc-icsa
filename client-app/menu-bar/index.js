import React, { Component } from 'react'
import { Link } from 'react-router'
import classnames from 'classnames'
import LoginService from '../login/login-service'
import PubSub from '../pubsub'
import menuData from './menuBarData.js'
import EventDirectory from '../eventdirectory/eventdirectory'
import Noticeboard from '../notice-board/notice-board'
import NoticeBoardService from '../notice-board/notice-board-service'

let loginChangeToken = null

const getNoticeCountPromise = async (username) => {
	let count = 0

	try {
		count = await NoticeBoardService.getRemindCount(username)
	} catch (ex) {

	}

	return count
}

class MenuBar extends Component {
	constructor (props) {
		super(props)
		this.displayName = 'Menu-Bar'
		this.showHideNoticeBoard = this.showHideNoticeBoard.bind(this)
		this.state = {
			slimMode: false,
			showNoticeBoard: false,
			menuBarShouldShow: LoginService.hasProfile(),
			userProfile: LoginService.getProfile(),
			noticeRemindCount: 0
		}
	}

	showHideNoticeBoard () {
		if (this.state.showNoticeBoard) {
			this.setState({ showNoticeBoard: false })
		} else {
			this.setState({ showNoticeBoard: true })
		}
	}

	render () {
		let menuBarData = (this.state.userProfile && this.state.userProfile.username === 'allgood') ? menuData.menuList1 : menuData.menuList2
		return (
			<div className='menu-bar-wrap row' style={{display: this.state.menuBarShouldShow ? 'block' : 'none'}}>
				<div className={classnames('menu-container', {slimMode: this.state.slimMode})}>
					<EventDirectory slimMode={this.state.slimMode} />
					<div className='menu-box'>
						{menuBarData.length > 0 && menuBarData.map((item, idx) => (
							<div className='menu-unit' key={idx}>
								<Link to={item.link} className='level-1-unit'>
									<div className='icon'>
										<img className='icon-N icon-img' src={'menu-bar/' + item.iconSrc} />
										<img className='icon-A icon-img' src={'menu-bar/' + item.iconSrc_A} />
									</div>
									<div className='text' style={{display: this.state.slimMode ? 'none' : 'block'}}>
										<div>{item.textL1}</div>
										<div>{item.textL2}</div>
									</div>

								</Link>
								<SecondLevelMenu dataList={item.subMenu} />
							</div>
						))}
					</div>
					<div className='toggle-btn' onClick={() => this.modeChange()}>c</div>
					<div className='message'>
						<i className='icon-notification ' onClick={this.showHideNoticeBoard}>
							<img src='icon/notification.svg' />
							{
								this.state.noticeRemindCount > 0
								? <span className='message-count'>{this.state.noticeRemindCount}</span>
								: ''
							}

						</i>
						<i className='icon-notification tips'>
							<img src='icon/icon-action.svg' />
							{
								this.state.noticeRemindCount > 0
								? <span className='message-count'>{this.state.noticeRemindCount}</span>
								: ''
							}
						</i>
					</div>
				</div>
				{ this.state.showNoticeBoard ? <Noticeboard isSlim={this.state.slimMode} /> : null }
			</div>)
	}

	modeChange () {
		this.setState({slimMode: !this.state.slimMode})
	}

	componentDidMount () {
		let self = this
		let userProfile = LoginService.getProfile()
		let noticePromise = getNoticeCountPromise(userProfile.username)

		noticePromise.then((noticeRemindCount) => {
			self.setState({noticeRemindCount: noticeRemindCount})
		})

		loginChangeToken = PubSub.subscribe(PubSub.LOGIN_CHANGE, () => {
			self.setState({menuBarShouldShow: LoginService.hasProfile(), userProfile: userProfile})
		})
	}

	componentWillUnmount () {
		PubSub.unsubscribe(loginChangeToken)
	}

}

export const ThirdLevelMenu = (props) => {
	let { data } = props
	let thirdLevelOnly = true
	if (data) {
		for (let child of data) {
			child.subMenu && (thirdLevelOnly = false)
		}
	}
	if (!thirdLevelOnly) {
		return (
			<div className='third-level'>
				<div className='third-level-container'>
					{data && data.map((item, idx) => (
						<div className='third-level-item' key={item.text}>
							<Link to={item.link} className='text'>{item.text}</Link>
							<div className='underline'>c</div>
							<div className='forth-level-container'>
								{item.subMenu && item.subMenu.map((item, idx) => (
									<Link key={item.text} to={item.link} className='forth-level-item'>{item.text}</Link>))}
							</div>
						</div>))}
				</div>
			</div>
        )
	}
	return (<div />)
}

ThirdLevelMenu.propTypes = {
	data: React.PropTypes.array
}

export const ThirdLevelOnly = (props) => {
	let thirdLevelOnly = true
	if (props.data) {
		for (let child of props.data) {
			child.subMenu && (thirdLevelOnly = false)
		}
	}
	if (thirdLevelOnly) {
		return (<div className='third-level-only'>
			<div className='third-level-only-container'>
				{props.data && props.data.map((item, idx) => (
					<Link className='third-only-item' to={item.link} key={item.text}>{item.text}</Link>))}
			</div>
		</div>)
	}
	return (<div />)
}

ThirdLevelOnly.propTypes = {
	data: React.PropTypes.array
}

const SecondLevelMenu = (props) => {
	let { dataList } = props
	return (
		<div className='second-level'>
			<div className='second-level-container'>
				{dataList && dataList.map((item, idx) => (<div key={idx} className={classnames('second-level-item', {noSub: !item.subMenu})}>
					<div className='second-level-text'>
						<Link to={item.link}>{item.text}</Link>
						<ThirdLevelOnly data={item.subMenu} />
					</div>
					<ThirdLevelMenu data={item.subMenu} />
				</div>))}
			</div>
		</div>

    )
}

SecondLevelMenu.propTypes = {
	dataList: React.PropTypes.array
}
export default MenuBar

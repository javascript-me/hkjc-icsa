import React, { PropTypes } from 'react'
import classNames from 'classnames'

const WHICHTAB = {
	UserProfile: 0,
	Subscription: 1
}

export default React.createClass({
	displayName: 'ProfileTabs',
	propTypes: {
		pageTitle: PropTypes.string,
		h1Title: PropTypes.string,
		children: PropTypes.array.isRequired
	},
	getInitialState () {
		return {
			curTabIndex: WHICHTAB.UserProfile
		}
	},
	getDefaultProps () {
		return {
			pageTitle: 'Home \\ Global Tools & Administration \\ User',
			h1Title: 'User Account Profile'
		}
	},
	onTabClick (tabIndex) {
		if (tabIndex === this.state.curTabIndex) {
			return
		}

		this.setState({curTabIndex: tabIndex})
	},
	render () {
		const navClasses = {
			userProfile: classNames({ 'active': WHICHTAB.UserProfile === this.state.curTabIndex }),
			subscription: classNames({ 'active': WHICHTAB.Subscription === this.state.curTabIndex })
		}
		const contentClasses = {
			userProfile: classNames('tab-pane', { 'active': WHICHTAB.UserProfile === this.state.curTabIndex }),
			subscription: classNames('tab-pane', { 'active': WHICHTAB.Subscription === this.state.curTabIndex })
		}
		return (
			<div ref='root' className='auditlog profile-tabs'>
				<div ref='root' className='row page-header profile-header'>
					<p className='hkjc-breadcrumb'>{this.props.pageTitle}</p>
					<h1>{this.props.h1Title}</h1>

					<ul className='nav nav-pills'>
						<li className={navClasses.userProfile} onClick={() => { this.onTabClick(WHICHTAB.UserProfile) }}><a href='javascript:void(0)'>{this.props.h1Title}</a></li>
						<li className={navClasses.subscription} onClick={() => { this.onTabClick(WHICHTAB.Subscription) }}><a href='javascript:void(0)'>Subscription</a></li>
					</ul>
				</div>

				<div className='tab-content profile-content'>
					<div className={contentClasses.userProfile}>{this.props.children[0]}</div>
					<div className={contentClasses.subscription}>{this.props.children[1]}</div>
				</div>
			</div>
		)
	}
})

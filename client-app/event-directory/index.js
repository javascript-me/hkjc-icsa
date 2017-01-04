import React, { PropTypes } from 'react'
import classNames from 'classnames'

import SearchContainer, {EDTYPES} from './search-container'

const WHICHTAB = {
	football: 0,
	basketball: 1,
	horseracing: 2,
	none: 3
}

export default React.createClass({
	displayName: 'EventDirectory',
	propTypes: {
		slimMode: PropTypes.bool
	},
	getInitialState () {
		return {
			curTabIndex: WHICHTAB.none,
			showContent: false
		}
	},
	componentDidMount () {
		const domLi = $('.nav-tabs li', this.refs.root)
		if (domLi.tooltip) {
			domLi.tooltip({trigger: 'hover', placement: 'bottom'})
		}
	},
	onTabClick (tabIndex) {
		if (tabIndex === this.state.curTabIndex) {
			this.setState({
				curTabIndex: WHICHTAB.none,
				showContent: false
			})
		} else {
			this.setState({
				curTabIndex: tabIndex,
				showContent: true
			})
		}
	},
	render () {
		const contentClasses = classNames('tab-content', {hidden: !this.state.showContent})
		const navClasses = {
			football: classNames({ 'active': WHICHTAB.football === this.state.curTabIndex }),
			basketball: classNames({ 'active': WHICHTAB.basketball === this.state.curTabIndex }),
			horseracing: classNames({ 'active': WHICHTAB.horseracing === this.state.curTabIndex })
		}
		const panelClasses = {
			football: classNames('tab-pane', { 'active': WHICHTAB.football === this.state.curTabIndex }),
			basketball: classNames('tab-pane', { 'active': WHICHTAB.basketball === this.state.curTabIndex }),
			horseracing: classNames('tab-pane', { 'active': WHICHTAB.horseracing === this.state.curTabIndex })
		}
		return (
			<div ref='root' className={classNames('row-eventdirectory', {slim: this.props.slimMode})}>
				<ul id='ed-nav-tabs' className='nav nav-tabs'>
					<li id='li-football' className={navClasses.football} title='Football' onClick={() => { this.onTabClick(WHICHTAB.football) }}><a id='football-tab' href='javascript:void(0)' /></li>
					<li className={navClasses.basketball} title='Basketball' onClick={() => { this.onTabClick(WHICHTAB.basketball) }}><a id='basketball-tab' href='javascript:void(0)' /></li>
					<li className={navClasses.horseracing} title='Horse Racing' onClick={() => { this.onTabClick(WHICHTAB.horseracing) }}><a id='horseracing-tab' href='javascript:void(0)' /></li>
				</ul>

				<div className={contentClasses}>
					<div className={panelClasses.football} id='football-panel'>
						<div className='line' />
						<SearchContainer type={EDTYPES.FOOTBAL} />
					</div>
					<div className={panelClasses.basketball} id='basketball-panel'>
						<div className='line' />
						<SearchContainer type={EDTYPES.BASEKETBALL} />
					</div>
					<div className={panelClasses.horseracing} id='horseracing-panel'>
						<div className='line' />
						<SearchContainer type={EDTYPES.HORSERACING} />
					</div>
				</div>
			</div>
			)
	}
})

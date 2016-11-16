import React, { PropTypes } from 'react'
import classNames from 'classnames'

import SearchContainer, {EDTYPES} from './searchcontainer'

export default React.createClass({
	displayName: 'EventDirectory',
	propTypes: {
		slimMode: PropTypes.bool
	},
	getInitialState () {
		return {
			showContent: false
		}
	},
	componentDidMount () {
		$('.nav-tabs li a', this.refs.root).click(this.handleTabClick)
		$('.nav-tabs li a', this.refs.root).tooltip({trigger: 'hover', placement: 'bottom'})
	},
	handleTabClick (e) {
		let showContent = false
		let parent = $(e.target).parent()

		if (parent.hasClass('active')) {
			showContent = false
			e.stopPropagation()
			e.preventDefault()
			parent.removeClass('active')
		} else {
			showContent = true
		}

		if (showContent !== this.state.showContent) {
			this.setState({showContent})
		}
	},
	render () {
		const contentClasses = classNames('tab-content', {hidden: !this.state.showContent})
		return (
			<div ref='root' className={classNames('row-eventdirectory', {slim:this.props.slimMode})}>
				<ul className='nav nav-tabs' role='tablist'>
					<li role='presentation'><a id='football-tab' href='#football-panel' role='tab' data-toggle='tab' title='Football' /></li>
					<li role='presentation'><a id='basketball-tab' href='#basketball-panel' role='tab' data-toggle='tab' title='Basketball' /></li>
					<li role='presentation'><a id='horseracing-tab' href='#horseracing-panel' role='tab' data-toggle='tab' title='Horse Racing' /></li>
				</ul>

				<div className={contentClasses}>
					<div role='tabpanel' className='tab-pane' id='football-panel'>
						<div className='line' />
						<SearchContainer type={EDTYPES.FOOTBAL} />
					</div>
					<div role='tabpanel' className='tab-pane' id='basketball-panel'>
						<div className='line' />
						<SearchContainer type={EDTYPES.BASEKETBALL} />
					</div>
					<div role='tabpanel' className='tab-pane' id='horseracing-panel'>
						<div className='line' />
						<SearchContainer type={EDTYPES.HORSERACING} />
					</div>
				</div>
			</div>
			)
	}
})

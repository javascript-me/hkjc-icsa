import React from 'react'
import classNames from 'classnames'

import TabContent, {EDTYPES} from './tabcontent'

export default React.createClass({
	displayName: 'EventDirectory',
	getInitialState () {
		return {
			showContent: false
		}
	},
	componentDidMount () {
		$('.nav-tabs li a', this.refs.root).click(this.handleTabClick)
		$('.nav-tabs li a', this.refs.root).tooltip({trigger: 'hover'})
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
			<div ref='root' className='row-eventdirectory'>
				<ul className='nav nav-tabs' role='tablist'>
					<li role='presentation'><a href='#ed-football' role='tab' data-toggle='tab' title='Football' /></li>
					<li role='presentation'><a href='#ed-basketball' role='tab' data-toggle='tab' title='Basketball' /></li>
					<li role='presentation'><a href='#ed-horseracing' role='tab' data-toggle='tab' title='Horse Racing' /></li>
				</ul>

				<div className={contentClasses}>
					<div role='tabpanel' className='tab-pane' id='ed-football'>
						<TabContent type={EDTYPES.FOOTBAL} />
					</div>
					<div role='tabpanel' className='tab-pane' id='ed-basketball' />
					<div role='tabpanel' className='tab-pane' id='ed-horseracing' />
				</div>
			</div>
			)
	}
})

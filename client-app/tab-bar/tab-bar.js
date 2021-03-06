import React from 'react'
import ClassNames from 'classnames'

export default class TabBar extends React.Component {

	constructor (props) {
		super(props)
		this.onItemClick = this.onItemClick.bind(this)
	}

	onItemClick (event) {
		this.props.onChangeTab(event.target.id)
	}

	getTabClassNames (item) {
		return ClassNames('tab-button', item.isOn ? 'on' : 'off')
	}

	getTabBarClassNames () {
		return this.props.displayPosition === 'bottom' ? 'tab-bar-bottom' : 'tab-bar-right'
	}

	render () {
		return (
			<div className={this.getTabBarClassNames()}>
				{
					this.props.tabData.map((item, i) => {
						return <div key={i} className={this.getTabClassNames(item)} id={item.label} onClick={this.onItemClick}>{item.label}</div>
					})
				}
			</div>
		)
	}
}

TabBar.propTypes = {
	onChangeTab: React.PropTypes.func,
	tabData: React.PropTypes.array,
	displayPosition: React.PropTypes.string
}

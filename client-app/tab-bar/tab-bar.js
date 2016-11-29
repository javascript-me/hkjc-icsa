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

	render () {
		return (
            <div className='tab-bar'>
                {
                    this.props.tabData.map((item, i) => {
	return <div className={this.getTabClassNames(item)} id={item.label} onClick={this.onItemClick}>{item.label}</div>
})
                }
            </div>
        )
	}

}

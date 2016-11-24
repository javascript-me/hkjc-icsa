import React, {Component} from 'react'
import SystemBar from '../systembar/systembar.js'
import MenuBar from '../menu-bar'
import Noticeboard from '../noticeboard/noticeboard'


class PageBase extends Component {
	render () {
		return (
			<div>
				<SystemBar />
				<MenuBar />
				<div className='row'>
					<div className='col-xs-12'>
						{this.props.children || 'dashboard-page'}
					</div>
				</div>
				<Noticeboard isBottomDisplay={false}/>
			</div>
		)
	}
}

export default PageBase

PageBase.propTypes = {
	children: React.PropTypes.string
}

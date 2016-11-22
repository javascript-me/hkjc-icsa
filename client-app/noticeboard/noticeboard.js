import React from 'react'
let isBottomDisplay = false
export default React.createClass({

	render () {
		if (isBottomDisplay) {
			return 	<div className="bottom-noticeboard-container">
				<div className="header-container">
				</div>
				<div className="messages-container">
				</div>
			</div>
		}
		return 	<div className="right-noticeboard-container">
			<div className="header-container">
			</div>
			<div className="messages-container">
			</div>
		</div>

	}
})

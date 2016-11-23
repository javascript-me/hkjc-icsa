import React from 'react'
let isBottomDisplay = false

export default React.createClass({


	render () {
		console.log("HELLO"+this.props.isBottomDisplay);
		if (this.props.isBottomDisplay) {
			return 	<div className="row bottom-noticeboard-container">
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

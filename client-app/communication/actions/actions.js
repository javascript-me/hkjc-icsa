import React from 'react'

export default React.createClass({
	propTypes: {
		sample: React.PropTypes.bool
	},

	getInitialState () {
		return {
			displaySettings: 'bottom',
			selectedSettings: ''
		}
	},
	componentDidMount: function async () {
	},
	render () {
		return (
			<div className="container-actions">
			</div>
		)
	}
})

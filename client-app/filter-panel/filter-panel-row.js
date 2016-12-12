import React from 'react'

export default React.createClass({
	displayName: 'FilterPanelRow',
	propTypes: {

	},
	getInitialState () {
		return {

		}
	},
	componentDidMount: function () {
	},

	componentWillUnmount: function () {

	},
	render: function () {
		let filterColumns = React.Children.map(this.props.children, column => {
			return <div className='col-sm-3 pd-w10'>
				{column}
			</div>
		})

		return <div className='row mg-w010'>
			{filterColumns}
		</div>
	}
})


import React from 'react'

const emptyFn = () => {}

export default React.createClass({
	displayName: 'FilterPanelRow',
	propTypes: {
		changeFilter: React.PropTypes.func,
		doPairingVerifyForFilter: React.PropTypes.func,
		registerColumnHandles: React.PropTypes.func
	},
	getDefaultProps: function () {
		return {
			doPairingVerifyForFilter: emptyFn,
			registerColumnHandles: emptyFn
		}
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
			return <div className='pd-w10'>
				{React.cloneElement(column, {
					onChange: this.props.changeFilter,
					doPairingVerify: this.props.doPairingVerifyForFilter,
					registerColumnHandles: this.props.registerColumnHandles
				})}
			</div>
		})

		return <div className='row mg-w010'>
			{filterColumns}
		</div>
	}
})


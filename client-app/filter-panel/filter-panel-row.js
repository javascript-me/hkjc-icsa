import React from 'react'

const emptyFn = () => {}

export default React.createClass({
	displayName: 'FilterPanelRow',
	propTypes: {
		changeFilter: React.PropTypes.func,
		doPairingVerifyForFilter: React.PropTypes.func,
		registerColumnHandles: React.PropTypes.func,
		children: React.PropTypes.arrayOf(React.PropTypes.node).isRequired
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
		let filterColumns = React.Children.map(this.props.children, (column, index) => {
			return <div className='pd-w10'>
				{React.cloneElement(column, {
					key: index,
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


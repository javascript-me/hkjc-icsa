import React from 'react'
import ProgressArc from '../progressArc/progressArc.d3'

export default React.createClass({
	displayName: 'Dashboard',
	interval: undefined,
	getInitialState () {
		return {
			percentComplete: 0
		}
	},
	componentDidMount () {
		this.interval = setInterval(() => {
			this.interval && this.setState({percentComplete: Math.random()})
		}, 500)
	},
	componentWillUnmount () {
		this.interval = clearInterval(this.interval)
	},
	render () {
		return (
			<div className='row row-dashboard'>
				<div className='col-xs-12'>
					<h1 style={{marginTop:'300px'}}>Dashboard</h1>
					
				</div>
			</div>
			)
	}
})

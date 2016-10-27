import React from 'react'
import ProgressArc from '../tmp/progressArc'

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
			<div className='page dashboard'>
				<h1>Hello Dashboard World!</h1>
				<ProgressArc
					height={300}
					width={300}
					innerRadius={100}
					outerRadius={110}
					id='d3-arc'
					backgroundColor='#e6e6e6'
					foregroundColor='#00ff00'
					percentComplete={this.state.percentComplete}
				/>
			</div>
			)
	}
})

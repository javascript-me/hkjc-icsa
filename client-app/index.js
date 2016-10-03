import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'

var Hello = React.createClass({
	render: () => {
		return React.createElement('div', null, 'Hello World')
	}
})

ReactDOM.render(
	React.createElement(Hello),
	document.getElementById('root')
)

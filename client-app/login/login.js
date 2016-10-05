import React from 'react'
import { Link } from 'react-router'

export default React.createClass({
	displayName: 'Login',
	render: () => {
		return (
			<div className='page login'>
				<h1><Link to='/dashboard'>Login</Link></h1>
				<a href='#/dashboard'>Anchor link</a>
			</div>
			)
	}
})

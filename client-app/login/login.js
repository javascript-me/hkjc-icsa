import React from 'react'
import { hashHistory } from 'react-router'

import LoginService from './login-service'

const doSubmit = async (username, password) => {
	const profile = await LoginService.doLogin(username, password)
	if (profile) {
		hashHistory.push('/page')
	}
}

export default React.createClass({
	displayName: 'Login',
	submit () {
		doSubmit(this.refs.username.value, this.refs.password.value)
	},
	render () {
		return (
			<div className='page-login'>
				<div className='row row-login'>
					<div className='login-dialog col-xs-offset-5 col-xs-2'>
						<div className='form-group form-group-lg'>
							<label htmlFor='usernamer'>Username</label>
							<input ref='username' type='text' className='form-control' id='login-username' placeholder='Username' />
						</div>
						<div className='form-group form-group-lg'>
							<label htmlFor='password'>Password</label>
							<input ref='password' type='password' className='form-control' id='login-password' placeholder='Password' />
						</div>
						<button type='submit' className='btn btn-lg btn-primary' onClick={this.submit}>Submit</button>
					</div>
				</div>
			</div>
			)
	}
})

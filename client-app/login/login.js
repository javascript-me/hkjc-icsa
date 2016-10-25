import React from 'react'
import { hashHistory } from 'react-router'

import LoginService from './login-service'

export default React.createClass({
	displayName: 'Login',
	submit: async function () {
		const $dialog = $(this.refs.dialog)
		const profile = await LoginService.doLogin($dialog.find('#login-username').val(), $dialog.find('#login-password').val())
		if (profile) {
			hashHistory.push('/dashboard')
		}
	},
	render: function () {
		return (
			<div className='page login container-fluid'>
				<div className='row row-1' />
				<div className='row row-2'>
					<div ref='dialog' className='login-dialog col-xs-offset-1 col-md-offset-3 col-lg-offset-5 col-xs-10 col-md-6 col-lg-2'>
						<div className='form-group form-group-lg'>
							<label htmlFor='usernamer'>Username</label>
							<input type='text' className='form-control' id='login-username' placeholder='Username' />
						</div>
						<div className='form-group form-group-lg'>
							<label htmlFor='password'>Password</label>
							<input type='password' className='form-control' id='login-password' placeholder='Password' />
						</div>
						<button type='submit' className='btn btn-lg btn-primary' onClick={this.submit}>Submit</button>
					</div>
				</div>
			</div>
			)
	}
})

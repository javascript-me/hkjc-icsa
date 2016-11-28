import React from 'react'
import { hashHistory } from 'react-router'

import LoginService from './login-service'
import Overlay from '../popup'

const doSubmit = async (username, password) => {
	const profile = await LoginService.doLogin(username, password)
	return profile
}

export default React.createClass({
	displayName: 'Login',
	getInitialState () {
		return {
			expired: false,
			locked: false,
			title: '',
			showPopup: true,
			confirmBtn: '',
			showCancel: false
		}
	},
	submit () {
		doSubmit(this.refs.username.value, this.refs.password.value).then((data) => {
			if (data && data.error) {
				this.setState({msg: data.error, showPopup: false})
				if (data.locked || data.expired) {
					this.refs.overlay.show()

					if (data.locked) {
						this.setState({locked: data.locked, title: 'Account Locked', showPopup: true, confirmBtn: 'Go to Login'})
					}
					if (data.expired) {
						this.setState({expired: data.expired, title: 'Password Expried', showPopup: true, confirmBtn: 'Confirm'})
					}
				}
			} else {
				hashHistory.push('/page')
			}
		})
	},
	changeType () {
		if (this.refs.password.type === 'password') {
			this.refs.password.type = 'text'
			this.refs.btn.text = 'hide'
		} else {
			this.refs.password.type = 'password'
			this.refs.btn.text = 'show'
			this.refs.password.value.replace(/./g, '*')
		}
	},
	gotoLogin () {
		window.location.href = '/'
	},
	render () {
		return (
			<div className='page-login'>
				<div className='row row-login'>
					<div className='login-dialog col-xs-offset-5'>
						<div className='comment'>
							<h2>Welcome</h2>
							<p>Sign in with your sport betting account</p>
						</div>
						<div className='form-field'>
							<div className='form-group form-group-lg'>
								<label htmlFor='usernamer'>Username</label>
								<input ref='username' type='text' className='form-control' id='login-username' placeholder='Username' />
							</div>
							<div className='form-group form-group-lg'>
								<label htmlFor='password'>Password</label>
								<input ref='password' type='password' className='form-control' id='login-password' placeholder='Password' />
								<a ref='btn' className='switch' href='javascript:void(0);' onClick={this.changeType}>show</a>
							</div>
							{ !this.state.showPopup ? <p className='error'>{this.state.msg}</p> : null }
							<button type='submit' className='btn btn-lg btn-primary' onClick={this.submit}>Login</button>
						</div>
					</div>
				</div>
				<Overlay hideOnOverlayClicked ref='overlay' title={this.state.title} showCancel={this.state.showCancel} onConfirm={() => this.gotoLogin()} confirmBtn={this.state.confirmBtn}>
					<p className='warning'>{this.state.msg}</p>
				</Overlay>
			</div>
			)
	}
})

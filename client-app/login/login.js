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
			showCancel: false,
			showMaskPwd: false,
			username: '',
			password: '',
			disabled: false
		}
	},
	componentDidMount () {
		$('input[type=text]').focus()
		if ($('input[type=password]').value !== '' && $('input[type=text]').value !== '') {
			this.setState({disabled: true})
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
	handleKeyUp (event) {
		if (event.keyCode === 13) {
			this.submit()
		}
		if (this.refs.username.value === '' || this.refs.password.value === '') {
			this.refs.submit.disabled = true
		} else {
			this.refs.submit.disabled = false
		}
		if (this.refs.password.value !== '') {
			this.setState({showMaskPwd: true})
		} else {
			this.setState({showMaskPwd: false})
		}
	},
	typeUsername (event) {
		this.setState({username: event.target.value})
	},
	typePwd (event) {
		this.setState({password: event.target.value})
	},
	clearPassword (event) {
		if (this.refs.password.value !== '') {
			this.setState({password: '', showMaskPwd: false, disabled: false})
		}
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
			<div className='row'>
				<div className='page-login'>
					<a className='logo'><img src='HKJC_Logo.svg' /><img src='HKJC_logo_text.svg' /></a>
					<div className='row row-login'>
						<div className='login-dialog'>
							<div className='comment'>
								<h2>Welcome</h2>
								<p>Sign in with your sport betting account</p>
							</div>
							<div className='form-field'>
								<div className='form-group form-group-lg'>
									<label htmlFor='usernamer'>User Name</label>
									<input ref='username' autoComplete='off' type='text' value={this.state.username} className='form-control' id='login-username' placeholder='User Name' onKeyUp={this.handleKeyUp} onChange={this.typeUsername} />
								</div>
								<div className='form-group form-group-lg'>
									<label htmlFor='password'>Password</label>
									<input ref='password' onFocus={this.clearPassword} value={this.state.password} type='password' className='form-control' id='login-password' placeholder='Password' onKeyUp={this.handleKeyUp} onChange={this.typePwd} />
									{this.state.showMaskPwd ? <a ref='btn' className='switch' href='javascript:void(0);' onClick={this.changeType}>show</a> : null}
								</div>
								{ !this.state.showPopup ? <p className='error'>{this.state.msg}</p> : null }
								<button ref='submit' type='submit' className='btn btn-lg btn-primary' onClick={this.submit} disabled={!this.state.disabled}>Login</button>
							</div>
						</div>
					</div>
					<Overlay hideOnOverlayClicked ref='overlay' title={this.state.title} showCancel={this.state.showCancel} onConfirm={() => this.gotoLogin()} confirmBtn={this.state.confirmBtn}>
						<p className='warning'>{this.state.msg}</p>
					</Overlay>
				</div>
			</div>
			)
	}
})

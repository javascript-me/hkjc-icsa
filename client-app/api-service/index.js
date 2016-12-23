import assign from 'object-assign'
import {EventEmitter} from 'events'
import LoginService from '../login/login-service'
import config from '../config'

const API = assign({}, EventEmitter.prototype, {

	async request (method, endpoint, params = {}, extra = {}) {
		try {
			let result = $.ajax({
				method: method,
				url: config.url(endpoint),
				data: params
			})

			this.emitChange(null, result, extra)
		} catch (failure) {
			this.emitChange(failure, null, extra)
		}
	},

	emitChange (error, promise, extra) {
		this.emit('change', error, promise, extra)
	},

	addListener (event, callback) {
		this.on(event, callback)
	},

	unsubscribeListener (event, callback) {
		this.removeListener(event, callback)
	},

	cleanParams (params) {
		let profile = LoginService.getProfile() || {}
		let requestData = {
			username: profile.username
		}

		Object.keys(params).map(i => {
			switch (typeof params[i]) {
			case 'string':
				requestData[i] = params[i]
				break
			case 'number':
				requestData[i] = params[i]
				break
			case 'object':
				if (Array.isArray(params[i])) {
					params[i].map(oi => {
						if (oi.name && oi.value) {
							requestData[oi.name] = oi.value
						} else {
							requestData = assign(requestData, oi)
						}
					})
				} else {
					Object.keys(params[i]).map(oi => {
						if (oi.name && oi.value) {
							requestData[oi.name] = oi.value
						} else {
							requestData = assign(requestData, oi)
						}
					})
				}

				break
			}
		})

		return requestData
	}

})

export default API

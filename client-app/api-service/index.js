import assign from 'object-assign'
import {EventEmitter} from 'events'
import LoginService from '../login/login-service'
import config from '../config'

const API = assign({}, EventEmitter.prototype, {

	async request (method, endpoint, params={}, extra={}) {
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
	}

})

export default API

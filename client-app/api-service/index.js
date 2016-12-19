import assign from 'object-assign'
import {EventEmitter} from 'events'
import LoginService from '../login/login-service'

const API = assign({}, EventEmitter.prototype, {

	async request (method, endpoint, params) {
		try {
			let result = $.ajax({
				method: method,
				url: endpoint,
				data: params
			})

			this.emitChange(null, result)
		} catch (failure) {
			this.emitChange(failure, null)
		}
	},

	emitChange (error, promise) {
		this.emit('change', error, promise)
	},

	addChangeListener (callback) {
		this.on('change', callback)
	},

	removeChangeListener (callback) {
		this.removeListener('change', callback)
	}

})

export default API

import assign from 'object-assign'
import {EventEmitter} from 'events'

const BroadcastsService = assign({}, EventEmitter.prototype, {
	broadCastsList: [],
	sendRequest (requestData) {
		return $.post('api/broadcast/all-broadcasts', requestData)
	},
	async getBroadcasts (username) {
		let requestData = {username: username}
		try {
			let result = await this.sendRequest(requestData)
			this.broadCastsList = result
			this.emitChange()
		} catch (failure) {
		}
	},
	emitChange () {
		this.emit('change')
	}
})

export default BroadcastsService

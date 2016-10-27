import _ from 'underscore'
import PubSub from '../pubsub'

let profile = null

export default {
	hasProfile () {
		return !!profile
	},
	async doLogin (username, password) {
		let result = null
		try {
			profile = await $.post('api/users/login', {username, password})
			result = this.getProfile()
			PubSub.publish(PubSub.LOGIN_CHANGE)
		} catch (failure) {
		}
		return result
	},
	getProfile () {
		return _.clone(profile)
	},
	logout () {
		profile = null
		PubSub.publish(PubSub.LOGIN_CHANGE)
	}
}

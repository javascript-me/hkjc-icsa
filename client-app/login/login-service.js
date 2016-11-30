import _ from 'underscore'
import PubSub from '../pubsub'

let profile = null

const postLogin = (data) => {
	return $.post('api/users/login', data)
}

const getProfile = () => {
	return _.clone(profile)
}

const getTasksNum = (data) => {
	return $.get('api/users/getTasks', data)
}

export default {
	hasProfile () {
		return !!profile
	},
	async doLogin (username, password) {
		let result = null
		try {
			profile = await postLogin({username, password})
			result = getProfile()
			PubSub.publish(PubSub.LOGIN_CHANGE)
		} catch (failure) {
			// returns null on failure
		}
		return result
	},
	getProfile () {
		return getProfile()
	},
	logout () {
		profile = null
		PubSub.publish(PubSub.LOGIN_CHANGE)
	},
	getTasksNum () {
		return getTasksNum()
	},
	access (feature, level) {
		const result = false
		for (let auth of (profile && profile.authorizations && profile.authorizations.legnth ? profile.authorizations : [])) {
			if (!auth) break // TODO
		}
		return result
	}
}

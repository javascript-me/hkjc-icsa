import _ from 'underscore'
import PubSub from '../pubsub'

let profile = null

const postLogin = (data) => {
	return $.post('api/users/login', data)
}

const getProfile = () => {
	return _.clone(profile)
}

const getUserinfo = (userId) => {
	return $.get('api/users/getUserinfo?userID=' + userId)
}

const getTasksNum = (data) => {
	return $.get('api/users/getTasks', data)
}

const postUpdateNoticeBoardSettings = (data) => {
	return $.post('api/users/updateNoticeBoardDisplaySettings', data)
}

const postUpdateTaskSettings = (data) => {
	return $.post('api/users/updateTaskDisplaySettings', data)
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
	async getUserinfo (userId) {
		let result = null
		try {
			result = await getUserinfo(userId)
		} catch (failure) {
			// returns null on failure
		}
		return result
	},
	getNoticeBoardSettings (profile) {
		profile = profile || getProfile()
		return (profile && profile.noticeboardSettings) ? profile.noticeboardSettings : {}
	},
	getTaskSettings (profile) {
		profile = profile || getProfile()
		return (profile && profile.taskSettings) ? profile.taskSettings : {}
	},

	async updateNoticeBoardSettings (username, display) {
		let result = null
		try {
			profile = await postUpdateNoticeBoardSettings({username, display})
			result = getProfile()
		} catch (failure) {

		}
		return result
	},

	async updateTaskSettings (username, display) {
		let result = null
		try {
			profile = await postUpdateTaskSettings({username, display})
			result = getProfile()
		} catch (failure) {

		}
		return result
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
	},
	updateProfile () {
		getProfile()
	}
}

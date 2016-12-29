import _ from 'underscore'
import PubSub from '../pubsub'
import Session from '../session'

let profile = Session.getProfile()

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

const postUpdateNoticeboardAndBroadcastSetting = (data) => {
	return $.post('api/users/updateNoticeboardAndBroadcastSetting', data)
}

const postUpdateTaskSetting = (data) => {
	return $.post('api/users/updateTaskSetting', data)
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
			Session.setProfile(result)
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
	getNoticeboardAndBroadcastSetting (profile) {
		profile = profile || getProfile()
		return (profile && profile.noticeboardAndBroadcastSetting) ? profile.noticeboardAndBroadcastSetting : {}
	},
	getTaskSetting (profile) {
		profile = profile || getProfile()
		return (profile && profile.taskSetting) ? profile.taskSetting : {}
	},

	async updateNoticeboardAndBroadcastSetting (username, position) {
		let result = null
		try {
			profile = await postUpdateNoticeboardAndBroadcastSetting({username, position})
			Session.setProfile(profile)
			result = getProfile()
		} catch (failure) {

		}
		return result
	},

	async updateTaskSetting (username, position) {
		let result = null
		try {
			profile = await postUpdateTaskSetting({username, position})
			Session.setProfile(profile)
			result = getProfile()
		} catch (failure) {

		}
		return result
	},

	logout () {
		profile = null
		Session.setProfile(null)
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

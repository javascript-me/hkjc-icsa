import config from '../config'

const getUserProfile = (userId) => {
	return $.get(config.url('api/userprofile/item?userID=' + userId))
}

const postUserProfile = (data) => {
	return $.post(config.url('api/userprofile/update'), data)
}

const getRoles = () => {
	return $.get(config.url('api/roles/list'))
}
const postUserDelegation = (userId, data) => {
	return $.post(config.url('api/userprofile/updateDelegation?userID=' + userId), data)
}

export default {
	async getUserProfile (userId) {
		let result = null
		try {
			result = await getUserProfile(userId)
		} catch (failure) {
			// returns null on failure
		}
		return result
	},
	async updateUserProfile (data) {
		let result = null
		try {
			result = await postUserProfile(data)
		} catch (failure) {
			// returns null on failure
		}
		return result
	},
	async updateUserDelegation (userId, data) {
		let result = null
		try {
			result = await postUserProfile(userId, data)
		} catch (failure) {
			// returns null on failure
		}
		return result
	},
	async getRoles () {
		let result = []
		try {
			result = await getRoles()
		} catch (failure) {
			// returns [] on failure
		}
		return result
	},
	postUserDelegation
}

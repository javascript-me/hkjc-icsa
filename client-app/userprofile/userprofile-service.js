import config from '../config'

const postUserProfile = (data) => {
	return $.post(config.url('api/userprofile/item'), data)
}

const getDelegations = (userId) => {
	return $.get(config.url('api/userprofile/getDelegation?userID=' + userId))
}

const postUpdateUserProfile = (data) => {
	return $.post(config.url('api/userprofile/update'), data)
}

const postDeleteDelegation = (data) => {
	return $.post(config.url('api/userprofile/deleteDelegation'), data)
}

const getRoles = () => {
	return $.get(config.url('api/roles/list'))
}
const postUserDelegation = (userId, data) => {
	return $.post(config.url('api/userprofile/updateDelegation?userID=' + userId), data)
}

export default {
	async getUserProfile (data) {
		let result = null
		try {
			result = await postUserProfile(data)
		} catch (failure) {
			// returns null on failure
		}
		return result
	},
	async getDelegations (userId) {
		let result = null
		try {
			result = await getDelegations(userId)
		} catch (failure) {
			// returns null on failure
		}
		return result
	},
	async updateUserProfile (data) {
		let result = null
		try {
			result = await postUpdateUserProfile(data)
		} catch (failure) {
			// returns null on failure
		}
		return result
	},

	async deleteDelegation (data) {
		let result = null
		try {
			result = await postDeleteDelegation(data)
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

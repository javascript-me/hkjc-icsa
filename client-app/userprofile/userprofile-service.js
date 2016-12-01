import config from '../config'

const getUserProfile = (userId) => {
	return $.get(config.url('api/userprofile/item?userID=' + userId))
}

const getRoles = () => {
	return $.get(config.url('api/roles/list'))
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
	async getRoles () {
		let result = []
		try {
			result = await getRoles()
		} catch (failure) {
			// returns [] on failure
		}
		return result
	}
}

import config from '../config'

const getUserProfile = (userId) => {
	return $.get(config.url('api/userprofile/item?userID=' + userId))
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
	}
}

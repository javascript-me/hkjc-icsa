import _ from 'underscore'

let profile = null

export default {
	hasProfile () {
		console.log(profile)
		return !!profile
	},
	doLogin: async function (username, password) {
		let result = null
		try {
			profile = await $.post('api/users/login', {username, password})
			result = this.getProfile()
		} catch (failure) {
		}
		return result
	},
	getProfile () {
		return _.clone(profile)
	},
	logout () {
		profile = null
	}
}

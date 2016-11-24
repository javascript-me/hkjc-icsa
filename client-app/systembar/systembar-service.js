import config from '../config'

const getClock = (data) => {
	return $.get(config.url('api/clock'), data)
}

export default {
	async getClock () {
		let result = null
		try {
			result = await getClock()
		} catch (failure) {

		}
		return result
	}
}

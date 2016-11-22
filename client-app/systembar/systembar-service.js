const getClock = (data) => {
	return $.get('api/clock', data)
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

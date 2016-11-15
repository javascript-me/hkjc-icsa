const getClock = (data) => {
	return $.get('api/clock/getTime', data)
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

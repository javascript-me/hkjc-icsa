import config from '../config'

const postSearch = (data) => {
	return $.post(config.url('api/eventdirectory/search/football'), data)
}

export default {
	async getEventDirectoryResult (searchParam) {
		let result = null
		try {
			result = await postSearch(searchParam)
		} catch (failure) {
			// returns null on failure
		}
		return result
	},
	async getFootballAutosuggestions () {
		return await $.get(config.url('api/eventdirectory/autosugestion/football'))
	}
}

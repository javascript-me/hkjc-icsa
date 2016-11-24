import config from '../config'

const postSearch = (data) => {
	return $.post(config.url('api/eventdirectory'), data)
}

export default {
	async getEventDirectoryFilter () {
		let result = {
			scenario: {
				options: ['All', 'Assigned', 'In-Play', 'Archive', 'Today', 'Pre-Event', 'Prelim', 'Defined', 'Major'],
				default: 'Assigned'
			},
			competition: {
				options: ['All', 'Premier', 'FA Cup', 'League Cup', 'Championship'],
				default: 'All'
			}
		}

		return result
	},
	async getEventDirectoryResult (searchParam) {
		let result = null
		try {
			result = await postSearch(searchParam)
		} catch (failure) {
			// returns null on failure
		}
		return result
	}
}

import config from '../../config'

let noticeBoardList = null

const getNoticeBoardList = (data) => {
	let url = config.url('api/notice-board/')

	data.temp = Math.random()
	return $.get(url, data)
}

const getNoticeBoardListAndUpdateAcknowledgeStatusById = (data) => {
	let url = config.url('api/notice-board/update-acknowledge-status/')
	return $.post(url, data)
}

const getRemindCount = (data) => {
	let url = config.url('api/notice-board/remind-count/')

	data.temp = Math.random()
	return $.get(url, data)
}

const getTipsNum = (data) => {
	let url = config.url('api/notice-board/notice-tips/')

	data.temp = Math.random()
	return $.get(url, data)
}

export default {
	async getNotices (username) {
		let result = null

		try {
			noticeBoardList = await getNoticeBoardList({username: username})
			result = noticeBoardList
		} catch (failure) {
			// returns null on failure
			result = null
		}
		return result
	},

	async getNoticesAndUpdateAcknowledgeStatusById (username, id, command) {
		let result = null

		try {
			noticeBoardList = await getNoticeBoardListAndUpdateAcknowledgeStatusById(
				{username: username, id: id, command: command}
			)
			result = noticeBoardList
		} catch (failure) {
			// returns null on failure
			result = null
		}
		return result
	},

	async getRemindCount (username) {
		let responseData = null
		let noticeCount = 0

		try {
			responseData = await getRemindCount({username: username})
			noticeCount = responseData.count || 0
		} catch (failure) {
			// returns null on failure
			noticeCount = 0
		}
		return noticeCount
	},

	async getTipsNum (username) {
		let responseData = null
		let tipsCount = 0

		try {
			responseData = await getTipsNum({username: username})
			tipsCount = responseData.count || 0
		} catch (failure) {
			// returns null on failure
			tipsCount = 0
		}
		return tipsCount
	}
}

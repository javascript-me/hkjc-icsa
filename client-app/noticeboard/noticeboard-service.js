import config from '../config'

let noticeBoardList = null

const getNoticeBoardList = (data) => {
	let url = config.url('api/notice-board/')
	return $.get(url, data)
}

export default {
	async getNotices (username) {
		let result = null

		try {
			noticeBoardList = await getNoticeBoardList({username: username})
			result = noticeBoardList
		}
		catch(failure) {
			// returns null on failure
			result = null
		}
		return result
	}
}

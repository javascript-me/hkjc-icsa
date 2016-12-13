import config from '../config'

const getExportURL = (query) => {
	return config.url('api/auditlog/export') + query
}
const getNoticeboardExportURL = (query) => {
	return config.url('api/notice-board/export') + query
}

export default {
	getFileURL (format, filters = []) {
		const json = filters ? encodeURIComponent(JSON.stringify(filters)) : ''
		const query = (json.length > 0 ? '?json=' + json + '&' : '?') + 'type=' + format
		return getExportURL(query)
	},
	getNoticeboardFileURL (format, filters = []) {
		const json = filters ? encodeURIComponent(JSON.stringify(filters)) : ''
		const query = (json.length > 0 ? '?json=' + json + '&' : '?') + 'type=' + format
		return getNoticeboardExportURL(query)
	}
}

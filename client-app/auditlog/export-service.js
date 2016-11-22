import config from '../config'

const getExportURL = (query) => {
	return config.get('API_URL') + '/api/auditlog/export' + query
}

export default {

	getFileURL (format, filters = []) {
		const json = filters ? encodeURIComponent(JSON.stringify(filters)) : ''
		const query = (json.length > 0 ? '?json=' + json + '&' : '?') + 'type=' + format
		return getExportURL(query)
	}
}

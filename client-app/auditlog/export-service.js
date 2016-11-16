import _ from 'underscore'
import PubSub from '../pubsub'
import config from '../config'

let profile = null

const postLogin = (data) => {
	return $.post(config.get('API_URL') + '/api/users/login', data)
}

const getExportURL = (query) => {
	return config.get('API_URL') + '/api/auditlog/export' + query
}

export default {

	getFileURL (format, filters = []) {
		const query = (filters.length > 0 ? '?' + filters + '&' : '?') + 'type=' + format
		return getExportURL(query)
	}
}

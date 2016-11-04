import _ from 'lodash'

const domain = typeof window !== 'undefined' ? window.location.hostname : ''

const merge = (config) => {
	const result = config.default
	for (let url in config.override) {
		if (domain.match(new RegExp(url))) {
			_.merge(result, config.override[url])
		}
	}
	return result
}

const config = merge(require('./config.json'))

const get = (key) => {
	let result = config
	for (let field of key.split('.')) {
		result = field.length ? result[field] : result
	}
	return _.clone(result)
}

const is = (key) => {
	return !!get(key)
}

export default {
	get (key = '') {
		return get(key)
	},
	is (key = '') {
		return is(key)
	},
	has (key = '') {
		return is(key)
	},
	can (key = '') {
		return is(key)
	},
	url (url = '') {
		const base = config.url
		if (base.endsWith('/') && url.startsWith('/')) {
			url = url.substring(1)
		}
		return base + url
	}
}

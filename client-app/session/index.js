const VALUES = {
	PROFILE: 'USER_PROFILE',
	ED_SEARCH_FILTER: 'ED_SEARCH_FILTER'
}

const setItem = (key, value) => {
	if (!window.sessionStorage) return
	if (typeof value !== 'string') value = JSON.stringify(value)
	window.sessionStorage.setItem(key, value)
}

const getItem = (key) => {
	if (!window.sessionStorage) return ''
	let value = window.sessionStorage.getItem(key)
	if (value) {
		try { value = JSON.parse(value) } catch (e) {}
	}
	return value
}

export default {
	getProfile () {
		return getItem(VALUES.PROFILE)
	},
	setProfile (profile) {
		return setItem(VALUES.PROFILE, profile)
	},
	getItem: getItem,
	setItem: setItem,
	clear () {
		if (!window.sessionStorage) return
		window.sessionStorage.clear()
	},
	VALUES: VALUES
}

import PubSub from 'pubsub-js'

const tokens = [
	'LOGIN_CHANGE',
	'AUDITLOG_SEARCH',
	'AUDITLOG_SEARCH_BY_KEY_PRESS',
	'AUDITLOG_SEARCH_BY_REMOVE_FILTER',
	'AUDITLOG_SEARCH_BY_RESET_FILTERS',
	'FliterRefreshEvent',
	'USERPROFILE_SEARCH',
	'USERPROFILE_SEARCH_BY_KEY_PRESS',
	'USERPROFILE_SEARCH_BY_REMOVE_FILTER'
]

for (const token of tokens) {
	PubSub[token] = token.replace('_', '.').toLowerCase()
}

export default PubSub

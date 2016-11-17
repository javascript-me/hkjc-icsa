import PubSub from 'pubsub-js'

const tokens = [
	'LOGIN_CHANGE',
	'AUDITLOG_SEARCH',
	'AUDITLOG_SEARCH_BY_KEY_PRESS',
	'AUDITLOG_SEARCH_BY_REMOVE_FILTER'
]

for (const token of tokens) {
	PubSub[token] = token.replace('_', '.').toLowerCase()
}

export default PubSub

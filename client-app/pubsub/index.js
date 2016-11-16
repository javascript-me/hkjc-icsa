import PubSub from 'pubsub-js'

const tokens = [
	'LOGIN_CHANGE',
	'AUDITLOG_SEARCH',
	'AUDITLOG_SEARCH_BY_KEY_PRESS'
]

for (const token of tokens) {
	PubSub[token] = token.replace('_', '.').toLowerCase()
}

export default PubSub

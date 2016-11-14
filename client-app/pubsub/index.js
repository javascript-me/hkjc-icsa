import PubSub from 'pubsub-js'

const tokens = [
	'LOGIN_CHANGE',
	'AUDIT_FILTERS_CHANGE',
	'AUDITLOG_BET_TYPE_CHANGE',
	'AUDITLOG_REMOVE_FILTER'
]

for (const token of tokens) {
	PubSub[token] = token.replace('_', '.').toLowerCase()
}

export default PubSub

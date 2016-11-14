import PubSub from 'pubsub-js'

const tokens = [
	'LOGIN_CHANGE',
	'AUDIT_FILTERS_CHANGE'
]

for (const token of tokens) {
	PubSub[token] = token.replace('_', '.').toLowerCase()
}

export default PubSub

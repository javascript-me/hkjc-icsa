let config = {}

config.API_BASE_URL = 'http://localhost'
config.API_BASE_PORT = 8282
config.API_URL = config.API_BASE_URL + ':' + config.API_BASE_PORT
config.CLIENT_URL = 'http://localhost:8282'

config.client = {
	'countries': ['China', 'Hong Kong', 'Macau']
}

module.exports = config

import _ from 'underscore'
import PubSub from '../pubsub'

const datas = require('./search-fields.json')

export default {
	getData () {
		return datas;
	}
}

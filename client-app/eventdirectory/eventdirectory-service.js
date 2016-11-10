// import _ from 'underscore'
// import PubSub from '../pubsub'

export default {
	async getEventDirectoryFilter () {
		let result = {
			scenario: {
				options: ['All', 'Assigned', 'In-Play', 'Archive', 'Today', 'Pre-Event', 'Prelim', 'Defined', 'Major'],
				default: 'Assigned'
			},
			competition: {
				options: ['All', 'Premier', 'FA Cup', 'League Cup', 'Championship'],
				default: 'All'
			}
		}

		return result
	},
	async getEventDirectoryResult () {
		let result = {
			test: 'result'
		}

		return result
	}
}

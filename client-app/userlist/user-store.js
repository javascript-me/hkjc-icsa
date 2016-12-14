import assign from 'object-assign'
import {EventEmitter} from 'events'
import Moment from 'moment'
import LoginService from '../login/login-service'

function formatTime (time) {
	if (!time) {
		return ''
	}

	return Moment(time, 'DD MMM YYYY HH:mm').format('DD/MM/YYYY')
}

const UserStore = assign({}, EventEmitter.prototype, {

	_sortingObject: null,
	_criteriaOption: null,

	pageData: {
		pages: [],
		totalPages: 0
	},
	userProfiles: [],

	sendRequest (requestData) {
		return $.post('api/userprofile/list', requestData)
	},

	async searchUsers (criteriaOption) {
		let requestData = this.buildRequest(criteriaOption)

		try {
			let result = await this.sendRequest(requestData)

			this.userProfiles = result
			this.emitChange()
		} catch (failure) {}
	},

	buildRequest (criteriaOption) {
		if (criteriaOption) {
			this._criteriaOption = criteriaOption
		}

		let profile = LoginService.getProfile() || {}
		let requestData = {
			username: profile.username,
			keyword: this._criteriaOption ? this._criteriaOption.keyword : ''
		}

		let filters = (this._criteriaOption && this._criteriaOption.filters) ? this._criteriaOption.filters : []

		for (let i in filters) {
			let value = filters[i].value
			if (filters[i].name === 'dateTimeFrom' || filters[i].name === 'dateTimeTo') {
				value = formatTime(value)
			}
			requestData[filters[i].name] = value
		}

		return requestData
	},

	emitChange () {
		this.emit('change')
	},

	addChangeListener (callback) {
		this.on('change', callback)
	},

	removeChangeListener (callback) {
		this.removeListener('change', callback)
	}

})

export default UserStore

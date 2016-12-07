import assign from 'object-assign'
import {EventEmitter} from 'events'
import LoginService from '../login/login-service'

const AuditlogStore = assign({}, EventEmitter.prototype, {

	_sortingObject: null,
	_criteriaOption: null,

	pageData: {
		pages: [],
		totalPages: 0
	},
	auditlogs: [],

	sendRequest (requestData) {
		return $.post('api/auditlog/filterAuditlogs', requestData)
	},

	async searchAuditlogs ( criteriaOption ) {
		let requestData = this.buildRequest( criteriaOption )

		try {
			let result = await this.sendRequest(requestData)

			this.pageData = result.pageData
			this.auditlogs = result
			this.emitChange()
		} catch (failure) {}
	},

	buildRequest ( criteriaOption ) {
		if (criteriaOption) {
			this._criteriaOption = criteriaOption
		}

		let profile = LoginService.getProfile() || {}
		let requestData = {
			username: profile.username,
			betType: this._criteriaOption ? this._criteriaOption.betType : '',
			keyword: this._criteriaOption ? this._criteriaOption.keyword : ''
		}

		let filters = (this._criteriaOption && this._criteriaOption.filters) ? this._criteriaOption.filters : []

		for (let i in filters) {
			requestData[filters[i].name] = filters[i].value
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

export default AuditlogStore

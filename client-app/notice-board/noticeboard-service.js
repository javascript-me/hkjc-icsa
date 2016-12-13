import assign from 'object-assign'
import {EventEmitter} from 'events'
import LoginService from '../login/login-service'

const NoticeboardService = assign({}, EventEmitter.prototype, {
	noticesList: [],
	categoriesList: [],
	competitionsList: [],
	continentsList: [],
	countriesList: [],
	inplaysList: [],
	matchesList: [],
	prioritiesList: [],
	sportsList: [],
	statusesList: [],

	sendRequest (requestData) {
		return $.post('api/notice-board/filterNoticeBoardTableData', requestData)
	},
	async filterNoticeBoardTableData (criteriaOption) {
		let requestData = this.buildRequest(criteriaOption)
		try {
			let result = await this.sendRequest(requestData)
			this.noticesList = result

			this.emitChange()
		} catch (failure) {
		}
	},
	async getAllCategories () {
		try {
			let result = await this.sendRequestToGetList('api/notice-board/categories')
			this.categoriesList = result

			this.emitChange()
		} catch (failure) {
		}
	},
	async getAllCompetitions () {
		try {
			let result = await this.sendRequestToGetList('api/notice-board/competitions')
			this.competitionsList = result

			this.emitChange()
		} catch (failure) {
		}
	},
	async getAllCountries () {
		try {
			let result = await this.sendRequestToGetList('api/notice-board/countries')
			this.countriesList = result

			this.emitChange()
		} catch (failure) {
		}
	},
	async getAllContinents () {
		try {
			let result = await this.sendRequestToGetList('api/notice-board/continents')
			this.continentsList = result

			this.emitChange()
		} catch (failure) {
		}
	},
	async getAllInplays () {
		try {
			let result = await this.sendRequestToGetList('api/notice-board/inplays')
			this.inplaysList = result

			this.emitChange()
		} catch (failure) {
		}
	},
	async getAllMatches() {
		try {
			let result = await this.sendRequestToGetList('api/notice-board/matches')
			this.matchesList = result

			this.emitChange()
		} catch (failure) {
		}
	},
	async getAllPriorities () {
		try {
			let result = await this.sendRequestToGetList('api/notice-board/priorities')
			this.prioritiesList = result

			this.emitChange()
		} catch (failure) {
		}
	},
	async getAllSports () {
		try {
			let result = await this.sendRequestToGetList('api/notice-board/sports')
			this.sportsList = result

			this.emitChange()
		} catch (failure) {
		}
	},
	async getAllStatuses () {
		try {
			let result = await this.sendRequestToGetList('api/notice-board/statuses')
			this.statusesList = result

			this.emitChange()
		} catch (failure) {
		}
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
	},

	sendRequestToGetList(requestURL){
		return $.get(requestURL)
	}

})

export default NoticeboardService


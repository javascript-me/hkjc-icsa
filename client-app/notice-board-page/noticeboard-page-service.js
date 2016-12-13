import assign from 'object-assign'
import {EventEmitter} from 'events'
import LoginService from '../login/login-service'

const NoticeboardService = assign({}, EventEmitter.prototype, {

	noticesList: [],
	categoriesList:[],
	competitionsList:[],
	continentsList:[],
	countriesList:[],
	inplaysList:[],
	matchesList:[],
	prioritiesList:[],
	sportsList:[],
	statusesList:[],


	sendRequest (requestData) {
		return $.post('api/notice-board/filterNoticeBoardTableData', requestData)
	},
	/*This function will accept these parameters
	 * selectedPageNumber, sortingObject, criteriaOption*/
	async filterNoticeBoardTableData () {
		let requestData = this.buildRequest()
		try {
			let result = await this.sendRequest(requestData)
			this.noticesList = result
			console.log(this.noticesList)
			this.emitChange()
		} catch (failure) {
		}
	},
	async getAllCategories () {
		try {
			let result = await this.sendRequestToGetList('api/notice-board/categories')
			this.categoriesList = result
			console.log(this.categoriesList)
			this.emitChange()
		} catch (failure) {
		}
	},
	async getAllCompetitions () {
		try {
			let result = await this.sendRequestToGetList('api/notice-board/competitions')
			this.competitionsList = result
			console.log(this.competitionsList)
			this.emitChange()
		} catch (failure) {
		}
	},
	async getAllCountries () {
		try {
			let result = await this.sendRequestToGetList('api/notice-board/countries')
			this.countriesList = result
			console.log(this.countriesList)
			this.emitChange()
		} catch (failure) {
		}
	},
	async getAllContinents () {
		try {
			let result = await this.sendRequestToGetList('api/notice-board/continents')
			this.continentsList = result
			console.log(this.continentsList)
			this.emitChange()
		} catch (failure) {
		}
	},
	async getAllInplays () {
		try {
			let result = await this.sendRequestToGetList('api/notice-board/inplays')
			this.inplaysList = result
			console.log(this.inplaysList)
			this.emitChange()
		} catch (failure) {
		}
	},
	async getAllMatches() {
		try {
			let result = await this.sendRequestToGetList('api/notice-board/matches')
			this.matchesList = result
			console.log(this.matchesList)
			this.emitChange()
		} catch (failure) {
		}
	},
	async getAllPriorities () {
		try {
			let result = await this.sendRequestToGetList('api/notice-board/priorities')
			this.prioritiesList = result
			console.log(this.prioritiesList)
			this.emitChange()
		} catch (failure) {
		}
	},
	async getAllSports () {
		try {
			let result = await this.sendRequestToGetList('api/notice-board/sports')
			this.sportsList = result
			console.log(this.sportsList)
			this.emitChange()
		} catch (failure) {
		}
	},
	async getAllStatuses () {
		try {
			let result = await this.sendRequestToGetList('api/notice-board/statuses')
			this.statusesList = result
			console.log(this.statusesList)
			this.emitChange()
		} catch (failure) {
		}
	},
	buildRequest () {
		let profile = LoginService.getProfile() || {}
		let requestData = {
			username: profile.username
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
	/**/


	sendRequestToGetList(requestURL){
		return $.get(requestURL)
	}

})

export default NoticeboardService


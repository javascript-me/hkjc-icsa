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
	async getAllCategories () {
		try {
			let result = await this.sendRequestToGetList('api/notice-board/categories')
			this.categoriesList = result
			console.log(this.categoriesList)
			this.emitChange()
		} catch (failure) {
		}
	},
	sendRequestToGetList(requestURL){
		return $.get(requestURL)
	}

})

export default NoticeboardService


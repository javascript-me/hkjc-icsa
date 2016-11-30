import assign from 'object-assign'
import {EventEmitter} from 'events'
import LoginService from '../login/login-service'

const UserStore = assign({}, EventEmitter.prototype, {

	_sortingObject: null,
	_criteriaOption: null,

	pageData: {
		pages: [],
		totalPages: 0
	},
	userProfiles: [
		{
			"id":"id002",
			"firstName":"Albert",
			"displayName":"Albert Choi",
			"userID":"JC10002",
			"position":"Sr. Trader",
			"staffID":"0000002",
			"status": "Active",
		    "assignedUserRoles": [{
		      "assignedUserRole": "Trader"
		    }],
		    "activationDate": "16/06/2016",
		    "deactivationDate": "16/06/2017",
		},
		{
			"id":"id003",
			"firstName":"Mike",
			"displayName":"Mike Wang",
			"userID":"JC10003",
			"position":"Trader",
			"staffID":"0000003",
			"status": "Active",
		    "assignedUserRoles": [{
		      "assignedUserRole": "Trader"
		    }],
		    "activationDate": "16/06/2016",
		    "deactivationDate": "16/06/2017",
		},
	],

	sendRequest (requestData) {
		return $.post('api/userprofile/list', requestData)
	},

	async searchAuditlogs (selectedPageNumber, sortingObject, criteriaOption) {
		let requestData = this.buildRequest(selectedPageNumber, sortingObject, criteriaOption)

		try {
			let result = await this.sendRequest(requestData)

			this.pageData = result.pageData
			this.userProfiles = result.auditlogs
			this.emitChange()
		} catch (failure) {}
	},

	buildRequest (selectedPageNumber, sortingObject, criteriaOption) {
		if (sortingObject) {
			this._sortingObject = sortingObject
		}

		if (criteriaOption) {
			this._criteriaOption = criteriaOption
		}

		let profile = LoginService.getProfile() || {}
		let requestData = {
			username: profile.username,
			selectedPageNumber: selectedPageNumber,
			sortingObjectFieldName: this._sortingObject.fieldName,
			sortingObjectOrder: this._sortingObject.order,
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

export default UserStore

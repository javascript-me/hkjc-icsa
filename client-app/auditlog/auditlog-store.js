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
	auditlogs: [
		{
			'date_time': '23 September 2016',
			'user_id': 'candy.crush',
			'user_name': 'Candy Crush',
			'Type': 'Odds',
			'function_module': 'Master Risk Limit Log',
			'function_event_detail': 'Update Odds',
			'user_role': 'Role1, Role2',
			'ip_address': '182.34.2.192'
		},
		{
			'date_time': '23 September 2016',
			'user_id': 'candy.crush',
			'user_name': 'Candy Crush',
			'Type': 'Odds',
			'function_module': 'Master Risk Limit Log',
			'function_event_detail': 'Update Odds',
			'user_role': 'Role1, Role2',
			'ip_address': '182.34.2.192'
		}
	],
	forDebug: null,

	searchAuditlogs (selectedPageNumber, sortingObject, criteriaOption) {
		const requestData = this.buildRequest(selectedPageNumber, sortingObject, criteriaOption)
		let self = this

		$.ajax({
			url: 'api/auditlog/filterAuditlogs',
			data: requestData,
			type: 'POST',

			success: function (data) {
				self.pageData = data.pageData
				self.auditlogs = data.auditlogs
				self.forDebug = data.forDebug
				self.emitChange()
			},
			error: function (xhr, status, error) {
			}
		})
	},

	buildRequest (selectedPageNumber, sortingObject, criteriaOption) {
		if (sortingObject) {
			this._sortingObject = sortingObject
		}

		if (criteriaOption) {
			this._criteriaOption = criteriaOption
		}

		let profile = LoginService.getProfile() || {},
			requestData = {
			username: profile.username,
			selectedPageNumber: selectedPageNumber,
			sortingObjectFieldName: this._sortingObject.fieldName,
			sortingObjectOrder: this._sortingObject.order,
			betType: this._criteriaOption ? this._criteriaOption.betType : '',
			keyword: this._criteriaOption ? this._criteriaOption.keyword : ''
		}

		let filters = (this._criteriaOption && this._criteriaOption.filters) ? this._criteriaOption.filters : []

        // Fill the filters into reuqest data
		for (let i in filters) {
			let filterName = filters[i].name
			let filterVal = filters[i].value
			requestData[filterName] = filterVal
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

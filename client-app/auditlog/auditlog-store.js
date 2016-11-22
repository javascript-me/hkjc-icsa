import assign from 'object-assign'
import {EventEmitter} from 'events'
import LoginService from '../login/login-service'

const AuditlogStore = assign({}, EventEmitter.prototype, {

	_sortingObject: null,
	_criteriaOption: null,

	pageData: null,
	auditlogs: null,
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

		let requestData = {
			username: LoginService.getProfile().username,
			selectedPageNumber: selectedPageNumber,
			sortingObjectFieldName: this._sortingObject.fieldName,
			sortingObjectOrder: this._sortingObject.order,
			betType: this._criteriaOption ? this._criteriaOption.betType : '',
			keyword: this._criteriaOption ? this._criteriaOption.keyword : ''
		}

		let filters = (this._criteriaOption && this._criteriaOption.filters) ? this._criteriaOption.filters : []
		let filterName = ''
		let filterVal = ''

        // Fill the filters into reuqest data
		for (let i in filters) {
			filterName = filters[i].name
			filterVal = filters[i].value
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

import assign from 'object-assign'
import {EventEmitter} from 'events'

const AuditlogStore = assign({}, EventEmitter.prototype, {

	_criteriaOption: null,
	_sortingObject: null,

	pageData: null,
	auditlogs: null,
	forDebug: null,

	getDataByPageNumber (selectedPageNumber, sortingObject, criteriaOption) {
		if (criteriaOption) {
			this._criteriaOption = criteriaOption
		}

		if (sortingObject) {
			this._sortingObject = sortingObject
		}

		let self = this,
			requestData = {
				selectedPageNumber: selectedPageNumber,
				sortingObjectFieldName: this._sortingObject.fieldName,
				sortingObjectOrder: this._sortingObject.order,
				betType: this._criteriaOption ? this._criteriaOption.betType : '',
				keyword: this._criteriaOption ? this._criteriaOption.keyword : ''
			},
			filters = (this._criteriaOption && this._criteriaOption.filters) ? this._criteriaOption.filters : [],
			filterName, filterVal

        // Fill the filters into reuqest data
		for (let i in filters) {
			filterName = filters[i].name
			filterVal = filters[i].value
			requestData[filterName] = filterVal
		}

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
				console.log('Error: ' + error.message)
			}
		})
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

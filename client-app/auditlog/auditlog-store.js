import assign from 'object-assign'
import {EventEmitter} from 'events'

const AuditlogStore = assign({}, EventEmitter.prototype, {

    pageData: null,
    auditlogs: null,
    forDebug: null,

    getDataByPageNumber (selectedPageNumber, sortingObject) {
        var self = this

        $.ajax({

            url: 'api/auditlog/filterAuditlogs',
            data: {
                selectedPageNumber:selectedPageNumber,
                sortingObjectFieldName:sortingObject.fieldName,
                sortingObjectOrder:sortingObject.order
            },
            type: 'POST',

            success: function (data) {
                self.pageData = data.pageData
                self.auditlogs = data.auditlogs
                self.forDebug = data.forDebug
                self.emitChange()
            },
            error: function (xhr, status, error) {
                console.log('Error: ' + error.message);
            },
        });
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

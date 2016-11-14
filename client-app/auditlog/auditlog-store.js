import PagingService from '../paging/paging-service'
import assign from 'object-assign';
import {EventEmitter} from 'events';

const AuditlogStore = assign({}, EventEmitter.prototype, {

    pageData: PagingService.getDataByPageNumber(1),

    getDataByPageNumber (selectedPageNumber) {
        this.pageData = PagingService.getDataByPageNumber(selectedPageNumber)
        this.emitChange()
    },

    emitChange() {
        this.emit('change');
    },

    addChangeListener(callback) {
        this.on('change', callback);
    },

    removeChangeListener(callback) {
        this.removeListener('change', callback);
    }

})

export default AuditlogStore;
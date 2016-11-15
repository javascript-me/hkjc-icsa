import _ from 'underscore'
import PubSub from '../pubsub'

export default {
	 
	doFilter(filters, pagenumber) {
        return $.get('api/auditlog/filterAuditlogs', filters, pagenumber)
    }
}

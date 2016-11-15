import _ from 'underscore'
import PubSub from '../pubsub'

let auditlogsResponse = null

const postSearchCriteria = (data) => {
	return $.get('api/auditlogs/filterAuditlogs', data)
}

export default {
	 async doFilter (filters, pagenumber) {
		try {
			auditlogsResponse = await postSearchCriteria({filters, pagenumber})
			
		} catch (failure) {
			// returns null on failure
		}
		return auditlogsResponse
	}
}

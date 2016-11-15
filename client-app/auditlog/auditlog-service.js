import _ from 'underscore'
import PubSub from '../pubsub'

let auditlogsResponse = null

const postSearchCriteria = (data) => {
	return $.get('api/auditlog/filterAuditlogs', data)
}

export default {
	 async doFilter (filters, pagenumber) {
		try {
			auditlogsResponse = await postSearchCriteria({filters, pagenumber})
			/*We can publish Event
			PubSub.publish(PubSub.AUDITLOGEARCH_CHANGE)*/
		} catch (failure) {
			// returns null on failure
		}
		 console.log(auditlogsResponse)
		return auditlogsResponse
	},

}

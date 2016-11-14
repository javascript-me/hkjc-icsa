import _ from 'underscore'
import PubSub from '../pubsub'

let auditlogsResponse = null

const postSearchCriteria = (data) => {
	return $.post('api/auditlog/filterAuditlogs', data)
}

export default {
	 doFilter (searchtext, filters[], pagenumber) {
		try {
			auditlogsResponse = await postSearchCriteria({searchtext, filters[], pagenumber})
			/*We can publish Event
			PubSub.publish(PubSub.AUDITLOGEARCH_CHANGE)*/
		} catch (failure) {
			// returns null on failure
		}
		return auditlogsResponse
	}
}

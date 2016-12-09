import config from '../config'

export default {
	sendRequest (requestData){
		return $.post('api/notice-board/noticeboardTableData', requestData)
	},
	/*This function will accept these parameters
	* selectedPageNumber, sortingObject, criteriaOption*/
	async get () {
		let requestData = this.buildRequest()

		try {
			let result = await this.sendRequest(requestData)

			this.pageData = result.pageData
			this.auditlogs = result.auditlogs
			this.emitChange()
		} catch (failure) {}
	}
}


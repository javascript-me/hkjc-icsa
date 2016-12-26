import AsyncRequest from './async-request.js'

describe('async-request', () => {
	it('getData', async () => {
		let response = {key: 'val'}
		let reason = {why: 'val'}
		let result

		rewireReject(AsyncRequest, 'doGet', reason)
		result = await AsyncRequest.getData('url', {})
		expect(result.error).to.be.deep.equal(reason)
		rewire()

		rewireResponse(AsyncRequest, 'doGet', response)
		result = await AsyncRequest.getData('url', {})
		expect(result.data).to.be.deep.equal(response)
		rewire()
	})

	it('postData', async () => {
		let response = {key: 'val'}
		let reason = {why: 'val'}
		let result

		rewireReject(AsyncRequest, 'doPost', reason)
		result = await AsyncRequest.postData('url', {})
		expect(result.error).to.be.deep.equal(reason)
		rewire()

		rewireResponse(AsyncRequest, 'doPost', response)
		result = await AsyncRequest.postData('url', {})
		expect(result.data).to.be.deep.equal(response)
		rewire()
	})
})

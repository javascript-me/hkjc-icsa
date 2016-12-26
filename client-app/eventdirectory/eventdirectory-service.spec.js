import EventdirectoryService from './eventdirectory-service'

describe('EventdirectoryService', () => {
	describe('#getEventDirectoryResult', () => {
		it('returns search result', async () => {
			const response = {result: []}
			rewire(EventdirectoryService.__set__('postSearch', () => {
				return Promise.resolve(response)
			}))

			const result = await EventdirectoryService.getEventDirectoryResult()

			rewire()
			expect(result).to.be.deep.equal(response)
		})
	})
})

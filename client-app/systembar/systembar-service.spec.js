import SystembarService from './systembar-service'

describe('SystembarService', () => {
	describe('#getClock', () => {
		it('returns the time on success', async () => {
			const response = {
				randomTime: new Date().toString()
			}
			rewire(SystembarService.__set__('getClock', () => {
				return Promise.resolve(response)
			}))

			const result = await SystembarService.getClock()

			rewire()
			expect(result).to.be.deep.equal(response)
		})

		it('returns null on failure without event', async () => {
			rewire(SystembarService.__set__('getClock', () => {
				return Promise.reject({})
			}))

			const result = await SystembarService.getClock()

			rewire()
			expect(result).to.be.null
		})
	})
})

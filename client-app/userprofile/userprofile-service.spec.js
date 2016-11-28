import UserProfileService from './userprofile-service'

describe('UserProfileService', () => {
	describe('#getUserProfile', () => {
		it('returns user profile', async () => {
			const response = {}
			rewire(UserProfileService.__set__('getUserProfile', () => {
				return Promise.resolve(response)
			}))

			const result = await UserProfileService.getUserProfile('JC10001')

			rewire()
			expect(result).to.be.deep.equal(response)
		})
	})
})

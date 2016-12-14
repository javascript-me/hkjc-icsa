import UserProfileService from './userprofile-service'

describe('UserProfileService', () => {
	describe('#getUserProfile', () => {
		it('returns user profile', async () => {
			const response = {}
			rewire(UserProfileService.__set__('postUserProfile', () => {
				return Promise.resolve(response)
			}))

			const result = await UserProfileService.getUserProfile('JC10001')

			rewire()
			expect(result).to.be.deep.equal(response)
		})
	})

	describe('#getRoles', () => {
		it('returns all roles', async () => {
			const response = {}
			rewire(UserProfileService.__set__('getRoles', () => {
				return Promise.resolve(response)
			}))

			const result = await UserProfileService.getRoles()

			rewire()
			expect(result).to.be.deep.equal(response)
		})
	})
})

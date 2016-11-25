import UserProfileService from './userprofile-service'

describe('UserProfileService', () => {
	describe('#getUserProfile', () => {
		it('returns user profile', async () => {
			let userProfile = await UserProfileService.getUserProfile('userId')
			expect(userProfile).to.be.an('object')
		})
	})
})

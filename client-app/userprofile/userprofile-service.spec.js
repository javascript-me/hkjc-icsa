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

	describe('#getDelegations', () => {
		it('returns user delegations', async () => {
			const response = {}
			rewireResponse(UserProfileService, 'getDelegations', response)
			const result = await UserProfileService.getDelegations('JC10001')
			rewire()
			expect(result).to.be.deep.equal(response)
		})
	})

	describe('#updateUserProfile', () => {
		it('update user profile', async () => {
			const response = {}
			rewireResponse(UserProfileService, 'postUpdateUserProfile', response)
			const result = await UserProfileService.updateUserProfile({})
			rewire()
			expect(result).to.be.deep.equal(response)
		})
	})

	describe('#deleteDelegation', () => {
		it('delete user delegation', async () => {
			const response = {}
			rewireResponse(UserProfileService, 'postDeleteDelegation', response)
			const result = await UserProfileService.deleteDelegation({})
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

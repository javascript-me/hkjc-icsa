import UserProfileUtil from './userprofile-util'
const accountProfiles = require('../json/accountprofiles.json')
const basicUsers = require('../json/baseUserProfile.json')

it('itemFilter() should return object data', () => {
	let result = UserProfileUtil.itemFilter(basicUsers, accountProfiles, undefined)

	expect(result).to.be.a('null')
})

it('itemFilter() should return object data', () => {
	let result = UserProfileUtil.itemFilter(basicUsers, accountProfiles, 'JC10001')

	expect(result.user).to.be.an('object')
	expect(result.account).to.be.an('object')
})

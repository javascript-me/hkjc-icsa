import UserProfileUtil from './userprofile-util'
const accountProfiles = require('../json/accountprofiles.json')
const basicUsers = require('../json/userProfile2.json')

it('itemFilter() should return object data', () => {
	let result = UserProfileUtil.itemFilter(basicUsers, accountProfiles, undefined)

	expect(result).to.be.a('null')
})

it('itemUpdate() should return true or false', () => {
	const bUpdateTrue = UserProfileUtil.itemUpdate(accountProfiles, 'JC10001', {
		'userID': 'JC10001',
		'displayName': 'Bing Hu New',
		'status': 'Active',
		'assignedUserRoles': [{'assignedUserRole': 'Trading User Administrator'}],
		'activationDate': '26/09/2016',
		'deactivationDate': '26/09/2017'
	})
	expect(bUpdateTrue).to.be.true

	const bUpdateFalse = UserProfileUtil.itemUpdate(accountProfiles, 'JC10001xxxxx', {})
	expect(bUpdateFalse).to.be.false
})

it('deleteDelegation() should return true or false', () => {
	const bTrue = UserProfileUtil.deleteDelegation(accountProfiles, 'JC10001', {
		'userID': 'JC10001',
		'delegationIds': ['0001', '0002']
	})
	expect(bTrue).to.be.true

	const bFalse = UserProfileUtil.deleteDelegation(accountProfiles, 'JC10001xxxxx', {})
	expect(bFalse).to.be.false
})

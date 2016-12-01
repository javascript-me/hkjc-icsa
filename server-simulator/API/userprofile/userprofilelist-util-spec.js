import _ from 'lodash'
import UserProfileListUtil from './userprofilelist-util'

const accountProfiles = require('../json/accountprofiles.json')
const basicUsers = require('../json/userProfile2.json')

it('itemFilter() should return object data', () => {
	let allUser = accountProfiles.map((item, index) => {
		let user = _.find(basicUsers, (baseItem, idx) => (item.userID === baseItem.userID))
		let newItem = Object.assign({}, user, item)
		return newItem
	})

	let req = {
		body: {
			username: 'allgood',
			selectedPageNumber: '1',
			sortingObjectFieldName: 'activationDate',
			sortingObjectOrder: 'DESCEND',
			keyword: 'bing',
			dateTimeFrom: '05/09/2016',
			dateTimeTo: '17/09/2017'
			// position: 'Trading Solutions Analyst',
			// accountStatus: 'active',
			// userRole: 'Trading Solutions Analyst'
		}
	}

	var filteredResult = UserProfileListUtil.doFilter(
		allUser,
		req.body.keyword,
		req.body.position,
		req.body.userRole,
		req.body.accountStatus,
		req.body.dateTimeFrom,
		req.body.dateTimeTo
	)

	// console.log(filteredResult)
	expect(filteredResult).to.be.an('array')
})

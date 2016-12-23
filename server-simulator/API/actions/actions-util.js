// import _ from 'lodash'

const accountProfiles = require('../json/accountprofiles.json')

function listFilter (allActions, param) {
	// parse account infomation
	const userID = param.userID
	const accounts = accountProfiles.filter((item) => {
		return item.userID === userID
	})
	if (accounts.length === 0) return []
	const account = accounts[0]
	let bAdmin = false
	account.assignedUserRoles.forEach((item) => {
		if (item.assignedUserRole.indexOf('Administrator') > -1) {
			bAdmin = true
		}
	})

	// get param
	const keyWord = param.keyWord

	// do filter as below
	let results

	if (bAdmin) {
		results = allActions
	} else {
		results = allActions
	}

	if (keyWord) {
		results = results.filter((task) => {
			return task.taskDescription.indexOf(keyWord) > -1
		})
	}

	return results
}

export default {
	listFilter: listFilter
}

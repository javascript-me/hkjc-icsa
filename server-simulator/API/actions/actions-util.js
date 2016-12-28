import _ from 'lodash'

const accountProfiles = require('../json/accountprofiles.json')

function getAccount (userID) {
	const accounts = accountProfiles.filter((item) => {
		return item.userID === userID
	})

	let account = null
	if (accounts.length > 0) {
		account = accounts[0]
	}

	return account
}

function getAdmin (account) {
	let bAdmin = false
	account.assignedUserRoles.forEach((item) => {
		if (item.assignedUserRole.indexOf('Administrator') > -1) {
			bAdmin = true
		}
	})
	return bAdmin
}

function listFilter (allActions, param) {
	// parse account infomation
	const userID = param.userID
	const account = getAccount(userID)
	if (!account) return []
	let bAdmin = getAdmin(account)

	const myTasksData = _.filter(allActions, (item, index) => (userID === item.assigneeUserID))
	const partTasksData1 = _.filter(allActions, (item, index) => {
		return item.assigneeDepartmentId === account.departmentId
	})
	const partTasksData2 = _.filter(allActions, (item, index) => {
		let isSameUserRole = false
		_.each(account.assignedUserRoles, (baseItem, baseIndex) => {
			if (item.assigneeUserRoles === baseItem.assignedUserRole) {
				isSameUserRole = true
			}
		})
		return isSameUserRole
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

	if (param.type === 'allTasks') {
		let allTasks = [].concat(myTasksData, partTasksData1, partTasksData2)
		results = allTasks
	}

	if (param.type === 'myTasks') {
		let myTasks = myTasksData
		results = myTasks
	}

	// generate results
	results = _.clone(results)
	results.forEach((item) => {
		if (item.assigneeUserID) {
			const userAccount = getAccount(item.assigneeUserID)
			item.assigneeUserName = userAccount ? userAccount.displayName : ''
		}
	})

	return results
}

export default {
	listFilter: listFilter
}

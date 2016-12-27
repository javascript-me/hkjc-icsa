import _ from 'lodash'

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

	const myTasksData = _.filter(allActions, (item, index) => (userID === item.assigneeUserID))
	const partTasksData1 = _.filter(allActions, (item, index) => {
		let isSameDepart = false
		_.each(accounts, (baseItem, baseIndex) => {
			if (item.assigneeDepartmentId === baseItem.departmentId) {
				isSameDepart = true
			}
		})
		return isSameDepart
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

	return results
}

export default {
	listFilter: listFilter
}

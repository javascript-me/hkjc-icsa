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

function compare (property) {
	let priorityMap = {
		'Critical': 1,
		'High': 2,
		'Medium': 3,
		'Low': 4
	}

	return function (a, b) {
		return priorityMap[a['priority']] > priorityMap[b['priority']] ? 1 : -1
	}
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
	const keyWord = param.keyword
	const priority = param.priority
	const taskStatus = param.taskStatus
	const assigneeUserID = param.assigneeUserID

	// do filter as below
	let results

	if (bAdmin) {
		results = allActions
	} else {
		results = allActions
	}

	if (keyWord) {
		results = results.filter((task) => {
			return task.taskDescription.toLowerCase().indexOf(keyWord.toLowerCase()) > -1
		})
	}

	if (priority) {
		results = results.filter((task) => {
			return _.findIndex(priority, (item) => {
				return item.value === task.priority
			}) > -1
		})
	}

	if (taskStatus) {
		results = results.filter((task) => {
			return _.findIndex(taskStatus, (item) => {
				return item.value === task.taskStatus
			}) > -1
		})
	}

	if (assigneeUserID) {
		results = results.filter((task) => {
			let beOk = false
			if (task.assigneeUserID) {
				const userAccount = getAccount(task.assigneeUserID)
				if (userAccount && userAccount.displayName.toLowerCase().indexOf(assigneeUserID.toLowerCase()) > -1) {
					beOk = true
				}
			} else if (task.assigneeUserRoles) {
				beOk = task.assigneeUserRoles.toLowerCase().indexOf(assigneeUserID.toLowerCase()) > -1
			} else if (task.assigneeDepartmentId) {
				beOk = task.assigneeDepartmentId.toLowerCase().indexOf(assigneeUserID.toLowerCase()) > -1
			}
			return beOk
		})
	}

	if (param.type === 'allTasks') {
		let allTasks = [].concat(myTasksData, partTasksData1, partTasksData2)
		let newData = allTasks.sort(compare('priority'))
		results = newData
	}

	if (param.type === 'myTasks') {
		let myTasks = myTasksData.sort(compare('priority'))
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

function reassignmentUser (allActions, param) {
	// const userID = param.userID
	const taskID = param.taskID
	const assigneeUserID = param.assigneeUserID

	allActions.forEach((task) => {
		if (task.taskID === taskID) {
			task.assigneeUserID = assigneeUserID
			task.assigneeUserRoles = ''
			task.assigneeDepartmentId = ''
		}
	})

	return {msg: 'OK'}
}

function reassignmentUserRole (allActions, param) {
	// const userID = param.userID
	const taskID = param.taskID
	const assigneeUserRoles = param.assigneeUserRoles

	allActions.forEach((task) => {
		if (task.taskID === taskID) {
			task.assigneeUserID = ''
			task.assigneeUserRoles = assigneeUserRoles
			task.assigneeDepartmentId = ''
		}
	})

	return {msg: 'OK'}
}

export default {
	listFilter: listFilter,
	reassignmentUser: reassignmentUser,
	reassignmentUserRole: reassignmentUserRole
}

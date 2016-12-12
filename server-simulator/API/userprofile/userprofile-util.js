function itemFilter (basicUsers, accountProfiles, userID) {
	let accounts = accountProfiles.filter((item) => {
		return item.userID === userID
	})
	let users = basicUsers.filter((item) => {
		return item.userID === userID
	})

	if (accounts.length === 0 || users.length === 0) {
		return null
	} else {
		return {
			user: users[0],
			account: accounts[0]
		}
	}
}

function itemUpdate (accountProfiles, userID, newObj) {
	const accounts = accountProfiles.filter((item) => {
		return item.userID === userID
	})

	if (accounts.length === 0) {
		return false
	} else {
		const account = accounts[0]

		if (newObj.displayName !== undefined) {
			account.displayName = newObj.displayName
		}

		if (newObj.status !== undefined) {
			account.status = newObj.status
		}

		if (newObj.assignedUserRoles !== undefined) {
			account.assignedUserRoles = newObj.assignedUserRoles
		}

		if (newObj.activationDate !== undefined) {
			account.activationDate = newObj.activationDate
		}

		if (newObj.deactivationDate !== undefined) {
			account.deactivationDate = newObj.deactivationDate
		}

		return true
	}
}

export default {
	itemFilter,
	itemUpdate
}

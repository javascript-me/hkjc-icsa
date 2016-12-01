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

export default {
	itemFilter
}

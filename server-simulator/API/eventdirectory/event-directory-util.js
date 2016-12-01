function handleARS (list, keyword) {
	list.forEach((item) => {
		item.children.forEach((child) => {
			child.competitions = child.competitions.filter((element) => {
				return element.t1.toLowerCase() === keyword.toLowerCase() || element.t2.toLowerCase() === keyword.toLowerCase()
			})
		})
	})

	return list
}

function doFilter (eventdirectory, keyword) {
	if (keyword === '') {
		return eventdirectory.ALL
	}

	if (keyword === 'Premier' || keyword === 'Premier League') {
		return eventdirectory.Premier
	}

	if (keyword === 'ARS') {
		return handleARS(eventdirectory.ARS.slice(0), keyword)
	}

	return []
}

export default {
	doFilter: doFilter
}

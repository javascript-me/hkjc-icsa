import moment from 'moment'

function doFilter (broadcast, params) {
	const keyWord = params.keyWord || ''
	const category = params.category || 'All'
	const sports = params.sports || 'All'
	const dateTimeFrom = params.dateTimeFrom || '18 Sep 1900 00:00'
	const dateTimeTo = params.dateTimeTo || '31 Dec 2099 23:59'

	let result = broadcast

	result = keyWord ? result.filter((al) => {
		const category = al.category ? al.category.toLowerCase() : ''
		const details = al.details ? al.details.toLowerCase() : ''

		return category.indexOf(keyWord.toLowerCase()) >= 0 || details.indexOf(keyWord.toLowerCase()) >= 0
	}) : result

	if (category !== 'All') {
		result = result.filter((al) => {
			return (al.Type === typeValue)
		})
	}

	if (sports !== 'All') {
		result = result.filter((al) => {
			return al.sports.indexOf(sports) >= 0
		})
	}
	
	result = result.filter((al) => {
		const date = moment(al.date_time)
		return moment(dateTimeFrom) <= date && date <= moment(dateTimeTo)
	})

	return result
}

export default {
	doFilter: doFilter
}

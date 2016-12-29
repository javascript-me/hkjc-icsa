import moment from 'moment'

/*
{ username: 'allgood',
  betType: 'football',
  keyword: '',
  ReceiveFrom: '23 Oct 2016 00:00',
  ReceiveTo: '22 Dec 2016 23:59',
  name: 'asda',
  category:
   [ { label: 'Message name', value: '0' },
     { label: 'Sports Type', value: '1' } ],
  in_play: [ { label: 'Not In-Play', value: '0' } ],
  sports_type: [ { label: 'Football', value: 'Football' } ],
  continent: [ { label: 'Europe', value: 'Europe' } ],
  country: [ { label: 'England', value: 'England' } ],
  event_level1: [ { label: 'FA Cup', value: 'FA Cup' } ],
  event_level2: [ { label: 'ARS vs LIV', value: 'ARS vs LIV' } ] }
  */

function doFilter (broadcast, params) {
	const keyword = params.keyword || ''
	const name = params.name || ''
	const category = params.category || 'All'
	const sports = params.sports_type || 'All'
	const inPlay = params.in_play || 'All'
	const continent = params.continent || 'All'
	const country = params.country || 'All'
	const eventLevel1 = params.event_level1 || 'All'
	const eventLevel2 = params.event_level2 || 'All'
	const dateTimeFrom = params.ReceiveFrom || moment().subtract(60, 'days').set({ hour: 0, minute: 0 }).format('DD MMM YYYY HH:mm:ss')
	const dateTimeTo = params.ReceiveTo || moment().set({ hour: 23, minute: 59 }).format('DD MMM YYYY HH:mm:ss')

	let result = JSON.parse(JSON.stringify(broadcast))

	result = keyword ? result.filter((al) => {
		const name = al.name ? al.name.toLowerCase() : ''
		const details = al.details ? al.details.toLowerCase() : ''

		return name.indexOf(keyword.toLowerCase()) >= 0 || details.indexOf(keyword.toLowerCase()) >= 0
	}) : result

	if (name) {
		result = result.filter((al) => {
			return al.name === name
		})
	}

	if (category !== 'All') {
		result = result.filter((al) => {
			var item = category.find(e => { return e.label === al.category })
			return (item && al.category === item.label)
		})
	}

	if (inPlay !== 'All') {
		result = result.filter((al) => {
			const convert = inPlay.map(e => { return e.label }).join(' , ').indexOf('Non') >= 0
			return (al.in_play === !convert)
		})
	}

	if (sports !== 'All') {
		result = result.filter((al) => {
			var item = sports.find(e => { return e.label === al.sports_type })
			return (item && al.sports_type === item.label)
		})
	}

	if (continent !== 'All') {
		result = result.filter((al) => {
			var item = continent.find(e => { return e.label === al.continent })
			return (item && al.continent === item.label)
		})
	}

	if (country !== 'All') {
		result = result.filter((al) => {
			var item = country.find(e => { return e.label === al.country })
			return (item && al.country === item.label)
		})
	}

	if (eventLevel1 !== 'All') {
		result = result.filter((al) => {
			var item = eventLevel1.find(e => { return e.label === al.event_level1 })
			return (item && al.event_level1 === item.label)
		})
	}

	if (eventLevel2 !== 'All') {
		result = result.filter((al) => {
			var item = eventLevel2.find(e => { return e.label === al.event_level2 })
			return (item && al.event_level2 === item.label)
		})
	}

	result = result.filter((al) => {
		const date = moment(al.distribution_date)
		return moment(dateTimeFrom) <= date && date <= moment(dateTimeTo)
	})

	return result
}

export default {
	doFilter: doFilter
}

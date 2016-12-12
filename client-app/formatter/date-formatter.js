import Moment from 'moment'

function toDDMMMYYY (source) {
	return Moment(source, 'DD MMM YYYY HH:mm:ss').format('DD MMM YYYY')
}

function toDDMMMYYYHHMMSS (source) {
	return Moment(source, 'DD MMM YYYY HH:mm:ss').format('DD MMM YYYY HH:mm:ss')
}

export default {
	toDDMMMYYY: toDDMMMYYY,
	toDDMMMYYYHHMMSS: toDDMMMYYYHHMMSS
}

import Moment from 'moment'

function formatDistributionTimeShortWay (dateStr) {
	return Moment(dateStr, 'DD MMM YYYY HH:mm:ss').format('DD MMM YYYY')
}

function formatDistributionTime (dateStr) {
	return Moment(dateStr, 'DD MMM YYYY HH:mm:ss').format('DD MMM YYYY HH:mm:ss')
}

export default {
	formatDistributionTimeShortWay: formatDistributionTimeShortWay,
	formatDistributionTime: formatDistributionTime
}

// import _ from 'lodash'
// import PubSub from '../pubsub'

export default class AddAccountProcess {
	getAccountData () {
		return $.post('./API/userprofile/outsidedata')
	}

}

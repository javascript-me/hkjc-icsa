// import _ from 'lodash'
// import PubSub from '../pubsub'

export default class AddAccountProcess {
	constructor () {
		this.step = 1
		this.curentSelectUser = null
		this.userList = []
	}
	getAccountData () {
		return $.post('./API/userprofile/outsidedata')
	}

}

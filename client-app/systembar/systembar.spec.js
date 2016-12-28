import React from 'react'
import { shallow } from 'enzyme'

import Systembar from './systembar'

const userProfile = {
	'username': 'allgood',
	'fullname': 'All Good',
	'userID': 'JC10001',
	'authorizations': {
		'login.*': '*',
		'dashboard.form1.*': 'read',
		'dashboard.form2.fieldX': 'read|write|audit'
	},
	'noticeboardAndBroadcastSetting': {
		'display': 'bottom'
	}
}

const userInfo = {
	'id': 'id001',
	'firstName': 'Bing',
	'lastName': 'Hu',
	'displayName': 'Bing Hu',
	'userID': 'JC10001',
	'position': 'Trading Manager',
	'staffID': '0000001',
	'phoneNumber': '+852 9232 1223',
	'emailAddress': 'bing_hu@hkjc.com',
	'homeAddress': 'Flat 8, HKJC Building, Block 1 Jockey Road, Central, Hong Kong'
}

const tasks = {
	'allgood': {
		'userID': 'allgood',
		'status': 200,
		'tasks': {

		},
		'num': 3
	},
	'somegood': {
		'userID': 'somegood',
		'status': 200,
		'tasks': {

		},
		'num': 6
	}
}

describe('<Systembar />', () => {
	it('send the request to get time', () => {
		const getTime = sinon.stub().returns({})
		rewire(Systembar.__set__('SystembarService', { getClock: getTime }))

		const getClock = Systembar.__get__('getClock')

		getClock()

		rewire()
		expect(getTime.calledOnce).to.be.true
	})

	it('systembar render', async () => {
		const hasProfileCallback = sinon.stub().returns(true)
		const getProfileCallback = sinon.stub().returns(userProfile)
		rewireKeyVal(Systembar, 'LoginService', {
			hasProfile: hasProfileCallback,
			getProfile: getProfileCallback
		})
		const wrapper = shallow(<Systembar />)
		rewire()
		expect(hasProfileCallback.calledOnce).to.be.true
		expect(getProfileCallback.calledOnce).to.be.true

		const instance = wrapper.instance()
		const refs = instance.refs = {}
		expect(wrapper.find('div.row-systembar')).to.have.length(1)

		rewireService(Systembar, 'LoginService', 'getUserinfo', userInfo)
		instance.componentDidMount()
		instance.componentWillUnmount()
		await instance.getUserinfo()
		rewire()
		expect(instance.state.userinfo).to.be.deep.equal(userInfo)

		instance.showClock()
		instance.hideClock()
		instance.goOther()
		instance.tick({ date: 1 })

		const logoutCallback = sinon.spy()
		rewireKeyVal(Systembar, 'LoginService', {
			logout: logoutCallback
		})
		instance.logout()
		rewire()
		expect(logoutCallback.calledOnce).to.be.true

		const showCallback = sinon.spy()
		refs.logout = {
			show: showCallback
		}
		rewireService(Systembar, 'LoginService', 'getTasksNum', tasks)
		await instance.showComfirmPopup()
		rewire()
		expect(showCallback.calledOnce).to.be.true
	})
})

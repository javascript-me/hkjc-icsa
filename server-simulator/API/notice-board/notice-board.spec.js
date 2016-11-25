import React from 'react'
import { shallow } from 'enzyme'
import NoticeBoardMockAPI from './index'

let responseStatusEvent = sinon.spy()
let responseSendEvent = sinon.spy()
let response = {
	status: responseStatusEvent,
	send: responseSendEvent
}

describe('NoticeBoard MockAPI', () => {
	it('will response in 403 http code when could not get username from request', () => {
		
	})

	it('will response in 200 http code when could get username from request', () => {
		
	})

	it('will response an array when could get username from request', () => {
		
	})

	it('will not response any notices earlier than six months ago', () => {
		
	})

	it('will response an array sort by system_distribution_time column in DESC', () => {
		
	})

	it('will only response an array with alert_name within "Alert" and "Critical" ', () => {
		
	})
})
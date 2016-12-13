import NoticeBoardUtil from './notice-board-util'
import {assert} from 'chai'

const jsonAlerts = require('../json/notice-alerts.json') || {}

describe('notice-board service', () => {
	it('updateAcknowledgeStatusById() can update specific element acknowledge status by id', () => {
		assert.equal('Acknowledged', jsonAlerts.allgood[3].alert_status)

		NoticeBoardUtil.updateAcknowledgeStatusById(jsonAlerts.allgood, '0004', 'Unacknowledge')

		assert.equal('New', jsonAlerts.allgood[3].alert_status)

		NoticeBoardUtil.updateAcknowledgeStatusById(jsonAlerts.allgood, '0004', 'Acknowledge')

		assert.equal('Acknowledged', jsonAlerts.allgood[3].alert_status)
	})
})

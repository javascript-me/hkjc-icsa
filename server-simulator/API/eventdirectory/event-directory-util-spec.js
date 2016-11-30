import { assert } from 'chai'
import EventDirectoryUtil from './event-directory-util'
const eventdirectory = require('../json/eventdirectory.json')

it('doFilter() should return less data', () => {
	var result = EventDirectoryUtil.doFilter(eventdirectory, 'ARS')
	assert.equal(8, result.length)

	assert.equal('ARS', result[0].children[0].competitions[0].t1)
	assert.equal('ARS', result[0].children[0].competitions[1].t1)
})


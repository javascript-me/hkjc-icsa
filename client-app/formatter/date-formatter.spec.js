import {assert} from 'chai'
import DateFormatter from './date-formatter'

describe('Test DateFormatter', () => {
	it('toDDMMMYYY() should return short date string', () => {
		assert.equal('01 Aug 2016', DateFormatter.toDDMMMYYY('01 August 2016 12:30:30'))
	})

	it('toDDMMMYYYHHMMSS() shuld return long date string', () => {
		assert.equal('01 Aug 2016 12:30:30', DateFormatter.toDDMMMYYYHHMMSS('01 August 2016 12:30:30'))
	})
})

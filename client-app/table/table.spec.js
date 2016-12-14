import React from 'react'
import { shallow } from 'enzyme'
import Table from './'

describe('Table', () => {
	it('Throw error without columns', () => {
		try {
			shallow(<Table />)
		} catch (e) {
			const err = new Error('Cannot read property \'contextTypes\' of undefined')
			expect(e).to.eql(err)
		}
	})
})

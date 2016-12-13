import {assert} from 'chai'

it('Array.filter() should not change original data', () => {
	var values = [1, 2, 3]
	var filteredValues = values.filter((element) => {
		return element === 1
	})
	assert.equal(3, values.length)
	assert.equal(1, filteredValues.length)
})


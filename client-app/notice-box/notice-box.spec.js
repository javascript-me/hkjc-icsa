import {assert} from 'chai'
import ClassNames from 'classnames'

it('ClassNames should return concat string', () => {
    assert.equal(2, 2)
    assert.equal("abc ddd", ClassNames("abc", "ddd"))
    assert.equal("abc", ClassNames("abc", ""))
})

import {assert} from 'chai'
import React from 'react'
import {mount} from 'enzyme'
import ResourceList from './resource-list'

describe('ResourceList', () => {

    it('render() should be working fine', () => {
        assert.equal(1, 1)
        let resources = [
            'ubuntu',
            'firefox3',
            'core-duo'
        ]
        let component = mount(<ResourceList resources={resources} />)
        assert.equal(1, component.find('.resource-list').length)

    })

})



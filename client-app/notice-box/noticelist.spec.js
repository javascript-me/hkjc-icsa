import React from 'react'
import {assert} from 'chai'
import ClassNames from 'classnames'
import {shallow} from 'enzyme'
import Noticelist from './noticelist'

it('ClassNames should return concat string', () => {
	assert.equal(2, 2)
	assert.equal('abc ddd', ClassNames('abc', 'ddd'))
	assert.equal('abc', ClassNames('abc', ''))
})

it('OR relationship', () => {
	assert.equal('hello', (undefined || 'hello'))
	assert.equal('hello', ('' || 'hello'))
	assert.equal('ddd', ('ddd' || 'hello'))
})

describe('<Noticelist>', () => {
	let allTasks

	beforeEach(() => {
		allTasks = require('../../server-simulator/API/json/actions.json')
	})

	it('A list will be created when render notice box component', () => {
		let wrapper = shallow(<Noticelist data={allTasks} />)
		let instance = wrapper.instance()
		let noticeBoxItem = wrapper.find('.notice-box')
		assert.equal(1, noticeBoxItem.length)
		let notices = wrapper.find('.list-box-right')
		assert.equal(1, notices.length)
		assert.equal(allTasks.length, notices.node.props.children.length)

		instance.getNoticeBoxClassNames()
		instance.getListBoxClassName()
	})

	it('A notice box can be set to visible or invisible. By default, it is set to invisible. ', () => {
		let wrapper0 = shallow(<Noticelist data={allTasks} />)
		assert.equal('notice-box not-visible', wrapper0.find('.notice-box').node.props.className)

		let wrapper1 = shallow(<Noticelist data={allTasks} visible={false} />)
		assert.equal('notice-box not-visible', wrapper1.find('.notice-box').node.props.className)

		let wrapper2 = shallow(<Noticelist data={allTasks} visible />)
		assert.equal('notice-box', wrapper2.find('.notice-box').node.props.className)
	})

	it('Test more classNames', () => {
		let wrapper = shallow(<Noticelist data={allTasks} />)
		let notices = wrapper.find('.list-box-right')

		let child = notices.node.props.children[0]
		assert.equal('blink', child.props.className)

		let rows = wrapper.find('.row')
		assert.equal(allTasks.length, rows.length)

		let row = rows.nodes[0].props.children
		assert.equal(3, row.length)

		let message = row[0]
		assert.equal('notice-title', message.props.className)

		assert.ok(message.props.children.props.children.length > 0)
		assert.equal('wrap-text', message.props.children.props.className)
	})
})

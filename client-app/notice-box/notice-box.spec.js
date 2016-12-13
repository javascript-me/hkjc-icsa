import React from 'react'
import {assert} from 'chai'
import ClassNames from 'classnames'
import {shallow} from 'enzyme'
import NoticeBox from './notice-box'

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

describe('<NoticeBox>', () => {
	let allNotices

	beforeEach(() => {
		allNotices = require('../../server-simulator/API/json/notice-alerts.json').allgood
	})

	it('A list will be created when render notice box component', () => {
		let wrapper = shallow(<NoticeBox notices={allNotices} />)

		let noticeBoxItem = wrapper.find('.notice-box')
		assert.equal(1, noticeBoxItem.length)

		let notices = wrapper.find('.list-box-right')
		assert.equal(1, notices.length)
		assert.equal(122, notices.node.props.children.length)
	})

	it('A notice box can be set to visible or invisible. By default, it is set to invisible. ', () => {
		let wrapper0 = shallow(<NoticeBox notices={allNotices} />)
		assert.equal('notice-box not-visible', wrapper0.find('.notice-box').node.props.className)

		let wrapper1 = shallow(<NoticeBox notices={allNotices} visible={false} />)
		assert.equal('notice-box not-visible', wrapper1.find('.notice-box').node.props.className)

		let wrapper2 = shallow(<NoticeBox notices={allNotices} visible />)
		assert.equal('notice-box', wrapper2.find('.notice-box').node.props.className)
	})

	it('onOpenDetail event can be triggered', () => {
		let onOpenDetail = sinon.spy()
		let wrapper = shallow(<NoticeBox notices={allNotices} onOpenDetail={onOpenDetail} />)

		assert.equal(0, onOpenDetail.callCount)
		wrapper.find('.notice-title').first().simulate('click', {})
		assert.equal(1, onOpenDetail.callCount)
	})

/*	it('Id can be send when onOpenDetail event is triggered', (done) => {
		let inputNotice = {id: '0001'}

		let wrapper = shallow(<NoticeBox notices={allNotices} onOpenDetail={
			(notice) => {
				assert.equal(inputNotice.id, notice.id)
				done()
			}
		} />)
		wrapper.find('.notice-title').first().simulate('click', inputNotice)
	}) */

	it('Test more classNames', () => {
		let wrapper = shallow(<NoticeBox notices={allNotices} />)
		let notices = wrapper.find('.list-box-right')

		let child = notices.node.props.children[0]
		assert.equal('blink', child.props.className)

		let rows = wrapper.find('.row')
		assert.equal(122, rows.length)

		let row = rows.nodes[0].props.children
		assert.equal(4, row.length)

		let message = row[0]
		assert.equal('notice-title bold-text', message.props.className)

		assert.equal('Aenean commodo ligula eget dolor. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Quisque rutrum.', message.props.children.props.children)
		assert.equal('wrap-text', message.props.children.props.className)
	})
})

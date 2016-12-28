import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import ContextMenu from './'

describe('<ContextMenu />', () => {
	it('hidden initially', () => {
		let wrapper = shallow(<ContextMenu />)

		expect(wrapper.state('isVisible')).to.be.false
	})

	it('no items should be applied', () => {
		let wrapper = shallow(<ContextMenu />)
		let instance = wrapper.instance()

		instance.show({
			items: []
		})

		wrapper.update()

		expect(wrapper.find('.context-menu-item')).to.have.length(0)
	})

	it('custom css class should be applied', () => {
		let wrapper = shallow(<ContextMenu />)
		let instance = wrapper.instance()

		instance.show({
			items: [],
			className: 'my-custom-menu'
		})

		wrapper.update()

		expect(wrapper.find('.my-custom-menu')).to.have.length(1)
	})

	it('items should be rendered', () => {
		let wrapper = shallow(<ContextMenu />)
		let instance = wrapper.instance()

		instance.show({
			items: ['First Item', 'Second Item'],
			className: 'my-custom-menu'
		})

		wrapper.update()

		expect(wrapper.find('.context-menu-item')).to.have.length(2)
	})

	it('renderItem should be called n times', () => {
		let wrapper = shallow(<ContextMenu />)
		let instance = wrapper.instance()

		let renderItem = sinon.spy()

		instance.show({
			items: ['First Item', 'Second Item'],
			className: 'my-custom-menu',
			renderItem: renderItem
		})

		wrapper.update()

		expect(renderItem.calledTwice).to.be.true
	})

	it('onItemSelected should be called', () => {
		let wrapper = shallow(<ContextMenu />)
		let instance = wrapper.instance()

		let onItemSelected = sinon.spy()
		let items = ['First Item', 'Second Item']

		instance.show({
			items: items,
			className: 'my-custom-menu',
			onItemSelected: onItemSelected
		})

		wrapper.update()

		instance.handleItemClick({item: items[0]})

		expect(onItemSelected.calledWith(items[0])).to.be.true
	})
})

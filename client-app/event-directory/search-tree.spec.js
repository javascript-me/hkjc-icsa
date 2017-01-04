import React from 'react'
import { shallow } from 'enzyme'

import sinon from 'sinon'
import ContextMenuService from '../context-menu/context-menu-service'
import SearchTree from './search-tree'

describe('<SearchTree />', () => {
	it('SearchTree render null', () => {
		const result = null
		const wrapper = shallow(<SearchTree result={result} />)
		expect(wrapper.find('div.ed-tree')).to.have.length(1)
	})

	it('SearchTree render []', () => {
		const result = {
			match: 'None',
			data: []
		}
		const wrapper = shallow(<SearchTree result={result} />)
		expect(wrapper.find('div.ed-tree')).to.have.length(1)
	})

	it('SearchTree render all', () => {
		const result = {
			'match': 'L1',
			'data': [
				{
					'name': 'France',
					'children': [
						{
							'name': 'Premier League',
							'records': [
								{
									'status': 'In-Play',
									't1': 'ARS',
									't1Tip': 'Arsenal',
									't2': 'ASV',
									't2Tip': 'Aston Villa',
									'active': 0
								},
								{
									'status': 'In-Play',
									't1': 'SOU',
									't1Tip': 'Southampton',
									't2': 'LIV',
									't2Tip': 'Liverpool',
									'active': 0
								}
							]
						}
					]
				}
			]
		}
		const wrapper = shallow(<SearchTree result={result} />)
		expect(wrapper.find('div.ed-tree')).to.have.length(1)
	})

	it('Should show context menu on item click', () => {
		let contextMenu = {show: sinon.spy()}

		ContextMenuService.init(contextMenu)

		const wrapper = shallow(<SearchTree result={null} />)
		const rect = {top: 100, left: 50, right: 150, bottom: 130}
		const currentTarget = { getBoundingClientRect: () => rect }
		wrapper.instance().onRecordClick({currentTarget: currentTarget})

		let calledArgs = contextMenu.show.args[0][0]
		expect(calledArgs.className).to.equal('ed-tree-record-context-menu')
		expect(calledArgs.position).to.deep.equal({left: rect.right + 10, top: rect.top})
		expect(calledArgs.items).to.deep.equal([
			{name: 'Select bet type offering', link: 'http://example.com'},
			{name: 'Review compilers\' odds', link: 'http://example.com'},
			{name: 'Finalise odds', link: 'http://example.com'},
			{name: 'Edit Trader\'s Rating Table', link: 'http://example.com'}
		])
		expect(calledArgs.element).to.equal(currentTarget)
		expect(calledArgs.renderItem).to.be.func
	})
})

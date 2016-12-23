import React from 'react'
import { mount } from 'enzyme'
import { PageComponent, PageLayer } from './'
import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'
import { TableHeaderColumn } from '../table'

chai.use(chaiEnzyme()) // Note the invocation at the en

const data = [ {id: 1, distribution_date: '28 Oct 2016 15:00:15', name: 'Name', category: 'Sports', detail: 'This is a detail'}, {id: 1, distribution_date: '28 Oct 2016 15:00:15', name: 'Name', category: 'Sports', detail: 'This is a detail'} ]

describe('Page Componente', () => {
	// To allow the functions adjustWidth, adjustHeight
	global.getComputedStyle = function () { return { scrollWidth: 100, width: '100px', fontSize: '14px', fontFamily: 'Roboto Regular' } }

	it('Shoud throw an error', () => {
		try {
			mount(<PageComponent />)
		} catch (e) {
			const error = new Error('Page Component needs to have Childrens to define the content')
			expect(e).to.eql(error)
		}
	})

	it('Render Layer', () => {
		const cpage = mount(<PageLayer typeLayer='top' />)
		expect(cpage).to.not.be.null
	})

	it('Render Page with Table error', () => {
		try {
			mount(<PageComponent>
				<PageLayer typeLayer='body'>
					<TableHeaderColumn dataField='id' autoValue isKey>ID</TableHeaderColumn>
					<TableHeaderColumn dataField='distribution_date'>Distribution Date & Time</TableHeaderColumn>
					<TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
					<TableHeaderColumn dataField='category'>Category</TableHeaderColumn>
					<TableHeaderColumn dataField='detail'>Detail</TableHeaderColumn>
				</PageLayer>
			</PageComponent>)
		} catch (e) {
			const error = new Error('Page Component needs Table Options to render')
			expect(e).to.eql(error)
		}
	})

	it('Render Page with Table Not Results', () => {
		const options = {
			table: {
				options: {}
			},
			dateRange: {
				fieldFrom: 'ReceiveFrom',
				fieldFromTitle: 'Receive From',
				fieldTo: 'ReceiveTo',
				fieldToTitle: 'Receive To'
			}
		}
		const cpage = mount(<PageComponent options={options} tableData={[]}>
			<PageLayer typeLayer='body'>
				<TableHeaderColumn dataField='id' autoValue isKey>ID</TableHeaderColumn>
				<TableHeaderColumn dataField='distribution_date'>Distribution Date & Time</TableHeaderColumn>
				<TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
				<TableHeaderColumn dataField='category'>Category</TableHeaderColumn>
				<TableHeaderColumn dataField='detail'>Detail</TableHeaderColumn>
			</PageLayer>
		</PageComponent>)
		expect(cpage.find('.react-bs-table-no-data')).to.have.length(1)
	})

	it('Render Page with Table and Data ', () => {
		const options = {
			table: {
				options: {}
			},
			dateRange: {
				fieldFrom: 'ReceiveFrom',
				fieldFromTitle: 'Receive From',
				fieldTo: 'ReceiveTo',
				fieldToTitle: 'Receive To'
			}
		}
		const cpage = mount(<PageComponent options={options} tableData={data}>
			<PageLayer typeLayer='body'>
				<TableHeaderColumn dataField='id' autoValue isKey>ID</TableHeaderColumn>
				<TableHeaderColumn dataField='distribution_date'>Distribution Date & Time</TableHeaderColumn>
				<TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
				<TableHeaderColumn dataField='category'>Category</TableHeaderColumn>
				<TableHeaderColumn dataField='detail'>Detail</TableHeaderColumn>
			</PageLayer>
		</PageComponent>)
		expect(cpage.find('.react-bs-container-body tr')).to.have.length.above(1)
	})

	it('Render Page with Table and Filters ', () => {
		const options = {
			table: {
				options: {}
			},
			dateRange: {
				fieldFrom: 'ReceiveFrom',
				fieldFromTitle: 'Receive From',
				fieldTo: 'ReceiveTo',
				fieldToTitle: 'Receive To'
			}
		}
		const cpage = mount(<PageComponent options={options} tableData={data}>
			<PageLayer typeLayer='body'>
				<TableHeaderColumn dataField='id' autoValue isKey>ID</TableHeaderColumn>
				<TableHeaderColumn dataField='distribution_date' dateRange isFilter>Distribution Date & Time</TableHeaderColumn>
				<TableHeaderColumn dataField='name' isFilter>Name</TableHeaderColumn>
				<TableHeaderColumn dataField='category' isFilter filterOptions={{ctrlType: 'select', dataSource: [{id: 1, value: 'option'}, {id: 2, value: 'option'}]}}>Category</TableHeaderColumn>
				<TableHeaderColumn dataField='detail'>Detail</TableHeaderColumn>
			</PageLayer>
		</PageComponent>)
		expect(cpage.find('.column-title')).to.have.length(4)
		expect(cpage.find('.pd-w10 .form-group')).to.have.length(6)
		expect(cpage.find('.pd-w10 .form-group select')).to.have.length(1)
		expect(cpage.find('.pd-w10 .calendar')).to.have.length(2)
	})
})

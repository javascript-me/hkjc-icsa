import React from 'react'
import { mount, shallow } from 'enzyme'
import { TableHeaderColumn, TableComponent } from './'

const data = [ {user: '1', name: '1', age: 5}, {user: '2', name: '2', age: 6} ]
describe('Table', () => {
	// To allow the functions adjustWidth, adjustHeight
	global.getComputedStyle = function () { return { scrollWidth: 100, width: '100px', fontSize: '14px', fontFamily: 'Roboto Regular' } }

	it('Throw error without columns', () => {
		try {
			shallow(<TableComponent />)
		} catch (e) {
			const err = new Error('Cannot read property \'contextTypes\' of undefined')
			expect(e).to.eql(err)
		}
	})

	it('Throw error without key', () => {
		try {
			shallow(
				<TableComponent data={data}>
					<TableHeaderColumn dataField='user'>User</TableHeaderColumn>
					<TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
					<TableHeaderColumn dataField='age'>Age</TableHeaderColumn>
				</TableComponent>
			)
		} catch (e) {
			const err = new Error('Cannot read property \'contextTypes\' of undefined')
			expect(e).to.eql(err)
		}
	})

	it('Render OK', () => {
		const table = shallow(
			<TableComponent data={data} keyField='user'>
				<TableHeaderColumn dataField='user'>User</TableHeaderColumn>
				<TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
				<TableHeaderColumn dataField='age'>Age</TableHeaderColumn>
			</TableComponent>
		)
		expect(table.find('.react-bs-table-container').children()).to.have.length(1)
		expect(table.find('.react-bs-table').children()).to.have.length(2)
	})

	it('Render Pagination', () => {
		const table = shallow(
			<TableComponent data={data} keyField='user' pagination>
				<TableHeaderColumn dataField='user'>User</TableHeaderColumn>
				<TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
				<TableHeaderColumn dataField='age'>Age</TableHeaderColumn>
			</TableComponent>
		)

		expect(table.find('.react-bs-table-container').children()).to.have.length(2)
		expect(table.find('.react-bs-table').children()).to.have.length(2)
	})

	it('Render with No Result', () => {
		const table = mount(
			<TableComponent keyField='user' pagination>
				<TableHeaderColumn dataField='user'>User</TableHeaderColumn>
				<TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
				<TableHeaderColumn dataField='age'>Age</TableHeaderColumn>
			</TableComponent>
		)

		expect(table.find('.react-bs-table-container').children()).to.have.length(2)
		expect(table.find('.react-bs-table').children()).to.have.length(2)
		expect(table.find('.react-bs-table-no-data')).to.have.length(1)
	})

	it('Render with Striped Style', () => {
		const table = mount(
			<TableComponent data={data} striped keyField='user' pagination>
				<TableHeaderColumn dataField='user'>User</TableHeaderColumn>
				<TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
				<TableHeaderColumn dataField='age'>Age</TableHeaderColumn>
			</TableComponent>
		)

		expect(table.find('.react-bs-table-container').children()).to.have.length(2)
		expect(table.find('.react-bs-table').children()).to.have.length(2)
		expect(table.find('.table-striped')).to.have.length(1)
	})

	it('Render with Condensed Style', () => {
		const table = mount(
			<TableComponent data={data} condensed keyField='user' pagination>
				<TableHeaderColumn dataField='user'>User</TableHeaderColumn>
				<TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
				<TableHeaderColumn dataField='age'>Age</TableHeaderColumn>
			</TableComponent>
		)

		expect(table.find('.react-bs-table-container').children()).to.have.length(2)
		expect(table.find('.react-bs-table').children()).to.have.length(2)
		expect(table.find('.table-condensed')).to.have.length(2)
	})

	it('Render with Hover Style', () => {
		const table = mount(
			<TableComponent data={data} hover keyField='user' pagination>
				<TableHeaderColumn dataField='user'>User</TableHeaderColumn>
				<TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
				<TableHeaderColumn dataField='age'>Age</TableHeaderColumn>
			</TableComponent>
		)

		expect(table.find('.react-bs-table-container').children()).to.have.length(2)
		expect(table.find('.react-bs-table').children()).to.have.length(2)
		expect(table.find('.table-hover')).to.have.length(2)
	})

	it('Render with Select Row', () => {
		const table = mount(
			<TableComponent data={data} hover keyField='user' pagination selectRow={{ mode: 'checkbox' }}>
				<TableHeaderColumn dataField='user'>User</TableHeaderColumn>
				<TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
				<TableHeaderColumn dataField='age'>Age</TableHeaderColumn>
			</TableComponent>
		)

		expect(table.find('.react-bs-table-container').children()).to.have.length(2)
		expect(table.find('.react-bs-table').children()).to.have.length(2)
		expect(table.find('.react-bs-select-all')).to.have.length(1)
	})

	it('Render with Select Row checking All/None', () => {
		const mockSelectAll = sinon.spy()
		const table = mount(
			<TableComponent data={data} hover keyField='user' pagination selectRow={{ mode: 'checkbox', onSelectAll: mockSelectAll }}>
				<TableHeaderColumn dataField='user'>User</TableHeaderColumn>
				<TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
				<TableHeaderColumn dataField='age'>Age</TableHeaderColumn>
			</TableComponent>
		)

		expect(table.find('.react-bs-table-container').children()).to.have.length(2)
		expect(table.find('.react-bs-table').children()).to.have.length(2)
		expect(table.find('.react-bs-select-all')).to.have.length(1)
		table.find('.react-bs-select-all').simulate('change', {target: {checked: true}})
		expect(mockSelectAll.callCount).to.be.equals(1)
		table.find('.react-bs-select-all').simulate('change', {target: {checked: false}})
		expect(mockSelectAll.callCount).to.be.equals(2)
	})

	it('Render with Format', () => {
		const custom = (cell, row) => { return parseInt(cell) > 5 ? 'Adult' : 'Kid' }
		const table = mount(
			<TableComponent data={data} hover keyField='user' pagination>
				<TableHeaderColumn dataField='user'>User</TableHeaderColumn>
				<TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
				<TableHeaderColumn dataField='age' dataFormat={custom}>Age</TableHeaderColumn>
			</TableComponent>
		)

		expect(table.find('.react-bs-table-container').children()).to.have.length(2)
		expect(table.find('.react-bs-table').children()).to.have.length(2)
		expect(table.find('.react-bs-container-body tr td div').last().text()).to.be.equals('Adult')
	})
})

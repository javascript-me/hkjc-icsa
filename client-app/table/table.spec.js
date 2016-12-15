import React from 'react'
import { mount, shallow } from 'enzyme'
import { TableHeaderColumn, TableComponent } from './'
import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'

chai.use(chaiEnzyme()) // Note the invocation at the en

const data = [ {user: '1', name: '1', age: 5, expand: [1, 2, 3, 4]}, {user: '2', name: '2', age: 6, expand: [1, 2, 3, 4]} ]
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
			<TableComponent keyField='user'>
				<TableHeaderColumn dataField='user'>User</TableHeaderColumn>
				<TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
				<TableHeaderColumn dataField='age'>Age</TableHeaderColumn>
			</TableComponent>
		)
		expect(table.find('.react-bs-table-container').children()).to.have.length(1)
		expect(table.find('.react-bs-table').children()).to.have.length(2)
	})

	it('Render Pagination', () => {
		const onChange = sinon.spy()
		const options = {
			page: 2,  // which page you want to show as default
			sizePerPage: 1,  // the pagination bar size.
			prePage: 'Prev', // Previous page button text
			nextPage: 'Next', // Next page button text
			firstPage: 'First', // First page button text
			lastPage: 'Last', // Last page button text
			// hideSizePerPage: true, // You can hide the dropdown for sizePerPage
			onPageChange: onChange
		}

		const table = mount(
			<TableComponent data={data} keyField='user' pagination options={options}>
				<TableHeaderColumn dataField='user'>User</TableHeaderColumn>
				<TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
				<TableHeaderColumn dataField='age'>Age</TableHeaderColumn>
			</TableComponent>
		)

		expect(table.find('.react-bs-table-container').children()).to.have.length(2)
		expect(table.find('.react-bs-table').children()).to.have.length(2)

		table.find('.react-bs-table-pagination .pagination .page-link').first().simulate('click')
		expect(onChange.callCount).to.be.equals(1)
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

	it('Render with Specific With', () => {
		const table = mount(
			<TableComponent data={data} hover keyField='user' pagination>
				<TableHeaderColumn dataField='user'>User</TableHeaderColumn>
				<TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
				<TableHeaderColumn dataField='age' width='250'>Age</TableHeaderColumn>
			</TableComponent>
		)

		expect(table.find('.react-bs-table-container').children()).to.have.length(2)
		expect(table.find('.react-bs-table').children()).to.have.length(2)
		expect(table.find('.react-bs-container-body colgroup col').last()).to.have.style('width', '250px')
	})

	it('Render with Column Hide', () => {
		const table = mount(
			<TableComponent data={data} hover keyField='user' pagination>
				<TableHeaderColumn dataField='user'>User</TableHeaderColumn>
				<TableHeaderColumn dataField='name' trClass='pink'>Name</TableHeaderColumn>
				<TableHeaderColumn dataField='age' hidden>Age</TableHeaderColumn>
			</TableComponent>
		)

		expect(table.find('.react-bs-table-container').children()).to.have.length(2)
		expect(table.find('.react-bs-table').children()).to.have.length(2)
		expect(table.find('.react-bs-container-body tr td').last()).to.have.style('display', 'none')
	})

	it('Render with Events', () => {
		const rowClick = sinon.spy()
		const rowDClick = sinon.spy()
		const rowSelect = sinon.spy()

		const selectRowProp = {
			mode: 'checkbox',
			clickToSelect: true,
			onSelect: rowSelect
		}

		const options = {
			onRowClick: rowClick,
			onRowDoubleClick: rowDClick
		}
		const table = mount(
			<TableComponent data={data} keyField='user' pagination options={options} selectRow={selectRowProp}>
				<TableHeaderColumn dataField='user'>User</TableHeaderColumn>
				<TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
				<TableHeaderColumn dataField='age'>Age</TableHeaderColumn>
			</TableComponent>
		)

		expect(table.find('.react-bs-table-container').children()).to.have.length(2)
		expect(table.find('.react-bs-table').children()).to.have.length(2)
		table.find('.react-bs-container-body tr').last().simulate('click')
		expect(rowSelect.callCount).to.be.equals(1)
		expect(rowClick.callCount).to.be.equals(1)
		table.find('.react-bs-container-body tr').last().simulate('dblclick')
		expect(rowDClick.callCount).to.be.equals(1)
		expect(rowClick.callCount).to.be.equals(1)
	})

	it('Render with Edit Cell', () => {
		const cellEditProp = {
			mode: 'click',
			blurToSave: true
		}

		const table = mount(
			<TableComponent data={data} keyField='user' cellEdit={cellEditProp}>
				<TableHeaderColumn dataField='user'>User</TableHeaderColumn>
				<TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
				<TableHeaderColumn dataField='age' editable={{ type: 'textarea' }}>Age</TableHeaderColumn>
			</TableComponent>
		)

		expect(table.find('.react-bs-table-container').children()).to.have.length(1)
		expect(table.find('.react-bs-table').children()).to.have.length(2)
		table.find('.react-bs-container-body tr td').last().simulate('click')
		expect(table.find('.react-bs-container-body tr td textarea')).to.have.length(1)
	})

	it('Render with Sorting', () => {
		const sortEvent = sinon.spy()
		const onComplete = sinon.spy()
		const options = {
			onSortChange: sortEvent,
			afterTableComplete: onComplete,
			sortName: 'user',
			sortOrder: 'desc',
			sortIndicator: false  // disable sort indicator
		}
		const getCaret = d => { return d === 'asc' ? <span className='customCaret'>Up</span> : <span className='customCaret'>Down</span> }
		const table = mount(
			<TableComponent data={data} keyField='user' options={options}>
				<TableHeaderColumn dataField='user' dataSort >User</TableHeaderColumn>
				<TableHeaderColumn dataField='name' caretRender={getCaret}>Name</TableHeaderColumn>
				<TableHeaderColumn dataField='age' editable={{ type: 'textarea' }}>Age</TableHeaderColumn>
			</TableComponent>
		)

		expect(table.find('.react-bs-table-container').children()).to.have.length(1)
		expect(table.find('.react-bs-table').children()).to.have.length(2)
		expect(table.find('.react-bs-table .order')).to.have.length(1)
		expect(table.find('.react-bs-table .customCaret')).to.have.length(1)
		table.find('.react-bs-container-header th').first().simulate('click')
		expect(onComplete.callCount).to.be.equals(1)
		expect(sortEvent.callCount).to.be.equals(1)
	})

	it('Render with Expand Column', () => {
		const isExpandable = (row) => { return row.user === '1' }
		const renderExpand = (row) => { return <select className='expand'>{ row.expand.map((e, i) => <option key={i}>{e}</option>) }</select> }

		const table = mount(
			<TableComponent data={data} hover keyField='user' pagination expandableRow={isExpandable} expandComponent={renderExpand}>
				<TableHeaderColumn dataField='user'>User</TableHeaderColumn>
				<TableHeaderColumn dataField='name' trClass='pink'>Name</TableHeaderColumn>
				<TableHeaderColumn dataField='age' hidden>Age</TableHeaderColumn>
			</TableComponent>
		)

		expect(table.find('.react-bs-table-container').children()).to.have.length(2)
		expect(table.find('.react-bs-table').children()).to.have.length(2)
		expect(table.find('.react-bs-container-body .expand')).to.have.length(1)
	})
})

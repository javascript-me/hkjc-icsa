import React, { PropTypes } from 'react'
import classNames from 'classnames'
import _ from 'underscore'

import UserProfileService from './userprofile-service'

const TableHeader = (props) => (<thead className='table-header'>
	<tr>
		<th className='th-header'>
			<div className={classNames('my-checkbox', { checked: props.checkedAll })} onClick={() => { props.handleCheckAll() }} />
		</th>
		{props.header && props.header.map((item, idx) => (
			<th key={item.label} onClick={(e) => { props.handleSort(idx) }}
				className={classNames('sort-icon', {
					'sort-up': (props.sortInfo.index === idx && props.sortInfo.sortType === 'up'),
					'sort-down': (props.sortInfo.index === idx && props.sortInfo.sortType === 'down')
				})}>{item.label}</th>
		))}
	</tr>
</thead>)

TableHeader.propTypes = {
	header: React.PropTypes.array,
	handleSort: React.PropTypes.func,
	sortInfo: React.PropTypes.object,
	checkedAll: React.PropTypes.bool,
	handleCheckAll: React.PropTypes.func
}

const TableRow = (props) => {
	return (<tbody>
		{props.data && props.data.map((item, idx) => (<tr key={idx + 'row'}>
			<td className='tr-header'><div className={classNames('my-checkbox', { checked: item.checked })} onClick={() => { props.handleItemClick(item) }} /></td>
			{props.fields.map((rol, idx) => (<td key={rol}>{item[rol]}</td>))}
		</tr>))}

	</tbody>)
}

TableRow.propTypes = {
	data: React.PropTypes.array,
	handleItemClick: React.PropTypes.func,
	fields: React.PropTypes.array
}

export { TableHeader, TableRow }

const header = [
	{label: 'User Role', field: 'roleName'}
]

export default React.createClass({
	displayName: 'RolesContainer',
	propTypes: {
		header: PropTypes.array,
		inputSelected: PropTypes.array
	},
	getDefaultProps () {
		return {
			header
		}
	},
	getInitialState () {
		this.checkedAll = false
		this.tableData = []
		this.currentSortInfo = { index: 0, sortType: 'up' }
		this.fields = _.map(this.props.header, item => item.field)
		return {
			showItems: []
		}
	},
	componentDidMount () {
		this.getRoles()
	},
	getUpdateRoles () {
		return this.tableData.filter((item) => {
			return item.checked
		}).map((item) => {
			return item.roleName
		})
	},
	sortItemsByCheck (showItems) {
		let checkedArray = []
		let unCheckedArray = []
		showItems.forEach((item) => {
			if (item.checked) {
				checkedArray.push(item)
			} else {
				unCheckedArray.push(item)
			}
		})
		return checkedArray.concat(unCheckedArray)
	},
	doSort (index, items) {
		let field = this.fields[index]
		let showItems = _.sortBy(items, (item) => (item[field]))
		if (this.currentSortInfo.sortType === 'down') {
			showItems.reverse()
		}
		return showItems
	},
	handleSort (index) {
		this.currentSortInfo = {
			index,
			sortType: this.currentSortInfo.sortType === 'down' ? 'up' : 'down'
		}
		let showItems = this.doSort(index, this.state.showItems)
		this.setState({ showItems: this.sortItemsByCheck(showItems) })
	},
	filterItem (keyword, fields, items) {
		let showItems = _.filter(items, (item, idx) => {
			let result = false

			if (!keyword) {
				return true
			}

			for (let field of fields) {
				if ((item[field]) && (item[field].toLowerCase().indexOf(keyword) > -1)) {
					result = true
				}
			}

			return result
		})

		showItems = this.doSort(0, showItems)

		return this.sortItemsByCheck(showItems)
	},
	initCheckedAll (items) {
		let allSelected = true
		items.forEach((item) => {
			if (!item.checked) {
				allSelected = false
			}
		})
		this.checkedAll = allSelected
	},
	handleInputChange (e) {
		let keyword = e.target.value.toLowerCase()
		let showItems = this.filterItem(keyword, this.fields, this.tableData)
		this.initCheckedAll(showItems)
		this.setState({showItems})
	},
	handleCheckAll () {
		this.checkedAll = !this.checkedAll
		if (this.checkedAll) {
			this.state.showItems.forEach((item) => {
				item.checked = true
			})
			this.setState({ showItems: this.state.showItems })
		} else {
			this.state.showItems.forEach((item) => {
				item.checked = false
			})
			this.setState({ showItems: this.state.showItems })
		}
	},
	handleItemClick (item) {
		item.checked = !item.checked
		this.forceUpdate()
	},
	render () {
		return (
			<div ref='root' className='roles-container'>
				<div className='filter-cmp-container'>
					<div className='body'>
						<div className='serch-header'>
							<input type='text' maxLength='100' placeholder='Search with keywords & filters' onChange={this.handleInputChange} />
							<img className='search-icon' src='common/search.svg' />
						</div>
						<div className='content'>
							<table className='table'>
								<TableHeader header={this.props.header} handleSort={this.handleSort} sortInfo={this.currentSortInfo} checkedAll={this.checkedAll} handleCheckAll={this.handleCheckAll} />
								<TableRow data={this.state.showItems} fields={this.fields} handleItemClick={this.handleItemClick} />
							</table>
						</div>
					</div>
				</div>
			</div>
		)
	},
	async getRoles () {
		let roles = []
		roles = await UserProfileService.getRoles()
		this.tableData = roles
		this.tableData.forEach((item) => {
			let obj = _.find(this.props.inputSelected, (selected) => {
				return selected.assignedUserRole === item.roleName
			})
			if (obj) {
				item.checked = true
			}
		})

		let showItems = this.filterItem('', this.fields, this.tableData)
		this.initCheckedAll(showItems)
		this.setState({showItems})
	}
})

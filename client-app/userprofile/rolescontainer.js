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
		{props.data && props.data.map((item, idx) => (<tr key={idx + 'row'} className={classNames({ activeLine: item.checked })}>
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
		this.currentSortInfo = { index: null, sortType: null }
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
	filterItem (keyword, fields, items) {
		return _.filter(items, (item, idx) => {
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
	handleSort (index) {
		let field = this.fields[index]

		if (this.currentSortInfo.index !== index || this.currentSortInfo.sortType === 'down') {
			this.currentSortInfo = {
				index,
				sortType: 'up'
			}

			this.setState({ showItems: _.sortBy(this.state.showItems, (item) => (item[field])) })
		} else {
			this.currentSortInfo = {
				index,
				sortType: 'down'
			}

			let reverse = []
			for (let item of this.state.showItems) {
				reverse.unshift(item)
			}
			this.setState({ showItems: reverse })
		}
	},
	render () {
		return (
			<div ref='root' className='roles-container'>
				<div className='filter-cmp-container'>
					<div className='body'>
						<div className='serch-header'>
							<input type='text' placeholder='Search with keywords & filters' onChange={this.handleInputChange} />
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

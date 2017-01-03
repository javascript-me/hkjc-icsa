import React, { PropTypes } from 'react'
import classNames from 'classnames'
import _ from 'underscore'

import UserProfileService from '../user-profile-service.js'
import LoginService from '../../login/login-service'

const TableHeader = (props) => (<thead className='table-header'>
	<tr>
		<th className='th-header' />
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
	sortInfo: React.PropTypes.object
}

const TableRow = (props) => {
	return (<tbody>
		{props.data.length === 0 ? <tr><td className='no-result' colSpan='4'>No result found.</td></tr> : props.data && props.data.map((item, idx) => (<tr key={idx + 'row'} className={classNames({ activeLine: item.checked })}>
			<td className='tr-header first-child'>
				<input id={'radio' + idx} type='radio' name='checkbox' onClick={() => { props.handleItemClick(item) }} defaultChecked={item.checked} />
				<label htmlFor={'radio' + idx} className={classNames({ checked: item.checked })} />
			</td>
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
	{label: 'User Name', field: 'displayName'},
	{label: 'User ID', field: 'userID'},
	{label: 'Position / Title', field: 'position'}
]

export default React.createClass({
	displayName: 'UsersContainer',
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
		this.tableData = []
		this.currentSortInfo = { index: 0, sortType: 'up' }
		this.fields = _.map(this.props.header, item => item.field)
		let profile = LoginService.getProfile()
		this.userID = ''
		if (profile) {
			this.userID = profile.userID
		}
		return {
			showItems: [],
			showTempItems: []
		}
	},
	componentDidMount () {
		this.getUsers()
	},
	getDelegation () {
		let result = this.tableData.find((item) => {
			return item.checked
		})
		return result
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
		if (this.state.showTempItems.length !== 0) {
			let showItems = this.doSort(index, this.state.showItems)
			this.setState({ showItems: this.sortItemsByCheck(showItems) })
			this.setState({ showTempItems: this.sortItemsByCheck(showItems) })
		}
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

		if (keyword) {
			this.setState({showTempItems: showItems})
		} else {
			this.setState({showTempItems: ''})
		}
	},
	handleItemClick (item) {
		this.tableData.forEach((baseitem) => {
			if (item !== baseitem) {
				baseitem.checked = false
			}
		})
		item.checked = !item.checked
		this.forceUpdate()
	},
	render () {
		return (
			<div ref='root' className='users-container filter-cmp-container'>
				<div className=''>
					<div className='body'>
						<div className='serch-header'>
							<input type='text' maxLength='100' placeholder='Search with keywords & filters' onChange={this.handleInputChange} />
							<img className='search-icon' src='common/search.svg' />
						</div>
						<div className='content'>
							<table className='table sm-table'>
								<TableHeader header={this.props.header} handleSort={this.handleSort} sortInfo={this.currentSortInfo} checkedAll={this.checkedAll} />
								<TableRow data={this.state.showTempItems} fields={this.fields} handleItemClick={this.handleItemClick} />
							</table>
						</div>
					</div>
				</div>
			</div>
		)
	},
	async getUsers () {
		let users = []
		users = await UserProfileService.getDelegations(this.userID)
		this.tableData = users
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

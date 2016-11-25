import React, { Component } from 'react'
import classnames from 'classnames'
import _ from 'lodash'
import _2 from 'underscore'

class ItemFilter extends Component {
	constructor(props) {
		super(props)

		this.state = {
			showItems: [],
			currentSelectIndex: null,
			filterText: ''
		}
		this.currentSelectItem = null
		this.allUser = this.props.tableData
		this.fields = _.map(this.props.header, item => item.field)
		this.currentSortInfo = { index: null, sortType: null }
		this.handleInputChange = this.handleInputChange.bind(this)
		this.handleItemClick = this.handleItemClick.bind(this)
		this.handleSort = this.handleSort.bind(this)
	}
	render() {
		return (
			<div className="filter-cmp-container">
				<div className="title">{this.props.title}</div>
				<div className="body">
					<div className="serch-header">
						<input type="text" placeholder="Search with keywords & filters" onChange={this.handleInputChange} />
						<img className="search-icon" src="common/search.svg" />
					</div>
					<div className="content">
						<table className="table">
							<TableHeader header={this.props.header} handleSort={this.handleSort} sortInfo={this.currentSortInfo} />
							<TableRow data={this.state.showItems} fields={this.fields} handleItemClick={this.handleItemClick} />
						</table>
					</div>
					<div className="footer">
						<button className={classnames("btn","pull-right","btn-main",{disabled:!this.currentSelectItem})} onClick={() => {this.currentSelectItem && this.props.activeBtn.callback(this.currentSelectItem)}}>{this.props.activeBtn.text || 'Ok'}</button>
						<button className="btn pull-right btn-secondary" onClick={() => {this.props.postiveBtn.callback()}}>{this.props.postiveBtn.text || 'Cancle'}</button>
					</div>
				</div>
			</div>
		)
	}

	filterItem(keyword, fields, items) {
		if (!keyword) {
			return []
		}
		return _.filter(items, (item, idx) => {
			let result = false

			for (let field of fields) {
				if ((item[field]) && (item[field].toLowerCase().indexOf(keyword) > -1)) {
					result = true
				}
			}
			return result

		})
	}

	handleInputChange(e) {
		let keyword = e.target.value.toLowerCase()
		this.setState({ showItems: this.filterItem(keyword, this.fields, this.props.tableData) })
	}

	handleItemClick(item) {
		let flag = !item.checked;
		_.forEach(this.props.tableData, (user, idx) => { user.checked = false })
		item.checked = flag
		this.currentSelectItem = flag && item
		this.forceUpdate()
	}
	handleSort(index) {
		let field = this.fields[index];

		if (this.currentSortInfo.index !== index || this.currentSortInfo.sortType === 'down') {
			this.currentSortInfo = {
				index,
				sortType: 'up'
			}

			this.setState({ showItems: _.sortBy(this.state.showItems, (item) => (item[field])) })
		}
		else {
			this.currentSortInfo = {
				index,
				sortType: 'down'
			}

			let reverse = [];
			for (let item of this.state.showItems) {
				reverse.unshift(item)
			}
			this.setState({ showItems: reverse });
		}


	}
}
const TableHeader = (props) => (<thead className="table-header">
	<tr>
		<th className="th-header"></th>
		{props.header && props.header.map((item, idx) => (
			<th key={item.label} onClick={(e) => { props.handleSort(idx) } }
				className={classnames("sort-icon", {
					'sort-up': (props.sortInfo.index == idx && props.sortInfo.sortType === 'up'),
					'sort-down': (props.sortInfo.index == idx && props.sortInfo.sortType === 'down')
				})}>{item.label}</th>
		))}
	</tr>
</thead>)

const TableRow = (props) => {
	return (<tbody>
		{props.data && props.data.map((item, idx) => (<tr key={idx + 'row'} className={classnames({ activeLine: item.checked })}>
			<td className="tr-header"><div className={classnames('my-checkbox', { checked: item.checked })} onClick={() => { props.handleItemClick(item) } } ></div></td>
			{props.fields.map((rol, idx) => (<td key={rol}>{item[rol]}</td>))}
		</tr>))}

	</tbody>)
}

export default ItemFilter

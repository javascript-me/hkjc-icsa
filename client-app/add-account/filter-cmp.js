import React, {Component} from 'react'
import _ from 'lodash'

class ItemFilter extends Component {
	constructor(props) {
		super(props)

		this.state = {
			showItems: [],
			currentSelectIndex: null,
			filterText: ''
		}

		this.fields = _.map(this.props.header,item => item.field);
		this.handleInputChange = this.handleInputChange.bind(this)
	}
	render () {
		return (
			<div className="pop-container">
				<div className="title">{this.props.title}</div>
				<div className="body">
					<div className="serch-header">
						<input type="text" placeholder="Search with keywords & filters" onChange={this.handleInputChange} />
						<img className="search-icon" src="common/search.svg"/>
					</div>
					<div className="content">
						<table className="table-striped table">
							<TableHeader header={this.props.header} />
							<TableRow data={this.state.showItems} fields={this.fields} />
						</table>
					</div>
				</div>
			</div>
		)
	}

	filterItem (keyword,fields,items) {
		if(!keyword) {
			return []
		}
		return _.filter(items,(item,idx) => {
			let result = false
			
			for(let field of fields) {
				if((item[field]) && (item[field].toLowerCase().indexOf(keyword) > -1)) {
					result = true
				}
			}
			return result

		})
	}

	handleInputChange (e) {
		let keyword = e.target.value.toLowerCase()
		this.setState({showItems: this.filterItem(keyword,this.fields,this.props.tableData)})
	}
}
const TableHeader = (props) => (<thead className="table-header">
	<tr>
		{ props.header && props.header.map((item,idx) => (
			<th key={item.label}>{item.label}</th>
		) )}
	</tr>
</thead>)

const TableRow = (props) => (<tbody>
	{props.data && props.data.map((item,idx) => (<tr key={idx+'row'}>
		{props.fields.map((rol,idx) => (<td key={rol}>{item[rol]}</td>))}
	</tr>))}
	
</tbody>)

export default ItemFilter
